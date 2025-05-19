import CreateOutlineContent from "./CreateOutlineContent"

export default async function CreateOutlinePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  return <CreateOutlineContent storyId={resolvedParams.id} />
} 