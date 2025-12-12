import React, { useEffect, useState } from 'react';
import './Confetti.css';

export default function Confetti({ trigger }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (trigger) {
            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
            const newParticles = [];

            for (let i = 0; i < 150; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    delay: Math.random() * 0.5,
                    size: Math.random() * 8 + 4,
                    rotation: Math.random() * 360
                });
            }

            setParticles(newParticles);

            // Clear after animation
            setTimeout(() => setParticles([]), 4000);
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
                        left: `${particle.x}%`,
                        backgroundColor: particle.color,
                        animationDelay: `${particle.delay}s`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        transform: `rotate(${particle.rotation}deg)`
                    }}
                />
            ))}
        </div>
    );
}
