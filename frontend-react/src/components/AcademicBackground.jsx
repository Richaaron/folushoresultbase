import React from 'react';
import { Book, GraduationCap, Pencil, Sparkles, Star } from 'lucide-react';

const AcademicBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-10 left-10 text-accent-gold opacity-10 animate-float" style={{ animationDelay: '0s' }}>
        <Book size={120} strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 right-10 text-accent-red opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        <GraduationCap size={140} strokeWidth={1} />
      </div>
      <div className="absolute top-1/4 right-20 text-accent-gold opacity-10 animate-float" style={{ animationDelay: '2s' }}>
        <Pencil size={100} strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 left-1/4 text-accent-red opacity-10 animate-float" style={{ animationDelay: '3.5s' }}>
        <Sparkles size={80} strokeWidth={1} />
      </div>
      <div className="absolute top-1/2 left-10 text-accent-gold opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>
        <Star size={60} strokeWidth={1} />
      </div>
      
      {/* Extra floating bits for more depth */}
      <div className="absolute top-20 right-1/3 text-accent-red opacity-5 animate-float" style={{ animationDelay: '4s' }}>
        <Book size={60} strokeWidth={1} />
      </div>
      <div className="absolute bottom-1/3 left-20 text-accent-gold opacity-5 animate-float" style={{ animationDelay: '5s' }}>
        <GraduationCap size={70} strokeWidth={1} />
      </div>
    </div>
  );
};

export default AcademicBackground;
