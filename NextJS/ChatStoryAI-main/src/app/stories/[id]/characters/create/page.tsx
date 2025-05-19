import { Suspense } from "react"
import CreateCharacterContent from "./CreateCharacterContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function CreateCharacterPage({ 
  params,
}: { 
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateCharacterContent storyId={resolvedParams.id} />
    </Suspense>
  )
} 