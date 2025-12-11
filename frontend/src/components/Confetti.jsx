import React, { useEffect, useState } from 'react';
import './Confetti.css';

export default function Confetti({ trigger }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (trigger) {
            // Create 50 confetti particles
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                animationDelay: Math.random() * 0.3,
                backgroundColor: [
                    '#4285f4', // Google Blue
                    '#ea4335', // Google Red
                    '#fbbc04', // Google Yellow
                    '#34a853', // Google Green
                    '#ff6b6b',
                    '#4ecdc4',
                    '#45b7d1',
                    '#ffa07a'
                ][Math.floor(Math.random() * 8)]
            }));

            setParticles(newParticles);

            // Clear confetti after animation
            const timer = setTimeout(() => {
                setParticles([]);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [trigger]);

    if (particles.length === 0) return null;

    return (
        <div className="confetti-container">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="confetti-particle"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.animationDelay}s`,
                        backgroundColor: particle.backgroundColor
                    }}
                />
            ))}
        </div>
    );
}
