import React from 'react';
import Button from '../Button/Button';

const Hero = ({ title, subtitle, buttonText, onButtonClick, children, className = '' }) => {
  return (
    <section className={`relative py-12 sm:py-16 lg:py-24 ${className}`}>
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 leading-relaxed px-2">
              {subtitle}
            </p>
          )}
          {buttonText && (
            <div className="mb-8">
              <Button onClick={onButtonClick} size="lg">
                {buttonText}
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Hero;