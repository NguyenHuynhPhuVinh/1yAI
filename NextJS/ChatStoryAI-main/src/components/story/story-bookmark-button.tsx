/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function StoryBookmarkButton({ storyId }: { storyId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchBookmarkStatus();
  }, [storyId]);

  const fetchBookmarkStatus = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/bookmarks`);
      const data = await res.json();
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái lưu trữ:', error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/bookmarks`, {
        method: 'POST'
      });
      const data = await res.json();
      setIsBookmarked(!isBookmarked);
      toast.success(data.message);
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleBookmark}
      className="hover:bg-primary/10 hover:text-primary"
    >
      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current text-primary" : ""}`} />
    </Button>
  );
} 