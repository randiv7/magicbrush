import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrushTool } from './BrushTool';
import { BackgroundPanel } from './BackgroundPanel';
import { HistoryPanel } from './HistoryPanel';

interface EditingCanvasProps {
  originalImage: File | null;
  processedImage: string | null;
  onComplete: () => void;
}

interface HistoryAction {
  id: string;
  type: 'brush-stroke' | 'selection' | 'transform' | 'adjustment';
  description: string;
  timestamp: number;
  imageData: ImageData;
  maskData: ImageData;
}

export const EditingCanvas = ({ originalImage, processedImage, onComplete }: EditingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tool State
  const [activeTool, setActiveTool] = useState<'add-brush' | 'remove-brush' | 'smart-edge' | 'magic-wand' | 'lasso' | 'pan'>('add-brush');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Brush Settings
  const [brushSize, setBrushSize] = useState(25);
  const [brushHardness, setBrushHardness] = useState(80);
  const [brushOpacity, setBrushOpacity] = useState(85);
  
  // Viewport State
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  // Object Transform
  const [objectScale, setObjectScale] = useState(100);
  const [objectRotation, setObjectRotation] = useState(0);
  const [objectPosition, setObjectPosition] = useState({ x: 0, y: 0 });
  const [isFlippedH, setIsFlippedH] = useState(false);
  const [isFlippedV, setIsFlippedV] = useState(false);
  
  // Color Adjustments
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [shadowIntensity, setShadowIntensity] = useState(30);
  
  // History Management
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  // Background
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    if (processedImage && canvasRef.current && maskCanvasRef.current) {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      
      if (!ctx || !maskCtx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        // Initialize with a basic mask
        maskCtx.fillStyle = 'rgba(255, 255, 255, 1)';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        
        // Save initial state
        saveToHistory('adjustment', 'Initial image loaded');
      };
      img.src = processedImage;
    }
  }, [processedImage]);

  const saveToHistory = (type: HistoryAction['type'], description: string) => {
    if (!canvasRef.current || !maskCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    if (!ctx || !maskCtx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    
    const newAction: HistoryAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      description,
      timestamp: Date.now(),
      imageData,
      maskData
    };
    
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newAction);
    
    // Limit history to 20 items
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevState = history[prevIndex];
      restoreFromHistory(prevState);
      setCurrentHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextState = history[nextIndex];
      restoreFromHistory(nextState);
      setCurrentHistoryIndex(nextIndex);
    }
  };

  const restoreFromHistory = (action: HistoryAction) => {
    if (!canvasRef.current || !maskCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    if (!ctx || !maskCtx) return;
    
    ctx.putImageData(action.imageData, 0, 0);
    maskCtx.putImageData(action.maskData, 0, 0);
  };

  const handleJumpToStep = (index: number) => {
    if (index >= 0 && index < history.length) {
      const targetState = history[index];
      restoreFromHistory(targetState);
      setCurrentHistoryIndex(index);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentHistoryIndex(-1);
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    if (activeTool === 'pan') {
      setIsPanning(true);
      setLastPanPoint(coords);
    } else if (activeTool === 'add-brush' || activeTool === 'remove-brush') {
      setIsDrawing(true);
      drawBrushStroke(coords.x, coords.y);
    } else if (activeTool === 'magic-wand') {
      handleMagicWandSelection(coords.x, coords.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    if (isPanning && activeTool === 'pan') {
      const deltaX = coords.x - lastPanPoint.x;
      const deltaY = coords.y - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint(coords);
    } else if (isDrawing && (activeTool === 'add-brush' || activeTool === 'remove-brush')) {
      drawBrushStroke(coords.x, coords.y);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      saveToHistory('brush-stroke', `${activeTool === 'add-brush' ? 'Added to' : 'Removed from'} selection`);
    }
    setIsDrawing(false);
    setIsPanning(false);
  };

  const drawBrushStroke = (x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    
    const radius = brushSize / 2;
    const opacity = brushOpacity / 100;
    
    ctx.globalCompositeOperation = activeTool === 'add-brush' ? 'source-over' : 'destination-out';
    ctx.globalAlpha = opacity;
    
    // Create brush with hardness
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    const hardness = brushHardness / 100;
    
    if (activeTool === 'add-brush') {
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(hardness, `rgba(255, 255, 255, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
      gradient.addColorStop(hardness, `rgba(0, 0, 0, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;
  };

  const handleMagicWandSelection = (x: number, y: number) => {
    // Magic wand implementation would go here
    console.log('Magic wand selection at:', x, y);
    saveToHistory('selection', 'Magic wand selection');
  };

  const handleBackgroundUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setBackgroundImage(url);
  };

  const handleAutoColorMatch = () => {
    // Auto color matching logic would go here
    setBrightness(5);
    setContrast(10);
    setShadowIntensity(45);
    saveToHistory('adjustment', 'Auto color matching applied');
  };

  const handleDownload = (format: 'PNG' | 'JPG' | 'WebP') => {
    // Export logic would go here
    console.log(`Downloading as ${format}`);
  };

  const handlePreview = () => {
    // Preview logic would go here
    console.log('Preview mode');
  };

  const clearCanvas = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    saveToHistory('adjustment', 'Cleared all selections');
  };

  const getCursorStyle = () => {
    switch (activeTool) {
      case 'pan':
        return isPanning ? 'grabbing' : 'grab';
      case 'add-brush':
      case 'remove-brush':
        return 'crosshair';
      case 'magic-wand':
        return 'pointer';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex gap-6 min-h-screen">
      {/* Left Sidebar - Tools */}
      <div className="flex-shrink-0">
        <BrushTool
          activeTool={activeTool}
          onToolChange={setActiveTool}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          brushHardness={brushHardness}
          onBrushHardnessChange={setBrushHardness}
          brushOpacity={brushOpacity}
          onBrushOpacityChange={setBrushOpacity}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={clearCanvas}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Zoom: {zoomLevel}%
            </Badge>
            <Badge variant="outline" className="text-sm">
              Tool: {activeTool.replace('-', ' ')}
            </Badge>
            {(activeTool === 'add-brush' || activeTool === 'remove-brush') && (
              <Badge variant="outline" className="text-sm">
                Brush: {brushSize}px
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              👁️ Before
            </Button>
            <Button variant="outline" size="sm">
              👁️ After
            </Button>
            <Button variant="outline" size="sm">
              🔄 Compare
            </Button>
          </div>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Original</Badge>
              </div>
              <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square">
                {originalImage && (
                  <img 
                    src={URL.createObjectURL(originalImage)}
                    alt="Original"
                    className="w-full h-full object-contain"
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
                  <div className={`w-3 h-3 rounded-full ${
                    activeTool === 'add-brush' ? 'bg-green-500' : 
                    activeTool === 'remove-brush' ? 'bg-red-500' : 
                    'bg-blue-500'
                  }`}></div>
                  {activeTool.replace('-', ' ')}
                </div>
              </div>
              <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ 
                    cursor: getCursorStyle(),
                    transform: `scale(${zoomLevel / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => {
                    setIsDrawing(false);
                    setIsPanning(false);
                  }}
                />
                <canvas
                  ref={maskCanvasRef}
                  className="absolute inset-0 w-full h-full object-contain opacity-50 mix-blend-multiply pointer-events-none"
                  style={{ 
                    transform: `scale(${zoomLevel / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-900 mb-2">✨ Professional Editing Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use <strong>Add brush</strong> to include areas in your selection</li>
              <li>• Use <strong>Remove brush</strong> to exclude unwanted areas</li>
              <li>• Try <strong>Magic Wand</strong> for quick color-based selections</li>
              <li>• Adjust brush <strong>hardness</strong> for precise edge control</li>
              <li>• Use <strong>Pan tool</strong> to navigate around zoomed images</li>
              <li>• Check the <strong>History panel</strong> to undo specific steps</li>
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

      {/* Right Sidebar - Background & Export */}
      <div className="flex-shrink-0">
        <BackgroundPanel
          onBackgroundUpload={handleBackgroundUpload}
          objectScale={objectScale}
          onObjectScaleChange={setObjectScale}
          objectRotation={objectRotation}
          onObjectRotationChange={setObjectRotation}
          objectPosition={objectPosition}
          onObjectPositionChange={setObjectPosition}
          onFlipHorizontal={() => setIsFlippedH(!isFlippedH)}
          onFlipVertical={() => setIsFlippedV(!isFlippedV)}
          onAutoColorMatch={handleAutoColorMatch}
          brightness={brightness}
          onBrightnessChange={setBrightness}
          contrast={contrast}
          onContrastChange={setContrast}
          shadowIntensity={shadowIntensity}
          onShadowIntensityChange={setShadowIntensity}
          onDownload={handleDownload}
          onPreview={handlePreview}
        />
      </div>

      {/* History Panel */}
      <HistoryPanel
        history={history}
        currentIndex={currentHistoryIndex}
        onJumpToStep={handleJumpToStep}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};
