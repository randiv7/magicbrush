
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Brush, Plus, Minus, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface EditingCanvasProps {
  originalImage: File | null;
  processedImage: string | null;
  onComplete: () => void;
}

export const EditingCanvas = ({ originalImage, processedImage, onComplete }: EditingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushMode, setBrushMode] = useState<'add' | 'remove'>('add');
  const [brushSize, setBrushSize] = useState([25]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'move'>('brush');

  useEffect(() => {
    if (processedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = processedImage;
    }
  }, [processedImage]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'brush') {
      setIsDrawing(true);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool !== 'brush') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = brushMode === 'add' ? 'source-over' : 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize[0] / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushMode === 'add' ? 'rgba(147, 51, 234, 0.7)' : 'transparent';
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw original processed image
    if (processedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = processedImage;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Panel */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Brush Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={brushMode === 'add' ? 'default' : 'ghost'}
                className={brushMode === 'add' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => setBrushMode('add')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant={brushMode === 'remove' ? 'default' : 'ghost'}
                className={brushMode === 'remove' ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => setBrushMode('remove')}
              >
                <Minus className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-3 min-w-[200px]">
              <Brush className="w-4 h-4 text-gray-600" />
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                max={50}
                min={5}
                step={5}
                className="flex-1"
              />
              <Badge variant="outline">{brushSize[0]}px</Badge>
            </div>

            {/* Tool Selection */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={tool === 'brush' ? 'default' : 'ghost'}
                onClick={() => setTool('brush')}
              >
                <Brush className="w-4 h-4 mr-1" />
                Brush
              </Button>
              <Button
                size="sm"
                variant={tool === 'move' ? 'default' : 'ghost'}
                onClick={() => setTool('move')}
              >
                <Move className="w-4 h-4 mr-1" />
                Move
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Badge variant="outline">{zoomLevel}%</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Clear Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={clearCanvas}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">Original</Badge>
            </div>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              {originalImage && (
                <img 
                  src={URL.createObjectURL(originalImage)}
                  alt="Original"
                  className="w-full h-auto"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Editing Canvas */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">Editing</Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full ${brushMode === 'add' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {brushMode === 'add' ? 'Adding' : 'Removing'} • {brushSize[0]}px brush
              </div>
            </div>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-auto cursor-crosshair"
                style={{ 
                  transform: `scale(${zoomLevel / 100})`,
                  cursor: tool === 'brush' ? 'crosshair' : 'move'
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsDrawing(false)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-900 mb-2">✨ Refinement Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the <strong>Add brush</strong> to include missed areas</li>
            <li>• Use the <strong>Remove brush</strong> to clean up unwanted selections</li>
            <li>• Adjust brush size for detailed work around edges</li>
            <li>• Zoom in for precise editing of complex areas</li>
          </ul>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={onComplete}
        >
          Continue to Background Replacement
        </Button>
      </div>
    </div>
  );
};
