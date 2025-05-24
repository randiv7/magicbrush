
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Upload, RotateCcw, FlipHorizontal, FlipVertical, Download, Eye } from 'lucide-react';

interface BackgroundPanelProps {
  onBackgroundUpload: (file: File) => void;
  objectScale: number;
  onObjectScaleChange: (scale: number) => void;
  objectRotation: number;
  onObjectRotationChange: (rotation: number) => void;
  objectPosition: { x: number; y: number };
  onObjectPositionChange: (position: { x: number; y: number }) => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onAutoColorMatch: () => void;
  brightness: number;
  onBrightnessChange: (brightness: number) => void;
  contrast: number;
  onContrastChange: (contrast: number) => void;
  shadowIntensity: number;
  onShadowIntensityChange: (intensity: number) => void;
  onDownload: (format: 'PNG' | 'JPG' | 'WebP') => void;
  onPreview: () => void;
}

const PRESET_BACKGROUNDS = [
  { id: 1, name: 'White Studio', color: '#ffffff', gradient: false },
  { id: 2, name: 'Gray Studio', color: '#f5f5f5', gradient: false },
  { id: 3, name: 'Blue Gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', gradient: true },
  { id: 4, name: 'Sunset', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', gradient: true },
  { id: 5, name: 'Ocean', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', gradient: true },
  { id: 6, name: 'Forest', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', gradient: true },
];

export const BackgroundPanel = ({
  onBackgroundUpload,
  objectScale,
  onObjectScaleChange,
  objectRotation,
  onObjectRotationChange,
  objectPosition,
  onObjectPositionChange,
  onFlipHorizontal,
  onFlipVertical,
  onAutoColorMatch,
  brightness,
  onBrightnessChange,
  contrast,
  onContrastChange,
  shadowIntensity,
  onShadowIntensityChange,
  onDownload,
  onPreview
}: BackgroundPanelProps) => {
  const [selectedBackground, setSelectedBackground] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<'PNG' | 'JPG' | 'WebP'>('PNG');
  const [exportQuality, setExportQuality] = useState(90);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onBackgroundUpload(file);
    }
  };

  return (
    <Card className="w-80 border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Background Selection */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">📚 BACKGROUND</h4>
          
          {/* Preset Library */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {PRESET_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg.id)}
                className={`relative w-full h-12 rounded-lg border-2 transition-all ${
                  selectedBackground === bg.id 
                    ? 'border-purple-500 ring-2 ring-purple-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  background: bg.gradient ? bg.color : bg.color,
                }}
              >
                {selectedBackground === bg.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Upload */}
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Custom
            </Button>
          </div>
        </div>

        <Separator />

        {/* Object Transform */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">📐 OBJECT TRANSFORM</h4>
          
          {/* Position Controls */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Position X</span>
                <Badge variant="outline">{objectPosition.x}px</Badge>
              </div>
              <Slider
                value={[objectPosition.x]}
                onValueChange={(value) => onObjectPositionChange({ ...objectPosition, x: value[0] })}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Position Y</span>
                <Badge variant="outline">{objectPosition.y}px</Badge>
              </div>
              <Slider
                value={[objectPosition.y]}
                onValueChange={(value) => onObjectPositionChange({ ...objectPosition, y: value[0] })}
                min={-100}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Scale Control */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Scale</span>
              <Badge variant="outline">{objectScale}%</Badge>
            </div>
            <Slider
              value={[objectScale]}
              onValueChange={(value) => onObjectScaleChange(value[0])}
              min={10}
              max={200}
              step={5}
              className="w-full"
            />
          </div>

          {/* Rotation Control */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Rotate</span>
              <Badge variant="outline">{objectRotation}°</Badge>
            </div>
            <Slider
              value={[objectRotation]}
              onValueChange={(value) => onObjectRotationChange(value[0])}
              min={-180}
              max={180}
              step={5}
              className="w-full"
            />
          </div>

          {/* Flip Controls */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onFlipHorizontal} className="flex-1">
              <FlipHorizontal className="w-4 h-4 mr-1" />
              Flip H
            </Button>
            <Button size="sm" variant="outline" onClick={onFlipVertical} className="flex-1">
              <FlipVertical className="w-4 h-4 mr-1" />
              Flip V
            </Button>
          </div>
        </div>

        <Separator />

        {/* Smart Blending */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">🎨 SMART BLENDING</h4>
          
          <Button 
            size="sm" 
            className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={onAutoColorMatch}
          >
            Auto Match Colors
          </Button>

          {/* Manual Adjustments */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Brightness</span>
                <Badge variant="outline">{brightness > 0 ? '+' : ''}{brightness}</Badge>
              </div>
              <Slider
                value={[brightness]}
                onValueChange={(value) => onBrightnessChange(value[0])}
                min={-50}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Contrast</span>
                <Badge variant="outline">{contrast > 0 ? '+' : ''}{contrast}</Badge>
              </div>
              <Slider
                value={[contrast]}
                onValueChange={(value) => onContrastChange(value[0])}
                min={-50}
                max={50}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Shadow</span>
                <Badge variant="outline">{shadowIntensity}%</Badge>
              </div>
              <Slider
                value={[shadowIntensity]}
                onValueChange={(value) => onShadowIntensityChange(value[0])}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Export Options */}
        <div>
          <h4 className="font-semibold text-sm text-gray-900 mb-3">💾 EXPORT OPTIONS</h4>
          
          {/* Format Selection */}
          <div className="flex gap-1 mb-4">
            {(['PNG', 'JPG', 'WebP'] as const).map((format) => (
              <Button
                key={format}
                size="sm"
                variant={exportFormat === format ? 'default' : 'outline'}
                onClick={() => setExportFormat(format)}
                className="flex-1"
              >
                {format}
              </Button>
            ))}
          </div>

          {/* Quality Control */}
          {(exportFormat === 'JPG' || exportFormat === 'WebP') && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Quality</span>
                <Badge variant="outline">{exportQuality}%</Badge>
              </div>
              <Slider
                value={[exportQuality]}
                onValueChange={(value) => setExportQuality(value[0])}
                min={10}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          )}

          {/* Download Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={onPreview}
              variant="outline" 
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={() => onDownload(exportFormat)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download {exportFormat}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
