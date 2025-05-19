import EditCharacterContent from "./EditCharacterContent"

export default async function EditCharacterPage({ 
  params 
}: { 
  params: Promise<{ id: string; characterId: string }> 
}) {
  const resolvedParams = await params;
  return <EditCharacterContent storyId={resolvedParams.id} characterId={resolvedParams.characterId} />
} 