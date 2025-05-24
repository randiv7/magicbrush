
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw } from 'lucide-react';

interface HistoryAction {
  id: string;
  type: 'brush-stroke' | 'selection' | 'transform' | 'adjustment';
  description: string;
  timestamp: number;
  thumbnail?: string;
}

interface HistoryPanelProps {
  history: HistoryAction[];
  currentIndex: number;
  onJumpToStep: (index: number) => void;
  onClearHistory: () => void;
}

export const HistoryPanel = ({
  history,
  currentIndex,
  onJumpToStep,
  onClearHistory
}: HistoryPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const getActionIcon = (type: HistoryAction['type']) => {
    switch (type) {
      case 'brush-stroke':
        return '🖌️';
      case 'selection':
        return '🎯';
      case 'transform':
        return '📐';
      case 'adjustment':
        return '🎨';
      default:
        return '⚡';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed top-24 right-4 z-40 bg-white/90 backdrop-blur-sm"
      >
        <History className="w-4 h-4 mr-2" />
        History ({history.length})
      </Button>
    );
  }

  return (
    <Card className="fixed top-24 right-4 w-80 max-h-96 z-40 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="font-semibold text-sm">History</span>
            <Badge variant="outline" className="text-xs">
              {history.length}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearHistory}
              className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No actions yet
              </div>
            ) : (
              history.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => onJumpToStep(index)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    index === currentIndex
                      ? 'bg-purple-100 border-2 border-purple-300'
                      : index < currentIndex
                      ? 'bg-gray-50 border border-gray-200 opacity-75'
                      : 'bg-white border border-gray-200 opacity-50'
                  } hover:bg-purple-50`}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail or Icon */}
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded border">
                      {action.thumbnail ? (
                        <img 
                          src={action.thumbnail} 
                          alt="" 
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-sm">{getActionIcon(action.type)}</span>
                      )}
                    </div>

                    {/* Action Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {action.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(action.timestamp)}
                      </div>
                    </div>

                    {/* Step Number */}
                    <Badge 
                      variant={index === currentIndex ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              Step {currentIndex + 1} of {history.length}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
