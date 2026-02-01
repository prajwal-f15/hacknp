'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollGradient() {
  useEffect(() => {
    // Define gradient color stops for different scroll positions
    const gradients = [
      'linear-gradient(120deg, #0f2027, #203a43, #2c5364)',
      'linear-gradient(120deg, #1a4d5e, #2c5364, #0f3443)',
      'linear-gradient(120deg, #203a43, #1a2a3a, #0f2027)',
      'linear-gradient(120deg, #2c5364, #1a4d5e, #203a43)',
      'linear-gradient(120deg, #0f2027, #203a43, #2c5364)',
    ];

    let currentIndex = 0;

    // Create scroll-based animation
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        const newIndex = Math.min(Math.floor(progress * gradients.length), gradients.length - 1);
        
        if (newIndex !== currentIndex) {
          currentIndex = newIndex;
          gsap.to('body', {
            background: gradients[newIndex],
            duration: 1,
            ease: 'power2.out',
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return null;
}
