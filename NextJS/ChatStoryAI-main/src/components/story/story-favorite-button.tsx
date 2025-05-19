/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function StoryFavoriteButton({ storyId, favoriteCount }: { storyId: string, favoriteCount: number }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [count, setCount] = useState(favoriteCount);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [storyId]);

  const fetchFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/favorites`);
      const data = await res.json();
      setIsFavorited(data.isFavorited);
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái yêu thích:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/favorites`, {
        method: 'POST'
      });
      const data = await res.json();
      setIsFavorited(!isFavorited);
      setCount(prev => isFavorited ? prev - 1 : prev + 1);
      toast.success(data.message);
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFavorite}
        className="hover:bg-primary/10 hover:text-primary"
      >
        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current text-primary" : ""}`} />
      </Button>
    </div>
  );
} 