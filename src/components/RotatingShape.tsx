
import { useState, useEffect, useRef } from 'react';

export const RotatingShape = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const angleX = (mouseY - centerY) / 50;
      const angleY = (mouseX - centerX) / 50;
      
      setRotation({ x: angleX, y: angleY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`w-48 h-48 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      <div 
        className="w-32 h-32 relative"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div className="absolute w-full h-full border-2 border-easyroi-gold/30 rotate-3d"></div>
        <div className="absolute w-full h-full border-2 border-easyroi-gold/30 rotate-3d" 
          style={{ transform: 'rotateX(60deg) rotateY(60deg)' }}></div>
        <div className="absolute w-full h-full border-2 border-easyroi-gold/30 rotate-3d"
          style={{ transform: 'rotateX(120deg) rotateY(120deg)' }}></div>
      </div>
    </div>
  );
};
