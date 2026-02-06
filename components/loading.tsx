"use client"

import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  fullScreen?: boolean
  className?: string
}

export function Loading({ size = "md", text, fullScreen = false, className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const ringSize = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-2",
    lg: "w-14 h-14 border-3",
    xl: "w-20 h-20 border-4",
  }

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className={cn(
          "absolute inset-0 rounded-full border-primary/20",
          ringSize[size]
        )} />
        <div className={cn(
          "absolute inset-0 rounded-full border-transparent border-t-primary border-r-primary/50 animate-spin",
          ringSize[size]
        )} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}

export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64 border-r border-border bg-card/30" />
      <div className="flex-1 flex items-center justify-center">
        <Loading size="lg" text={text} />
      </div>
    </div>
  )
}

export function CardLoading() {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-2/3" />
      </div>
    </div>
  )
}

export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  )
}
