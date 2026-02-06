"use client"

import { useState } from "react"
import { Sidebar, MobileHeader } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Shield, TrendingUp, Users, Clock, ExternalLink } from "lucide-react"

interface WalletRisk {
  address: string
  riskScore: number
  riskLevel: "high" | "medium" | "low"
  transactions: number
  lastSeen: string
  cluster?: string
}

interface RiskCluster {
  id: string
  name: string
  walletCount: number
  totalRisk: number
  description: string
}

export default function RiskAnalysis() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const wallets: WalletRisk[] = [
    {
      address: "0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681",
      riskScore: 92,
      riskLevel: "high",
      transactions: 1247,
      lastSeen: "2024-01-15 16:30",
      cluster: "Scammer Cluster A",
    },
    {
      address: "0x8ba1f109eddd4bd1c328d14c65a0a5c543a92b47",
      riskScore: 65,
      riskLevel: "medium",
      transactions: 834,
      lastSeen: "2024-01-14 22:15",
      cluster: "Mule Network B",
    },
    {
      address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      riskScore: 20,
      riskLevel: "low",
      transactions: 156,
      lastSeen: "2024-01-13 14:45",
    },
    {
      address: "0x9876543210fedcba0987654321fedcba09876543",
      riskScore: 78,
      riskLevel: "high",
      transactions: 2103,
      lastSeen: "2024-01-15 18:20",
      cluster: "Scammer Cluster A",
    },
    {
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      riskScore: 45,
      riskLevel: "medium",
      transactions: 567,
      lastSeen: "2024-01-12 09:30",
    },
  ]

  const clusters: RiskCluster[] = [
    {
      id: "cluster-a",
      name: "Scammer Cluster A",
      walletCount: 12,
      totalRisk: 89,
      description: "Coordinated fraud network targeting DeFi protocols",
    },
    {
      id: "cluster-b",
      name: "Mule Network B",
      walletCount: 8,
      totalRisk: 67,
      description: "Money laundering operation using multiple intermediary wallets",
    },
    {
      id: "cluster-c",
      name: "Exchange Abuse Ring",
      walletCount: 15,
      totalRisk: 73,
      description: "Systematic exploitation of exchange withdrawal limits",
    },
  ]

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-destructive"
    if (score >= 40) return "text-warning"
    return "text-success"
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const RiskGauge = ({ score, size = 120 }: { score: number; size?: number }) => {
    const radius = size / 2 - 10
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (score / 100) * circumference

    const getColor = (score: number) => {
      if (score >= 70) return "#ef4444"
      if (score >= 40) return "#f59e0b"
      return "#22c55e"
    }

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${getColor(score)})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl md:text-2xl font-bold" style={{ color: getColor(score) }}>
            {score}
          </span>
          <span className="text-[10px] md:text-xs text-muted-foreground">Risk Score</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />
      <MobileHeader />

      <main className="flex-1 overflow-auto pt-[60px] md:pt-0">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground">Risk Analysis Dashboard</h1>
              <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">Comprehensive wallet risk assessment and clustering analysis</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Badge variant="outline" className="text-primary border-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Real-time Analysis
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {wallets.slice(0, 3).map((wallet, index) => (
              <Card key={wallet.address} className="border-border bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center p-4 md:p-6">
                  <CardTitle className="text-base md:text-lg">Wallet Analysis</CardTitle>
                  <CardDescription className="font-mono text-[10px] md:text-xs truncate">{wallet.address}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                  <RiskGauge score={wallet.riskScore} size={100} />
                  <div className="text-center space-y-2">
                    <Badge variant={getRiskBadgeVariant(wallet.riskLevel)} className="text-xs md:text-sm">
                      {wallet.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      <div>{wallet.transactions} transactions</div>
                      <div>Last seen: {wallet.lastSeen}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Wallet Clustering Analysis
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Identified groups of related wallets based on transaction patterns</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {clusters.map((cluster) => (
                  <Card key={cluster.id} className="border-border bg-muted/20">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between mb-2 md:mb-3 gap-2">
                        <h4 className="font-semibold text-sm md:text-base truncate">{cluster.name}</h4>
                        <Badge variant={cluster.totalRisk >= 70 ? "destructive" : "secondary"} className="shrink-0 text-xs">
                          Risk: {cluster.totalRisk}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wallets:</span>
                          <span>{cluster.walletCount}</span>
                        </div>
                        <Progress value={cluster.totalRisk} className="h-2" />
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-2">{cluster.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Wallet Risk Assessment
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Comprehensive risk analysis for all monitored wallets</CardDescription>
            </CardHeader>
            <CardContent className="p-0 md:p-6 md:pt-0">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallets.map((wallet) => (
                      <TableRow key={wallet.address}>
                        <TableCell className="font-mono text-sm">{wallet.address}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${getRiskColor(wallet.riskScore)}`}>{wallet.riskScore}</span>
                            <Progress value={wallet.riskScore} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRiskBadgeVariant(wallet.riskLevel)}>{wallet.riskLevel.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{wallet.transactions.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-sm">{wallet.lastSeen}</TableCell>
                        <TableCell>
                          {wallet.cluster ? (
                            <Badge variant="outline" className="text-xs">
                              {wallet.cluster}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Analyze
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3 p-4">
                {wallets.map((wallet) => (
                  <div key={wallet.address} className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getRiskBadgeVariant(wallet.riskLevel)} className="text-[10px]">{wallet.riskLevel.toUpperCase()}</Badge>
                      <span className={`font-bold text-sm ${getRiskColor(wallet.riskScore)}`}>{wallet.riskScore}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">{wallet.address}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{wallet.transactions.toLocaleString()} txns</span>
                      <span>{wallet.lastSeen}</span>
                    </div>
                    {wallet.cluster && (
                      <Badge variant="outline" className="text-[10px]">{wallet.cluster}</Badge>
                    )}
                    <Progress value={wallet.riskScore} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-sm text-muted-foreground">High Risk</p>
                    <p className="text-xl md:text-2xl font-bold text-destructive">23</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-destructive/20 rounded-lg flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Medium Risk</p>
                    <p className="text-xl md:text-2xl font-bold text-warning">67</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-warning/20 rounded-lg flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 md:h-6 md:w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Active Clusters</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">12</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-lg md:text-lg font-bold text-foreground">2 min ago</p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-success/20 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
