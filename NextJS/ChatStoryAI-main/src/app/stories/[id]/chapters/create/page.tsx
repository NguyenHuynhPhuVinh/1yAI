import CreateChapterContent from "./CreateChapterContent"

export default async function CreateChapterPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  return <CreateChapterContent storyId={resolvedParams.id} />
} 