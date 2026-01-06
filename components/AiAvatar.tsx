
import React, { useEffect, useRef, useState } from 'react';

interface AiAvatarProps {
    analyser: AnalyserNode | null;
    isAiSpeaking: boolean;
}

export function AiAvatar({ analyser, isAiSpeaking }: AiAvatarProps) {
    const [volume, setVolume] = useState(0);
    const [isBlinking, setIsBlinking] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Blinking logic
    useEffect(() => {
        const blinkLoop = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200); // Blink duration

            // Random interval between 3s and 6s
            const nextBlink = Math.random() * 3000 + 3000;
            setTimeout(blinkLoop, nextBlink);
        };

        const initialTimeout = setTimeout(blinkLoop, 3000);
        return () => clearTimeout(initialTimeout);
    }, []);

    useEffect(() => {
        if (!analyser || !isAiSpeaking) {
            setVolume(0);
            return;
        }

        let animationFrameId: number;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume from frequency data
            let sum = 0;
            // Focus on speech frequencies (roughly 300Hz - 3400Hz)
            // Bin counts depend on sample rate (24000Hz) and FFT size (2048 default usually)
            // Simple average is fine for lip sync effect
            const lowerBound = Math.floor(dataArray.length * 0.1); // Skip very low rumble
            const upperBound = Math.floor(dataArray.length * 0.5); // Skip high hiss

            for (let i = lowerBound; i < upperBound; i++) {
                sum += dataArray[i];
            }

            const average = sum / (upperBound - lowerBound);
            // Normalize to 0-1 range with some sensitivity adjustment
            const normalizedVolume = Math.min(1, Math.max(0, (average - 10) / 100)); // Adjust denominator for sensitivity

            setVolume(normalizedVolume);
            animationFrameId = requestAnimationFrame(updateVolume);
        };

        updateVolume();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [analyser, isAiSpeaking]);

    return (
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-indigo-100">
            {/* Base Image (Idle) - Always visible */}
            <img
                src="/ai-teacher-idle.png"
                alt="AI Teacher"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            />

            {/* Speaking Image - Opacity controlled by volume */}
            <img
                src="/ai-teacher-speaking.png"
                alt="AI Teacher Speaking"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
                style={{ opacity: isAiSpeaking ? Math.min(1, volume * 1.5 + 0.1) : 0 }}
            />

            {/* Blinking Image - Overlays everything when blinking */}
            <img
                src="/ai-teacher-blinking.png"
                alt="AI Teacher Blinking"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
                style={{ opacity: isBlinking ? 1 : 0 }}
            />

            {/* Optional: Simple glow effect based on volume */}
            <div
                className="absolute inset-0 rounded-full border-4 border-indigo-500 opacity-0 transition-opacity duration-100"
                style={{ opacity: volume * 0.5 }}
            />
        </div>
    );
}
