"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar, MobileHeader } from "@/components/sidebar"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, FileText, Search, Trash2, ExternalLink, Calendar, FolderOpen } from "lucide-react"
import { toast } from "sonner"

interface Case {
  id: number
  caseNumber: string
  title: string
  description: string | null
  status: string
  seedAddress: string
  createdAt: string
  updatedAt: string
}

export default function CasesPage() {
  const router = useRouter()
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    seedAddress: "",
  })

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/cases")
      if (response.ok) {
        const data = await response.json()
        setCases(data)
      }
    } catch (error) {
      toast.error("Failed to load cases")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCase = async () => {
    if (!newCase.title.trim() || !newCase.seedAddress.trim()) {
      toast.error("Title and seed address are required")
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newCase.seedAddress)) {
      toast.error("Invalid Ethereum address format")
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCase),
      })

      if (response.ok) {
        const created = await response.json()
        setCases([created, ...cases])
        setNewCase({ title: "", description: "", seedAddress: "" })
        setDialogOpen(false)
        toast.success("Case created successfully")
      } else {
        toast.error("Failed to create case")
      }
    } catch (error) {
      toast.error("Failed to create case")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCase = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this case?")) return

    try {
      const response = await fetch(`/api/cases/${id}`, { method: "DELETE" })
      if (response.ok) {
        setCases(cases.filter((c) => c.id !== id))
        toast.success("Case deleted")
      }
    } catch (error) {
      toast.error("Failed to delete case")
    }
  }

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.seedAddress.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Open</Badge>
      case "closed":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Closed</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <MobileHeader />
        <div className="flex-1 flex items-center justify-center pt-[60px] md:pt-0">
          <Loading size="lg" text="Loading cases..." />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <MobileHeader />

      <main className="flex-1 overflow-auto page-gradient pt-[60px] md:pt-0">
        <header className="sticky top-0 z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 md:py-5">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-white">Investigation Cases</h1>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5 hidden sm:block">Manage forensic investigation cases</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-slate-900 font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all text-xs md:text-sm shrink-0">
                  <Plus className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">New Case</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700/50 mx-4 max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Investigation Case</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Enter the details for the new forensic investigation case.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">Case Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., P2P Scam Investigation"
                      value={newCase.title}
                      onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                      className="bg-slate-800/50 border-slate-700/50 rounded-xl focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seedAddress" className="text-slate-300">Seed Wallet Address</Label>
                    <Input
                      id="seedAddress"
                      placeholder="0x..."
                      className="font-mono text-xs sm:text-sm bg-slate-800/50 border-slate-700/50 rounded-xl focus:border-primary/50"
                      value={newCase.seedAddress}
                      onChange={(e) => setNewCase({ ...newCase, seedAddress: e.target.value })}
                    />
                    <p className="text-xs text-slate-500">
                      The initial suspicious wallet address to begin tracing from
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the case..."
                      value={newCase.description}
                      onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                      className="bg-slate-800/50 border-slate-700/50 rounded-xl focus:border-primary/50 min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl border-slate-700 hover:bg-slate-800">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateCase} 
                    disabled={isCreating}
                    className="rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-slate-900 font-semibold"
                  >
                    {isCreating ? (
                      <>
                        <Loading size="sm" className="mr-2" />
                        Creating...
                      </>
                    ) : "Create Case"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 md:space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1 input-glow rounded-xl transition-all">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search cases..."
                className="pl-10 sm:pl-11 h-11 md:h-12 bg-slate-900/50 border-slate-700/50 rounded-xl focus:border-primary/50 transition-colors text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="glass-card p-8 md:p-12 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-7 w-7 md:h-8 md:w-8 text-slate-600" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-white mb-2">No cases found</h3>
              <p className="text-slate-400 mb-6 text-sm md:text-base px-4">
                {searchQuery ? "No cases match your search criteria" : "Create your first investigation case to get started"}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-slate-900 font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Case
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 md:gap-4">
              {filteredCases.map((caseItem, index) => (
                <div
                  key={caseItem.id}
                  className="glass-card-hover p-4 sm:p-6 cursor-pointer group"
                  onClick={() => router.push(`/graph?address=${caseItem.seedAddress}&caseId=${caseItem.id}`)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 flex-wrap">
                        <Badge className="font-mono text-[10px] md:text-xs bg-slate-800 text-slate-300 border-slate-700">
                          {caseItem.caseNumber}
                        </Badge>
                        {getStatusBadge(caseItem.status)}
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 group-hover:text-primary transition-colors truncate">
                        {caseItem.title}
                      </h3>
                      {caseItem.description && (
                        <p className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3 line-clamp-2">{caseItem.description}</p>
                      )}
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-slate-500 flex-wrap">
                        <span className="font-mono bg-slate-800/50 px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs truncate max-w-[180px] sm:max-w-none">
                          {caseItem.seedAddress.slice(0, 10)}...{caseItem.seedAddress.slice(-8)}
                        </span>
                        <span className="flex items-center gap-1 md:gap-1.5 shrink-0">
                          <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 md:h-9 md:w-9 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/graph?address=${caseItem.seedAddress}`)
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 md:h-9 md:w-9 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        onClick={(e) => handleDeleteCase(caseItem.id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
