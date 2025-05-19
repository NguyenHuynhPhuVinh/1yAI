import { Suspense } from "react"
import StoryDetailContent from "./StoryDetailContent"

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Đang tải thông tin truyện...</p>
      </div>
    </div>
  )
}

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StoryDetailContent storyId={resolvedParams.id} />
    </Suspense>
  )
} 