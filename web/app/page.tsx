'use client';

import TypingAnimation from '@/components/typing';
import SlideButton from '@/components/slide-button';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <div>
          <TypingAnimation />
        </div>
        <div className="text-center">
          <p className="text-secondary text-lg">Learn how to get where you're going</p>
        </div>
        <div>
          <SlideButton>Get Started</SlideButton>
        </div>
      </div>
    </div>
  );
}
