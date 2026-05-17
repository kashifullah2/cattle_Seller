import React, { useState, useEffect } from 'react';

const images = [
  '/images/hero/cow.png',
  '/images/hero/horse.png',
  '/images/hero/sheep.png'
];

const HeroSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-2000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: `url(${img})`,
            zIndex: index === currentImage ? 1 : 0
          }}
        >
            <div className={`absolute inset-0 bg-cover bg-center ${index === currentImage ? 'animate-kenburns' : ''}`}
                 style={{ backgroundImage: `url(${img})` }}
            />
        </div>
      ))}
      {/* Premium Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/50 to-gray-900/90 z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] z-10"></div>
    </div>
  );
};

export default HeroSlider;
