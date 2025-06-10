import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSmoothProgressOptions {
    initialValue?: number;
    minStep?: number;
    maxStep?: number;
    smoothingFactor?: number;
    processingPhaseWeight?: number;
}

/**
 * Hook for managing smooth progress updates for multipart uploads
 * Ensures the progress doesn't jump around and provides a smooth experience
 */
export function useSmoothProgress({
    initialValue = 0,
    minStep = 0.5,
    maxStep = 2,
    smoothingFactor = 0.8,
    // processingPhaseWeight = 20
}: UseSmoothProgressOptions = {}) {
    // Actual raw progress value (0-100)
    const [progress, setProgress] = useState<number>(initialValue);

    // Smoothed progress value for display (0-100)
    const [smoothProgress, setSmoothProgress] = useState<number>(initialValue);

    // Track the last known parts information
    const totalPartsRef = useRef<number>(0);
    const completedPartsRef = useRef<number>(0);
    const partProgressRef = useRef<Record<number, number>>({});

    // Track processing state
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    // Interval ID for animation
    const animationRef = useRef<number | null>(null);    // Calculate actual progress based on parts
    const calculateProgress = useCallback((
        completedParts: number,
        totalParts: number,
        currentPartProgress: number = 0,
        currentPartIndex: number = 0
    ) => {
        if (totalParts === 0) return 0;

        // Save part progress
        if (currentPartIndex > 0) {
            partProgressRef.current[currentPartIndex] = currentPartProgress;
        }

        // Calculate total progress across all parts
        let totalProgress = 0;

        // Sum up completed parts (100% each)
        totalProgress += (completedParts / totalParts) * 100;

        // Add progress from current in-progress part
        if (currentPartIndex > 0 && currentPartProgress > 0 && currentPartIndex <= totalParts) {
            // Weight of one part in the total progress
            const partWeight = 100 / totalParts;
            // Add the partial progress of the current part
            totalProgress += (currentPartProgress / 100) * partWeight;
        }

        // Cap at 100% for upload phase, 80% for processing phase
        return Math.min(Math.max(totalProgress, 0), isProcessing ? 80 : 99.5);
    }, [isProcessing]);

    // Update progress with part information
    const updatePartProgress = useCallback((
        partIndex: number,
        partProgress: number,
        completedParts: number,
        totalParts: number
    ) => {
        if (totalParts > 0) {
            totalPartsRef.current = totalParts;
        }

        if (completedParts >= 0) {
            completedPartsRef.current = completedParts;
        }

        const newProgress = calculateProgress(
            completedPartsRef.current,
            totalPartsRef.current,
            partProgress,
            partIndex
        );

        setProgress(newProgress);
    }, [calculateProgress]);

    // Update overall progress directly
    const updateProgress = useCallback((newProgress: number) => {
        setProgress(Math.min(Math.max(newProgress, 0), 100));
    }, []);    // Set upload phase (uploading or processing)
    const setPhase = useCallback((phase: 'uploading' | 'processing' | 'complete') => {
        if (phase === 'processing') {
            setIsProcessing(true);
            // When entering processing phase, cap progress at 80%
            setProgress(prev => Math.min(prev, 80));
        } else if (phase === 'complete') {
            setIsProcessing(false);
            // Smoothly finish the progress animation
            setProgress(100);
        } else if (phase === 'uploading') {
            setIsProcessing(false);
            // Keep current progress when switching to uploading phase
        }
    }, []);

    // Reset all progress
    const resetProgress = useCallback(() => {
        setProgress(0);
        setSmoothProgress(0);
        setIsProcessing(false);
        totalPartsRef.current = 0;
        completedPartsRef.current = 0;
        partProgressRef.current = {};

        // Stop any running animation
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    }, []);

    // Animate smooth progress towards the actual progress
    useEffect(() => {
        // Function to update smooth progress with animation
        const animateProgress = () => {
            setSmoothProgress(prevSmooth => {
                // Calculate difference between actual and smooth progress
                const diff = progress - prevSmooth;

                // If we're close enough, just set to the target value
                if (Math.abs(diff) < 0.1) {
                    return progress;
                }

                // Calculate step size (larger for bigger differences)
                const step = Math.max(
                    minStep,
                    Math.min(maxStep, Math.abs(diff) / 10)
                );

                // Move towards the target, with smoothing factor
                const delta = diff * smoothingFactor * (step / maxStep);
                return prevSmooth + delta;
            });

            // Continue animation
            animationRef.current = requestAnimationFrame(animateProgress);
        };

        // Start animation
        if (animationRef.current === null) {
            animationRef.current = requestAnimationFrame(animateProgress);
        }

        // Cleanup
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [progress, minStep, maxStep, smoothingFactor]);

    return {
        // Raw progress (0-100)
        progress,

        // Smoothed progress for display (0-100)
        smoothProgress,

        // Is in processing phase
        isProcessing,

        // Functions to update progress
        updateProgress,
        updatePartProgress,
        setPhase,
        resetProgress
    };
}
