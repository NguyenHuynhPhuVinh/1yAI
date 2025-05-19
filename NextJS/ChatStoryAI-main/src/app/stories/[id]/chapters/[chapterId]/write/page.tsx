import WriteChapterContent from "./WriteChapterContent"

export default async function WriteChapterPage({ 
  params 
}: { 
  params: Promise<{ id: string; chapterId: string }> 
}) {
  const resolvedParams = await params;
  return <WriteChapterContent storyId={resolvedParams.id} chapterId={resolvedParams.chapterId} />
} 