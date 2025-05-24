
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, RotateCcw, Move, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface BackgroundReplaceProps {
  processedImage: string | null;
  onReset: () => void;
}

export const BackgroundReplace = ({ processedImage, onReset }: BackgroundReplaceProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [objectScale, setObjectScale] = useState([100]);
  const [objectPosition, setObjectPosition] = useState({ x: 50, y: 50 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        toast.success('Background uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (format: 'png' | 'jpg' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `magicbrush-result.${format}`;
    
    if (format === 'png') {
      link.href = canvas.toDataURL('image/png');
    } else if (format === 'jpg') {
      link.href = canvas.toDataURL('image/jpeg', 0.9);
    } else {
      link.href = canvas.toDataURL('image/webp', 0.9);
    }
    
    link.click();
    toast.success(`Downloaded as ${format.toUpperCase()}!`);
  };

  const presetBackgrounds = [
    { name: 'White', color: '#ffffff' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Green', color: '#10b981' },
    { name: 'Gray', color: '#6b7280' }
  ];

  return (
    <div className="space-y-6">
      {/* Background Selection */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Choose Background</h3>
          
          {/* Upload Custom Background */}
          <div className="mb-6">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Custom Background
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundUpload}
            />
          </div>

          {/* Preset Colors */}
          <div>
            <p className="text-sm text-gray-600 mb-3">Or choose a solid color:</p>
            <div className="flex flex-wrap gap-3">
              {presetBackgrounds.map((bg) => (
                <Button
                  key={bg.name}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setBackgroundImage(bg.color)}
                >
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: bg.color }}
                  ></div>
                  {bg.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Object Positioning */}
      {backgroundImage && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Adjust Position & Size</h3>
            
            <div className="space-y-4">
              {/* Scale Control */}
              <div className="flex items-center gap-4">
                <Maximize2 className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium min-w-[60px]">Scale:</span>
                <Slider
                  value={objectScale}
                  onValueChange={setObjectScale}
                  max={200}
                  min={10}
                  step={10}
                  className="flex-1"
                />
                <Badge variant="outline">{objectScale[0]}%</Badge>
              </div>

              {/* Position Helper */}
              <div className="text-sm text-gray-600">
                <Move className="w-4 h-4 inline mr-1" />
                Drag the preview below to reposition your object
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Canvas */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">Preview</Badge>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onReset}
                className="text-gray-600"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Start Over
              </Button>
            </div>
          </div>
          
          <div className="relative bg-gray-100 rounded-lg overflow-hidden min-h-[400px] flex items-center justify-center">
            {backgroundImage ? (
              <div className="relative w-full h-full">
                {/* Background */}
                {backgroundImage.startsWith('#') ? (
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: backgroundImage }}
                  ></div>
                ) : (
                  <img 
                    src={backgroundImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                
                {/* Processed Object */}
                {processedImage && (
                  <div 
                    className="absolute cursor-move"
                    style={{
                      left: `${objectPosition.x}%`,
                      top: `${objectPosition.y}%`,
                      transform: `translate(-50%, -50%) scale(${objectScale[0] / 100})`
                    }}
                  >
                    <img 
                      src={processedImage}
                      alt="Processed object"
                      className="max-w-none"
                      draggable={false}
                    />
                  </div>
                )}
                
                {/* Canvas for download */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Upload a background to see preview</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      {backgroundImage && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Download Your Result</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                size="lg"
                onClick={() => downloadImage('png')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-5 h-5 mr-2" />
                PNG (Transparent)
              </Button>
              
              <Button
                size="lg"
                onClick={() => downloadImage('jpg')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-5 h-5 mr-2" />
                JPG (Background)
              </Button>
              
              <Button
                size="lg"
                onClick={() => downloadImage('webp')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-5 h-5 mr-2" />
                WebP (Small Size)
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              All downloads are free • No watermarks • High quality
            </p>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold text-green-900 mb-2">🎉 Amazing Work!</h4>
          <p className="text-green-800 mb-4">
            Your image is ready for download. Don't forget to share your creation!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Share on Social
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
              onClick={onReset}
            >
              Edit Another Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
