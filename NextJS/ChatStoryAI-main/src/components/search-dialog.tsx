/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { StoryCard } from "./story-card"
import { useDebounce } from "@/hooks/use-debounce"
import { useLoading } from "@/providers/loading-provider"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const { startLoading } = useLoading()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [stories, setStories] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  React.useEffect(() => {
    const searchStories = async () => {
      if (!debouncedSearch.trim()) {
        setStories([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/library/search?q=${encodeURIComponent(debouncedSearch)}`)
        const data = await response.json()
        
        if (response.ok) {
          setStories(data.stories)
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error)
      } finally {
        setIsLoading(false)
      }
    }

    searchStories()
  }, [debouncedSearch])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] gap-0">
        <div className="flex items-center border-b px-3 py-4">
          <div className="flex h-10 w-full items-center gap-2 rounded-md px-3">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Tìm kiếm truyện..."
              className="h-9 w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="rounded-sm opacity-50 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="px-3 py-4 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : stories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stories.map((story: any) => (
                <StoryCard 
                  key={story.story_id} 
                  story={story}
                  variant="search"
                  onClick={() => {
                    startLoading(`/library/${story.story_id}`)
                    router.push(`/library/${story.story_id}`)
                    onOpenChange(false)
                  }}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-center text-muted-foreground py-8">
              Không tìm thấy truyện phù hợp
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
} 