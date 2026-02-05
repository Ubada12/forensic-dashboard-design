"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Lock, Activity, AlertTriangle, CheckCircle, Plus, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface Case {
  id: number
  caseNumber: string
  title: string
  status: string
  seedAddress: string
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState("")
  const [isTracing, setIsTracing] = useState(false)
  const [cases, setCases] = useState<Case[]>([])
  const [stats, setStats] = useState({
    activeCases: 0,
    highRiskWallets: 0,
    tracedTransactions: 0,
    evidenceRecords: 0,
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
        setStats(prev => ({
          ...prev,
          activeCases: data.filter((c: Case) => c.status === "open").length,
        }))
      }
    } catch (error) {
      console.error("Error fetching cases:", error)
    }
  }

  const handleTrace = async () => {
    if (!walletAddress.trim()) return
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error("Invalid Ethereum address format")
      return
    }

    setIsTracing(true)
    try {
      router.push(`/graph?address=${walletAddress}`)
    } catch (error) {
      toast.error("Failed to start trace")
      setIsTracing(false)
    }
  }

  const getRiskBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default">Active</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
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
              <h1 className="text-2xl font-bold text-foreground">Crypto-TraceChain</h1>
              <p className="text-muted-foreground">Forensic Blockchain Investigation Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-500 border-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Badge variant="outline" className="text-primary border-primary">
                <Lock className="h-3 w-3 mr-1" />
                Secure Connection
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Quick Wallet Trace
              </CardTitle>
              <CardDescription>Enter an Ethereum wallet address to analyze transaction patterns and risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter wallet address (e.g., 0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681)"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-1 bg-input border-border font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleTrace()}
                />
                <Button onClick={handleTrace} disabled={!walletAddress.trim() || isTracing} className="px-8">
                  {isTracing ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Tracing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Trace
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Cases</p>
                    <p className="text-2xl font-bold text-foreground">{stats.activeCases}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk Wallets</p>
                    <p className="text-2xl font-bold text-red-500">{stats.highRiskWallets}</p>
                  </div>
                  <div className="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Traced Transactions</p>
                    <p className="text-2xl font-bold text-foreground">{stats.tracedTransactions}</p>
                  </div>
                  <div className="h-12 w-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Search className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Evidence Records</p>
                    <p className="text-2xl font-bold text-green-500">{stats.evidenceRecords}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Lock className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Latest forensic investigation cases</CardDescription>
              </div>
              <Button onClick={() => router.push("/cases")} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </CardHeader>
            <CardContent>
              {cases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No cases yet. Create your first investigation case to get started.</p>
                  <Button onClick={() => router.push("/cases")} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Case
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.slice(0, 5).map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors"
                      onClick={() => router.push(`/graph?address=${caseItem.seedAddress}`)}
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="font-mono">
                          {caseItem.caseNumber}
                        </Badge>
                        <div>
                          <p className="font-medium">{caseItem.title}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {caseItem.seedAddress.slice(0, 10)}...{caseItem.seedAddress.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRiskBadge(caseItem.status)}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
