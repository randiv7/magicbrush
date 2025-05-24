
import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateImage = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsValidating(true);
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or WebP image');
        setIsValidating(false);
        return resolve(false);
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Image must be smaller than 10MB');
        setIsValidating(false);
        return resolve(false);
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        setIsValidating(false);
        
        if (img.width < 100 || img.height < 100) {
          toast.error('Image must be at least 100x100 pixels');
          return resolve(false);
        }

        if (img.width > 4000 || img.height > 4000) {
          toast.warning('Large image detected. We\'ll automatically resize to 720p for optimal processing.');
        }

        toast.success('Image validated successfully!');
        resolve(true);
      };
      
      img.onerror = () => {
        setIsValidating(false);
        toast.error('Invalid image file');
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const isValid = await validateImage(file);
    
    if (isValid) {
      onImageUpload(file);
    }
  }, [onImageUpload, validateImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleCameraCapture = () => {
    // This would trigger camera access on mobile devices
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card className={`relative border-2 border-dashed transition-all duration-300 ${
        isDragging 
          ? 'border-purple-400 bg-purple-50 scale-[1.02]' 
          : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
      }`}>
        <CardContent 
          className="p-12 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-6">
            {/* Upload Icon */}
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              isDragging 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110' 
                : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600'
            }`}>
              {isValidating ? (
                <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Upload className="w-10 h-10" />
              )}
            </div>

            {/* Upload Text */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isDragging ? 'Drop your image here!' : 'Upload your image'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your image, or click to browse
              </p>
              
              {/* Format Info */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">WebP</Badge>
                <Badge variant="secondary">Max 10MB</Badge>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => fileInputRef.current?.click()}
                disabled={isValidating}
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Choose Image
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={handleCameraCapture}
                disabled={isValidating}
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Best Results</h4>
                <p className="text-sm text-green-700">
                  Use high-contrast images with clear subject-background separation for optimal AI processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Privacy First</h4>
                <p className="text-sm text-blue-700">
                  Your images are processed securely and automatically deleted after your session ends.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Images */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">Don't have an image? Try our samples:</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {['Portrait', 'Product', 'Pet', 'Object'].map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="text-purple-700 border-purple-200 hover:bg-purple-50"
              onClick={() => {
                // This would load a sample image
                toast.info(`Loading sample ${type.toLowerCase()} image...`);
              }}
            >
              Sample {type}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
