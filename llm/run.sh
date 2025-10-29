#!/bin/bash

# Set script to exit immediately if a command exits with a non-zero status
set -e

print_step() {
    echo -e "\033[0;32m==>\033[0m $1"
}

# Variables
if command -v rocm-smi &>/dev/null && rocm-smi &>/dev/null; then
    OLLAMA_IMAGE="ollama/ollama:rocm"
else
    OLLAMA_IMAGE="ollama/ollama:latest"
fi
CONTAINER_NAME="ollama-service"
HOST_PORT=11434
CONTAINER_PORT=11434
DATA_DIR="$HOME/.ollama"
NETWORK_NAME="re-search"
USE_GPU=true  # Set to false to disable GPU
MODEL_NAME="qwen3:8b"  # Default to qwen3:8b, will be set by command line argument

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--model)
            MODEL_NAME="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -m, --model MODEL    Specify model to pull (e.g., qwen3:8b)"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done


# Create data directory if it doesn't exist
mkdir -p $DATA_DIR

# Stop ollama service via systemctl if running
if systemctl is-active --quiet ollama.service; then
    print_step "Stopping ollama service..."
    sudo systemctl stop ollama.service
fi

# Check if container already exists
if docker container inspect $CONTAINER_NAME &>/dev/null; then
    print_step "Container $CONTAINER_NAME already exists. Stopping and removing it."
    docker container stop $CONTAINER_NAME || true
    docker container rm $CONTAINER_NAME || true
fi

# Create Docker network if it doesn't exist
if ! docker network inspect $NETWORK_NAME &>/dev/null; then
    print_step "Creating Docker network: $NETWORK_NAME"
    docker network create $NETWORK_NAME
fi

# Pull the latest image
print_step "Pulling the latest Ollama image..."
docker image pull $OLLAMA_IMAGE

# Check if nvidia-smi is available and working
if $USE_GPU && command -v nvidia-smi &>/dev/null && nvidia-smi &>/dev/null; then
    print_step "Starting Ollama container with GPU acceleration"
    docker container run -d \
        --name $CONTAINER_NAME \
        --network $NETWORK_NAME \
        --gpus all \
        -p $HOST_PORT:$CONTAINER_PORT \
        -v $DATA_DIR:/root/.ollama \
        --restart unless-stopped \
        $OLLAMA_IMAGE
    
    print_step "Ollama is now running on port $HOST_PORT with GPU acceleration"
# Check if rocm-smi is available for AMD GPUs
elif $USE_GPU && command -v rocm-smi &>/dev/null && rocm-smi &>/dev/null; then
  print_step "Starting Ollama container with AMD GPU acceleration"
  docker container run -d \
    --name $CONTAINER_NAME \
    --network $NETWORK_NAME \
    --device /dev/kfd \
    --device /dev/dri \
    -p $HOST_PORT:$CONTAINER_PORT \
    -v $DATA_DIR:/root/.ollama \
    --restart unless-stopped \
    $OLLAMA_IMAGE
  print_step "Ollama is now running on port $HOST_PORT with AMD GPU acceleration"
else
    print_step "NVIDIA GPU not detected or USE_GPU is set to false"
    print_step "Starting Ollama container without GPU acceleration"
    docker container run \
        --name $CONTAINER_NAME \
        --network $NETWORK_NAME \
        -p $HOST_PORT:$CONTAINER_PORT \
        -v $DATA_DIR:/root/.ollama \
        --restart unless-stopped \
        $OLLAMA_IMAGE
    
    print_step "Ollama is now running on port $HOST_PORT (CPU only mode)"
fi

# Install curl in the container if not already installed
if ! docker exec $CONTAINER_NAME command -v curl &>/dev/null; then
    print_step "Installing curl in the container..."
    docker exec $CONTAINER_NAME apt-get update
    docker exec $CONTAINER_NAME apt-get install -y curl
fi

# Wait for the container to be ready
print_step "Waiting for Ollama to be ready..."
while ! docker exec $CONTAINER_NAME curl -s http://localhost:$CONTAINER_PORT/health &>/dev/null; do
    sleep 1
done
print_step "Ollama is ready!"

# Pull the default model if specified
if [ -n "$MODEL_NAME" ]; then
    print_step "Pulling model: $MODEL_NAME"
    docker exec $CONTAINER_NAME ollama pull $MODEL_NAME
else
    print_step "No model specified to pull."
fi

print_step "Container started successfully"
echo "To pull a model, run: docker exec $CONTAINER_NAME ollama pull llama3.1"
echo "To stop the container, run: docker container stop $CONTAINER_NAME"

# Attach to the container if not running in CI
if [ -t 1 ]; then
    print_step "Attaching to $CONTAINER_NAME..."
    docker attach $CONTAINER_NAME
else
    print_warning "Not attaching to the container because not in a terminal."
fi