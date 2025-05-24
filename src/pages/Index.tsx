
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Wand2, Brush, Download, Camera, Sparkles, Star, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { ProcessingStep } from '@/components/ProcessingStep';
import { EditingCanvas } from '@/components/EditingCanvas';
import { BackgroundReplace } from '@/components/BackgroundReplace';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setCurrentStep(2);
    // Simulate AI processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessedImage(URL.createObjectURL(file)); // Placeholder
      setCurrentStep(3);
    }, 3000);
  };

  const handleProcessingComplete = () => {
    setCurrentStep(3);
  };

  const handleEditingComplete = () => {
    setCurrentStep(4);
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ImageUpload onImageUpload={handleImageUpload} />;
      case 2:
        return (
          <ProcessingStep 
            isProcessing={isProcessing}
            originalImage={originalImage}
            onComplete={handleProcessingComplete}
          />
        );
      case 3:
        return (
          <EditingCanvas 
            originalImage={originalImage}
            processedImage={processedImage}
            onComplete={handleEditingComplete}
          />
        );
      case 4:
        return (
          <BackgroundReplace 
            processedImage={processedImage}
            onReset={resetWorkflow}
          />
        );
      default:
        return <ImageUpload onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Header />
      
      {/* Hero Section */}
      {currentStep === 1 && (
        <section className="relative pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text opacity-20 blur-3xl"></div>
              <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                MagicBrush
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered background removal and replacement. Perfect for ID photos, 
              <br className="hidden md:block" />
              profile pictures, and creative projects.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
                  <p className="text-gray-600 text-sm">Advanced AI removes backgrounds in seconds with professional quality</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brush className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Manual Refinement</h3>
                  <p className="text-gray-600 text-sm">Fine-tune results with precision brush tools for perfect edges</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Multiple Formats</h3>
                  <p className="text-gray-600 text-sm">Download as PNG, JPG, or WebP with transparency or new backgrounds</p>
                </CardContent>
              </Card>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 mb-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">10,000+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm">Free to Use</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workflow Steps Indicator */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Upload', icon: Upload },
              { step: 2, label: 'AI Process', icon: Wand2 },
              { step: 3, label: 'Refine', icon: Brush },
              { step: 4, label: 'Download', icon: Download }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-3 ${step <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                    step === currentStep ? 'bg-purple-100 text-purple-600 ring-2 ring-purple-300' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium hidden sm:block">{label}</span>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-4 transition-all duration-300 ${
                    step < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {renderCurrentStep()}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
