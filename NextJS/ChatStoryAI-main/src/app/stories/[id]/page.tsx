/* eslint-disable @next/next/no-async-client-component */
"use client"

import { Suspense } from "react"
import StoryDetailContent from "./StoryDetailContent"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StoryDetailContent storyId={resolvedParams.id} />
    </Suspense>
  )
} 