/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import TextareaAutosize from 'react-textarea-autosize';

export function StoryComments({ storyId }: { storyId: string }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/comments`);
      const data = await res.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch(`/api/stories/${storyId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      
      toast.success(data.message);
      setContent('');
      fetchComments();
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const CommentItem = ({ comment, onDelete, onUpdate }: any) => {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    
    const isOwner = session?.user?.email === comment.user_email;

    const handleUpdate = async () => {
      if (!editContent.trim()) return;
      
      try {
        const res = await fetch(`/api/stories/${storyId}/comments`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            commentId: comment.comment_id,
            content: editContent 
          })
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message);
          onUpdate();
          setIsEditing(false);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra");
      }
    };

    const handleDelete = async () => {
      if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;
      
      try {
        const res = await fetch(`/api/stories/${storyId}/comments`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commentId: comment.comment_id })
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message);
          onDelete();
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra");
      }
    };

    return (
      <div className="flex gap-4 py-4 border-b">
        <UserAvatar size={40} showName={false} className="flex-shrink-0" />
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.username}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: vi
                })}
              </span>
            </div>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Hủy' : 'Sửa'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <TextareaAutosize
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                minRows={2}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nhập nội dung bình luận..."
              />
              <Button size="sm" onClick={handleUpdate}>
                Cập nhật
              </Button>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minRows={2}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Viết bình luận của bạn..."
          />
          <Button type="submit" disabled={!content.trim()}>
            Gửi bình luận
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Vui lòng đăng nhập để bình luận
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            onDelete={fetchComments}
            onUpdate={fetchComments}
          />
        ))}
      </div>
    </div>
  );
} 