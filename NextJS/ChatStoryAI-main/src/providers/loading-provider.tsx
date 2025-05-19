"use client"

import { createContext, useContext, useState, useEffect, useCallback, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import LoadingPage from "@/components/loading-page"

interface LoadingContextType {
  setIsLoading: (value: boolean) => void
  startLoading: (url?: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType>({
  setIsLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
})

function LoadingProviderContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const startLoading = useCallback((destinationUrl?: string) => {
    // Nếu không có URL đích hoặc URL đích khác với URL hiện tại thì mới loading
    if (!destinationUrl || destinationUrl !== pathname) {
      setIsLoading(true)
    }
  }, [pathname])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    stopLoading()
  }, [pathname, searchParams, stopLoading])

  return (
    <LoadingContext.Provider value={{ setIsLoading, startLoading, stopLoading }}>
      {isLoading && <LoadingPage />}
      {children}
    </LoadingContext.Provider>
  )
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  )
}

export const useLoading = () => useContext(LoadingContext)