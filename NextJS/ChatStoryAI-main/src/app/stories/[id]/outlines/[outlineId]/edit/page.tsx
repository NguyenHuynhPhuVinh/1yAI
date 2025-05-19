import EditOutlineContent from "./EditOutlineContent"

export default async function EditOutlinePage({ 
  params 
}: { 
  params: Promise<{ id: string; outlineId: string }> 
}) {
  const resolvedParams = await params;
  return (
    <EditOutlineContent 
      storyId={resolvedParams.id} 
      outlineId={resolvedParams.outlineId} 
    />
  )
} 