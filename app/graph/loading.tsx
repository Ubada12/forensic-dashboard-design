import { Loading } from "@/components/loading"

export default function GraphLoading() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-slate-800/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />
      <div className="flex-1 flex items-center justify-center page-gradient">
        <Loading size="lg" text="Initializing graph analysis..." />
      </div>
    </div>
  )
}
