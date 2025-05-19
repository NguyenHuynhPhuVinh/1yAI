/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateAvatarPrompt } from "@/lib/gemini"
import { generateImage } from "@/lib/together"

interface AvatarImagePromptProps {
  characterInfo: {
    name: string;
    description: string;
    gender: string;
    personality: string;
    appearance: string;
    role: string;
  };
  onImageGenerated?: (imageUrl: string) => void;
}

export function AvatarImagePrompt({ characterInfo, onImageGenerated }: AvatarImagePromptProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<{
    prompt: string;
    negativePrompt: string;
    style: string;
  } | null>(null)
  const [open, setOpen] = useState(false)
  const [isCreatingImage, setIsCreatingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      const prompt = await generateAvatarPrompt(characterInfo);
      setGeneratedPrompt(prompt);
    } catch (error) {
      toast.error("Không thể tạo prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard");
  };

  const createImage = async () => {
    if (!generatedPrompt) return;
    
    setIsCreatingImage(true);
    try {
      const imageData = await generateImage({
        prompt: generatedPrompt.prompt,
        negativePrompt: generatedPrompt.negativePrompt,
        type: 'avatar'
      });
      
      setGeneratedImage(imageData);
      toast.success("Đã tạo ảnh thành công!");
    } catch (error) {
      toast.error("Không thể tạo ảnh");
    } finally {
      setIsCreatingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserCircle className="w-4 h-4" />
          Gợi ý prompt avatar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gợi ý prompt avatar</DialogTitle>
          <DialogDescription>
            Tạo prompt để sử dụng với các công cụ AI tạo ảnh avatar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!generatedPrompt ? (
            <Button 
              onClick={generatePrompt}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Đang tạo..." : "Tạo prompt"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Prompt</Label>
                <div className="relative">
                  <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words">
                    {generatedPrompt.prompt}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generatedPrompt.prompt)}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Negative Prompt</Label>
                <div className="relative">
                  <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words">
                    {generatedPrompt.negativePrompt}
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generatedPrompt.negativePrompt)}
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phong cách đề xuất</Label>
                <pre className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap break-words">
                  {generatedPrompt.style}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={createImage}
                  disabled={isCreatingImage}
                  className="flex-1"
                >
                  {isCreatingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tạo ảnh...
                    </>
                  ) : (
                    "Tạo ảnh"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedPrompt(null);
                    setGeneratedImage(null);
                  }}
                  className="flex-1"
                >
                  Tạo lại prompt
                </Button>
              </div>

              {generatedImage && (
                <div className="space-y-2">
                  <Label>Ảnh đã tạo</Label>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${generatedImage}`}
                      alt="Generated avatar"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button
                    variant="default"
                    onClick={() => {
                      if (onImageGenerated) {
                        onImageGenerated(generatedImage);
                        setOpen(false);
                        toast.success("Đã áp dụng ảnh avatar mới!");
                      }
                    }}
                    className="w-full mt-2"
                  >
                    Áp dụng ảnh này
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 