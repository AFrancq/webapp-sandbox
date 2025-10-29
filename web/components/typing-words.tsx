import React, { useState, useEffect } from 'react';

export default function TypingAnimation() {
  const words = [
    "Graduate Schools",
    "Startup Incubators",
    "Quantum Programs",
    "Machine Learning",
    "Medical Schools",
    "PhD Opportunities"
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const word = words[currentWordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (currentText.length < word.length) {
          setCurrentText(word.substring(0, currentText.length + 1));
          setTypingSpeed(150);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(word.substring(0, currentText.length - 1));
          setTypingSpeed(100);
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed, words]);

  return (
    <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4">
      <div className='justify-center flex'>
        TBD
      </div>
      <div className="text-brand-accent">
        {currentText}
        <span className="animate-pulse">|</span>
      </div>
    </h1>
  );
}