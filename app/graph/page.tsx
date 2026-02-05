"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Filter, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface Node {
  id: string
  label: string
  type: "scammer" | "mule" | "exchange" | "unknown"
  risk: "high" | "medium" | "low"
  x: number
  y: number
  amount?: string
}

interface Edge {
  from: string
  to: string
  amount: string
  timestamp: string
}

export default function GraphAnalysis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [forwardTraversal, setForwardTraversal] = useState(true)
  const [backwardTraversal, setBackwardTraversal] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")

  const nodes: Node[] = [
    { id: "scammer", label: "Scammer Wallet", type: "scammer", risk: "high", x: 100, y: 200 },
    { id: "mule1", label: "Mule Wallet #1", type: "mule", risk: "medium", x: 300, y: 150 },
    { id: "mule2", label: "Mule Wallet #2", type: "mule", risk: "medium", x: 300, y: 250 },
    { id: "mule3", label: "Mule Wallet #3", type: "mule", risk: "medium", x: 500, y: 100 },
    { id: "exchange", label: "Binance Exchange", type: "exchange", risk: "low", x: 700, y: 200 },
    { id: "unknown1", label: "Unknown Wallet", type: "unknown", risk: "medium", x: 500, y: 300 },
  ]

  const edges: Edge[] = [
    { from: "scammer", to: "mule1", amount: "50 ETH", timestamp: "2024-01-15 14:30" },
    { from: "scammer", to: "mule2", amount: "75 ETH", timestamp: "2024-01-15 14:35" },
    { from: "mule1", to: "mule3", amount: "45 ETH", timestamp: "2024-01-15 15:10" },
    { from: "mule2", to: "unknown1", amount: "70 ETH", timestamp: "2024-01-15 15:15" },
    { from: "mule3", to: "exchange", amount: "40 ETH", timestamp: "2024-01-15 16:00" },
    { from: "unknown1", to: "exchange", amount: "65 ETH", timestamp: "2024-01-15 16:30" },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 400

    // Clear canvas
    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw edges with neon glow effect
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)
      if (!fromNode || !toNode) return

      // Neon glow effect
      ctx.shadowColor = "#00d4ff"
      ctx.shadowBlur = 10
      ctx.strokeStyle = "#00d4ff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.stroke()

      // Arrow head
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
      const arrowLength = 15
      ctx.beginPath()
      ctx.moveTo(toNode.x, toNode.y)
      ctx.lineTo(
        toNode.x - arrowLength * Math.cos(angle - Math.PI / 6),
        toNode.y - arrowLength * Math.sin(angle - Math.PI / 6),
      )
      ctx.moveTo(toNode.x, toNode.y)
      ctx.lineTo(
        toNode.x - arrowLength * Math.cos(angle + Math.PI / 6),
        toNode.y - arrowLength * Math.sin(angle + Math.PI / 6),
      )
      ctx.stroke()

      // Amount label
      const midX = (fromNode.x + toNode.x) / 2
      const midY = (fromNode.y + toNode.y) / 2
      ctx.shadowBlur = 0
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px monospace"
      ctx.fillText(edge.amount, midX, midY - 10)
    })

    // Draw nodes
    nodes.forEach((node) => {
      const colors = {
        scammer: "#ef4444", // red
        mule: "#f59e0b", // orange/yellow
        exchange: "#3b82f6", // blue
        unknown: "#6b7280", // gray
      }

      // Node circle with glow
      ctx.shadowColor = colors[node.type]
      ctx.shadowBlur = 15
      ctx.fillStyle = colors[node.type]
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
      ctx.fill()

      // Node border
      ctx.shadowBlur = 0
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.label, node.x, node.y + 35)
    })
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-warning"
      case "low":
        return "text-success"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
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

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transaction Path Analysis</h1>
              <p className="text-muted-foreground">Network visualization of fund flows and wallet connections</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-primary border-primary">
                <Zap className="h-3 w-3 mr-1" />
                Live Analysis
              </Badge>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar Filters */}
          <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Analysis Filters
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="forward" className="text-sm font-medium">
                    Forward Traversal
                  </Label>
                  <Switch id="forward" checked={forwardTraversal} onCheckedChange={setForwardTraversal} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="backward" className="text-sm font-medium">
                    Backward Traversal
                  </Label>
                  <Switch id="backward" checked={backwardTraversal} onCheckedChange={setBackwardTraversal} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Risk Level Filter</Label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk Only</SelectItem>
                      <SelectItem value="medium">Medium Risk Only</SelectItem>
                      <SelectItem value="low">Low Risk Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Risk Color Coding</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-destructive"></div>
                  <span className="text-sm">High Risk - Scammer Wallets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning"></div>
                  <span className="text-sm">Medium Risk - Mule Wallets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span className="text-sm">Low Risk - Exchanges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
                  <span className="text-sm">Unknown - Under Analysis</span>
                </div>
              </div>
            </div>

            {/* Transaction Summary */}
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Volume:</span>
                  <span className="font-mono">345 ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transactions:</span>
                  <span className="font-mono">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Span:</span>
                  <span className="font-mono">2 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Graph Area */}
          <div className="flex-1 p-6">
            <Card className="h-full border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Network Graph Visualization</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Zoom Out
                    </Button>
                    <Button variant="outline" size="sm">
                      Zoom In
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Interactive visualization showing fund flow between wallets</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-120px)]">
                <div className="relative h-full border border-border rounded-lg bg-background/50 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ background: "linear-gradient(45deg, #0a0a0f 0%, #1a1a2e 100%)" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Node Details */}
          <div className="w-80 border-l border-border bg-card/30 backdrop-blur-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold">Node Details</h3>

            <div className="space-y-4">
              {nodes.map((node) => (
                <Card key={node.id} className="border-border bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{node.label}</span>
                      <Badge variant={getRiskBadgeVariant(node.risk)} className="text-xs">
                        {node.risk.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>Type: {node.type}</div>
                      <div className="font-mono">ID: {node.id}</div>
                      {node.type === "exchange" && (
                        <div className="flex items-center gap-1 text-success">
                          <CheckCircle className="h-3 w-3" />
                          KYC Verified
                        </div>
                      )}
                      {node.type === "scammer" && (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          Flagged Wallet
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
