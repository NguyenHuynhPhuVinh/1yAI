import EditChapterContent from "./EditChapterContent"

export default async function EditChapterPage({ 
  params 
}: { 
  params: Promise<{ id: string; chapterId: string }> 
}) {
  const resolvedParams = await params;
  return <EditChapterContent storyId={resolvedParams.id} chapterId={resolvedParams.chapterId} />
} 