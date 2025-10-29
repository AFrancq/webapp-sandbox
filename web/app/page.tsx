'use client';

import TypingAnimation from '@/components/typing-words';
import SlideButton from '@/components/slide-button';
import { useState } from 'react';


export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800">
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-20">
          <div className="border bg-black opacity-80 rounded-lg p-8 w-full h-full overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Next Step!</h2>
            <p className="mb-6">Thank you for getting started. We're excited to help you on your journey.</p>
            <p className="mb-6">Now for the fun part... where do you want to see yourself in the next few years?</p>
            <form className="mb-6">
              <label className="block mb-2">
                <span>Your Goals:</span>
                <textarea
                  className="w-full mt-1 p-2 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  rows={4}
                  placeholder="I want to attend graduate school for AI.."
                ></textarea>
              </label>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <div>
          <TypingAnimation />
        </div>
        <div className="text-center">
          <p className="text-secondary text-lg">Learn how to get where you're going</p>
        </div>
        <div>
          <SlideButton onClick={handleButtonClick}>Get Started</SlideButton>
        </div>
      </div>
    </div>
  );
}
