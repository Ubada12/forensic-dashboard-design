"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, FileText, Search, Trash2, ExternalLink, Calendar } from "lucide-react"
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
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Open</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Investigation Cases</h1>
              <p className="text-muted-foreground">Manage forensic investigation cases</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Investigation Case</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new forensic investigation case.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Case Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., P2P Scam Investigation - Telegram"
                      value={newCase.title}
                      onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seedAddress">Seed Wallet Address</Label>
                    <Input
                      id="seedAddress"
                      placeholder="0x..."
                      className="font-mono"
                      value={newCase.seedAddress}
                      onChange={(e) => setNewCase({ ...newCase, seedAddress: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      The initial suspicious wallet address to begin tracing from
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the case..."
                      value={newCase.description}
                      onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCase} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Case"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases by title, case number, or wallet address..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading cases...</div>
          ) : filteredCases.length === 0 ? (
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No cases found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No cases match your search criteria" : "Create your first investigation case to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Case
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="border-border bg-card/80 backdrop-blur-sm hover:bg-card/90 cursor-pointer transition-colors"
                  onClick={() => router.push(`/graph?address=${caseItem.seedAddress}&caseId=${caseItem.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {caseItem.caseNumber}
                          </Badge>
                          {getStatusBadge(caseItem.status)}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{caseItem.title}</h3>
                        {caseItem.description && (
                          <p className="text-sm text-muted-foreground mb-3">{caseItem.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-mono">
                            {caseItem.seedAddress.slice(0, 10)}...{caseItem.seedAddress.slice(-8)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(caseItem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/graph?address=${caseItem.seedAddress}`)
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={(e) => handleDeleteCase(caseItem.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
