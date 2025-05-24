
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Wand2, MousePointer, Move, ZoomIn, ZoomOut, RotateCcw, Undo, Redo } from 'lucide-react';

interface BrushToolProps {
  activeTool: 'add-brush' | 'remove-brush' | 'smart-edge' | 'magic-wand' | 'lasso' | 'pan';
  onToolChange: (tool: 'add-brush' | 'remove-brush' | 'smart-edge' | 'magic-wand' | 'lasso' | 'pan') => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  brushHardness: number;
  onBrushHardnessChange: (hardness: number) => void;
  brushOpacity: number;
  onBrushOpacityChange: (opacity: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export const BrushTool = ({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  brushHardness,
  onBrushHardnessChange,
  brushOpacity,
  onBrushOpacityChange,
  onUndo,
  onRedo,
  onClear,
  zoomLevel,
  onZoomChange
}: BrushToolProps) => {
  const [magicWandTolerance, setMagicWandTolerance] = useState(50);

  return (
    <Card className="w-80 border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onUndo}
              className="h-8 w-8 p-0"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRedo}
              className="h-8 w-8 p-0"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onZoomChange(Math.max(25, zoomLevel - 25))}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="outline" className="text-xs">
              {zoomLevel}%
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onZoomChange(Math.min(400, zoomLevel + 25))}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selection Tools */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">🎯 SELECTION TOOLS</h4>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              size="sm"
              variant={activeTool === 'magic-wand' ? 'default' : 'outline'}
              onClick={() => onToolChange('magic-wand')}
              className="justify-start"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Magic Wand
            </Button>
            <Button
              size="sm"
              variant={activeTool === 'lasso' ? 'default' : 'outline'}
              onClick={() => onToolChange('lasso')}
              className="justify-start"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Lasso
            </Button>
          </div>
          
          {activeTool === 'magic-wand' && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Tolerance</span>
                <Badge variant="outline" className="text-xs">{magicWandTolerance}</Badge>
              </div>
              <Slider
                value={[magicWandTolerance]}
                onValueChange={(value) => setMagicWandTolerance(value[0])}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Manual Editing Tools */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">✏️ MANUAL EDITING</h4>
          <div className="space-y-2 mb-4">
            <Button
              size="sm"
              variant={activeTool === 'add-brush' ? 'default' : 'outline'}
              onClick={() => onToolChange('add-brush')}
              className={`w-full justify-start ${activeTool === 'add-brush' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Brush
              {activeTool === 'add-brush' && <Badge className="ml-auto bg-green-500">ACTIVE</Badge>}
            </Button>
            
            <Button
              size="sm"
              variant={activeTool === 'remove-brush' ? 'default' : 'outline'}
              onClick={() => onToolChange('remove-brush')}
              className={`w-full justify-start ${activeTool === 'remove-brush' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              <Minus className="w-4 h-4 mr-2" />
              Remove Brush
              {activeTool === 'remove-brush' && <Badge className="ml-auto bg-red-500">ACTIVE</Badge>}
            </Button>
            
            <Button
              size="sm"
              variant={activeTool === 'smart-edge' ? 'default' : 'outline'}
              onClick={() => onToolChange('smart-edge')}
              className="w-full justify-start"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Smart Edge
            </Button>

            <Button
              size="sm"
              variant={activeTool === 'pan' ? 'default' : 'outline'}
              onClick={() => onToolChange('pan')}
              className="w-full justify-start"
            >
              <Move className="w-4 h-4 mr-2" />
              Pan Tool
            </Button>
          </div>
        </div>

        <Separator />

        {/* Brush Settings */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">🔧 BRUSH SETTINGS</h4>
          <div className="space-y-4">
            {/* Brush Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Size</span>
                <Badge variant="outline">{brushSize}px</Badge>
              </div>
              <Slider
                value={[brushSize]}
                onValueChange={(value) => onBrushSizeChange(value[0])}
                min={5}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-center mt-2">
                <div 
                  className="border-2 border-gray-400 rounded-full bg-purple-100 opacity-60"
                  style={{ 
                    width: Math.max(10, Math.min(50, brushSize)), 
                    height: Math.max(10, Math.min(50, brushSize)) 
                  }}
                />
              </div>
            </div>

            {/* Brush Hardness */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Hardness</span>
                <Badge variant="outline">{brushHardness}%</Badge>
              </div>
              <Slider
                value={[brushHardness]}
                onValueChange={(value) => onBrushHardnessChange(value[0])}
                min={0}
                max={100}
                step={10}
                className="w-full"
              />
            </div>

            {/* Brush Opacity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Opacity</span>
                <Badge variant="outline">{brushOpacity}%</Badge>
              </div>
              <Slider
                value={[brushOpacity]}
                onValueChange={(value) => onBrushOpacityChange(value[0])}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Selection Options */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">🔄 SELECTION OPTIONS</h4>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button size="sm" variant="outline" className="text-xs">
              Grow +5px
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Shrink -5px
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Smooth
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Invert
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onClear}
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
