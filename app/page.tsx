"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Lock, Activity, AlertTriangle, CheckCircle } from "lucide-react"

export default function Dashboard() {
  const [walletAddress, setWalletAddress] = useState("")
  const [isTracing, setIsTracing] = useState(false)

  const handleTrace = async () => {
    if (!walletAddress.trim()) return
    setIsTracing(true)
    // Simulate API call
    setTimeout(() => {
      setIsTracing(false)
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Crypto-TraceChain – Forensic Dashboard</h1>
              <p className="text-muted-foreground">Professional blockchain investigation platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-success border-success">
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

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Wallet Tracing Section */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Wallet Address Tracing
              </CardTitle>
              <CardDescription>Enter a suspicious wallet address to begin forensic analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter wallet address (e.g., 0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681)"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-1 bg-input border-border font-mono"
                />
                <Button onClick={handleTrace} disabled={!walletAddress.trim() || isTracing} className="px-8 neon-glow">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Cases</p>
                    <p className="text-2xl font-bold text-foreground">127</p>
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
                    <p className="text-2xl font-bold text-destructive">43</p>
                  </div>
                  <div className="h-12 w-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Traced Transactions</p>
                    <p className="text-2xl font-bold text-foreground">8,429</p>
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
                    <p className="text-2xl font-bold text-success">1,203</p>
                  </div>
                  <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
                    <Lock className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Investigation Activity</CardTitle>
              <CardDescription>Latest forensic analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { case: "CT-00123", wallet: "0x742d35Cc...681", risk: "High", status: "Active" },
                  { case: "CT-00124", wallet: "0x8ba1f109...a92", risk: "Medium", status: "Under Review" },
                  { case: "CT-00125", wallet: "0x1a2b3c4d...e5f", risk: "Low", status: "Completed" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        {item.case}
                      </Badge>
                      <span className="font-mono text-sm text-muted-foreground">{item.wallet}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          item.risk === "High" ? "destructive" : item.risk === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {item.risk} Risk
                      </Badge>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
