"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Lock, Activity, AlertTriangle, CheckCircle, Plus, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrace = async () => {
    if (!walletAddress.trim()) return
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast.error("Invalid Ethereum address format")
      return
    }

    setIsTracing(true)
    router.push(`/graph?address=${walletAddress}`)
  }

  const getRiskBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
      case "closed":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loading size="lg" text="Loading dashboard..." />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto page-gradient">
        <header className="sticky top-0 z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="gradient-text">Crypto-TraceChain</span>
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Forensic Blockchain Investigation Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">System Online</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Lock className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">Secure</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="glass-card p-6 glow-sm">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/10 flex items-center justify-center border border-primary/20">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Quick Wallet Trace</h2>
                <p className="text-sm text-slate-400">Enter an Ethereum wallet address to analyze transaction patterns and risk</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative input-glow rounded-xl transition-all">
                <Input
                  placeholder="Enter wallet address (e.g., 0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681)"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="h-12 bg-slate-900/50 border-slate-700/50 rounded-xl font-mono text-sm pl-4 pr-4 focus:border-primary/50 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleTrace()}
                />
              </div>
              <Button 
                onClick={handleTrace} 
                disabled={!walletAddress.trim() || isTracing} 
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-slate-900 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              >
                {isTracing ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    Tracing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Trace Wallet
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.activeCases}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">Active Cases</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/10 flex items-center justify-center border border-red-500/20 group-hover:scale-105 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-400">{stats.highRiskWallets}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">High Risk Wallets</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center border border-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Search className="h-5 w-5 text-violet-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{stats.tracedTransactions}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">Traced Transactions</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-400">{stats.evidenceRecords}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">Evidence Records</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent Cases</h2>
                <p className="text-sm text-slate-400 mt-0.5">Latest forensic investigation cases</p>
              </div>
              <Button 
                onClick={() => router.push("/cases")} 
                className="rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </div>
            <div className="p-6">
              {cases.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 mb-4">No cases yet. Create your first investigation case to get started.</p>
                  <Button 
                    onClick={() => router.push("/cases")} 
                    className="rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-slate-900 font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Case
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.slice(0, 5).map((caseItem, index) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/30 cursor-pointer transition-all duration-200 group"
                      onClick={() => router.push(`/graph?address=${caseItem.seedAddress}`)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <Badge className="font-mono bg-slate-800 text-slate-300 border-slate-700">
                          {caseItem.caseNumber}
                        </Badge>
                        <div>
                          <p className="font-medium text-white group-hover:text-primary transition-colors">{caseItem.title}</p>
                          <p className="text-sm text-slate-500 font-mono">
                            {caseItem.seedAddress.slice(0, 10)}...{caseItem.seedAddress.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getRiskBadge(caseItem.status)}
                        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
