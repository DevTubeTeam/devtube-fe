import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProcessingStatusProps {
    onComplete?: () => void;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
    onComplete,
}) => {
    const [currentStage, setCurrentStage] = useState(0);
    const stages = [
        'Checking for copyright issues',
        'Processing SD version',
        'Processing HD version',
        'Finalizing video'
    ];

    useEffect(() => {
        // Simulate processing stages
        const interval = setInterval(() => {
            setCurrentStage(prev => {
                if (prev >= stages.length - 1) {
                    clearInterval(interval);
                    if (onComplete) {
                        setTimeout(onComplete, 1000);
                    }
                    return prev;
                }
                return prev + 1;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="py-8 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />

            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Processing your video</h3>
                <p className="text-muted-foreground">
                    Your video is being processed. This may take a few minutes.
                </p>
            </div>

            <div className="w-full max-w-md space-y-3">
                {stages.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center
              ${index < currentStage
                                ? 'bg-green-500 text-white'
                                : index === currentStage
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                            {index < currentStage ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ) : index === currentStage ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : null}
                        </div>
                        <span className={index <= currentStage ? 'text-foreground' : 'text-muted-foreground'}>
                            {stage}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
