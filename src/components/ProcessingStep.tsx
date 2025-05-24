
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Brain, Sparkles, Zap } from 'lucide-react';

interface ProcessingStepProps {
  isProcessing: boolean;
  originalImage: File | null;
  onComplete: () => void;
}

export const ProcessingStep = ({ isProcessing, originalImage, onComplete }: ProcessingStepProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Analyzing image...');

  const phases = [
    { text: 'Analyzing image structure...', duration: 1000 },
    { text: 'Detecting objects and edges...', duration: 800 },
    { text: 'Generating precision mask...', duration: 1200 },
    { text: 'Finalizing results...', duration: 500 }
  ];

  useEffect(() => {
    if (!isProcessing) return;

    let phaseIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (phaseIndex < phases.length) {
        setCurrentPhase(phases[phaseIndex].text);
        
        const phaseProgress = 100 / phases.length;
        const targetProgress = (phaseIndex + 1) * phaseProgress;
        
        const interval = setInterval(() => {
          progressValue += 2;
          setProgress(Math.min(progressValue, targetProgress));
          
          if (progressValue >= targetProgress) {
            clearInterval(interval);
            phaseIndex++;
            setTimeout(updateProgress, 200);
          }
        }, phases[phaseIndex].duration / 50);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    updateProgress();
  }, [isProcessing, onComplete]);

  return (
    <div className="space-y-8">
      {/* Main Processing Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <CardContent className="p-12 text-center">
          <div className="space-y-8">
            {/* AI Processing Animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                
                {/* Progress Ring */}
                <div 
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-pink-600 animate-spin"
                  style={{
                    background: `conic-gradient(from 0deg, transparent ${360 - (progress * 3.6)}deg, rgb(147 51 234) ${360 - (progress * 3.6)}deg)`
                  }}
                ></div>
                
                {/* Center Icon */}
                <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              
              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"
                    style={{
                      top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                      animationDelay: `${i * 200}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Progress Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                AI Magic in Progress
              </h3>
              <p className="text-lg text-purple-700 font-medium mb-4">
                {currentPhase}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {Math.round(progress)}% Complete
              </Badge>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Neural Networks</h4>
                <p className="text-xs text-gray-600 mt-1">Advanced AI algorithms</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Precision Masking</h4>
                <p className="text-xs text-gray-600 mt-1">Pixel-perfect detection</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Lightning Fast</h4>
                <p className="text-xs text-gray-600 mt-1">Optimized processing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview */}
      {originalImage && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline">Original Image</Badge>
              <span className="text-sm text-gray-600">
                {originalImage.name} • {(originalImage.size / 1024 / 1024).toFixed(1)}MB
              </span>
            </div>
            <div className="relative max-w-md mx-auto">
              <img 
                src={URL.createObjectURL(originalImage)}
                alt="Original"
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sidebar Ad Space */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6 text-center">
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Advertisement Space (300x250)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
