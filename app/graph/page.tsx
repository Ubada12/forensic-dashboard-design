"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, ZoomIn, ZoomOut, RefreshCw, Filter, AlertTriangle, Building2, Wallet, Zap } from "lucide-react"
import { toast } from "sonner"
import * as d3 from "d3"

interface GraphNode {
  id: string
  label: string
  riskScore: number
  riskLevel: string
  isExchange: boolean
  exchangeName: string | null
  totalIn: number
  totalOut: number
  txCount: number
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface GraphEdge {
  source: string | GraphNode
  target: string | GraphNode
  value: number
  txCount: number
  txHashes: string[]
}

interface TraceResult {
  nodes: GraphNode[]
  edges: GraphEdge[]
  totalVolume: number
  exitPoints: string[]
  suspiciousAddresses: string[]
}

function GraphContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [address, setAddress] = useState(searchParams.get("address") || "")
  const [depth, setDepth] = useState([2])
  const [isLoading, setIsLoading] = useState(false)
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [showHighRiskOnly, setShowHighRiskOnly] = useState(false)

  useEffect(() => {
    const addr = searchParams.get("address")
    if (addr) {
      setAddress(addr)
      handleTrace(addr)
    }
  }, [searchParams])

  const handleTrace = async (addr?: string) => {
    const targetAddress = addr || address
    if (!targetAddress.trim()) {
      toast.error("Please enter a wallet address")
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      toast.error("Invalid Ethereum address format")
      return
    }

    setIsLoading(true)
    setSelectedNode(null)

    try {
      const response = await fetch("/api/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: targetAddress, depth: depth[0] }),
      })

      if (response.ok) {
        const data = await response.json()
        setTraceResult(data)
        if (data.nodes.length > 0) {
          toast.success(`Traced ${data.nodes.length} wallets and ${data.edges.length} connections`)
        } else {
          toast.info("No transactions found for this address. Make sure you have configured an Etherscan API key.")
        }
      } else {
        toast.error("Failed to trace address")
      }
    } catch (error) {
      toast.error("Failed to trace address. Configure ETHERSCAN_API_KEY in secrets.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "#22c55e"
      case "medium": return "#f59e0b"
      case "high": return "#ef4444"
      case "critical": return "#dc2626"
      default: return "#6b7280"
    }
  }, [])

  useEffect(() => {
    if (!traceResult || !svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)

    const g = svg.append("g")

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    const filteredNodes = showHighRiskOnly 
      ? traceResult.nodes.filter(n => n.riskScore >= 50 || n.isExchange)
      : traceResult.nodes

    const nodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredEdges = traceResult.edges.filter(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id
      const targetId = typeof e.target === 'string' ? e.target : e.target.id
      return nodeIds.has(sourceId) && nodeIds.has(targetId)
    })

    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force("link", d3.forceLink<GraphNode, GraphEdge>(filteredEdges)
        .id(d => d.id)
        .distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50))

    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#00d4ff")

    const link = g.append("g")
      .selectAll("line")
      .data(filteredEdges)
      .join("line")
      .attr("stroke", "#00d4ff")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.min(Math.max(d.value * 2, 1), 5))
      .attr("marker-end", "url(#arrowhead)")
      .style("filter", "drop-shadow(0 0 3px #00d4ff)")

    const node = g.append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(filteredNodes)
      .join("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))
      .on("click", (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
      })

    node.append("circle")
      .attr("r", d => d.isExchange ? 25 : 20)
      .attr("fill", d => d.isExchange ? "#3b82f6" : getRiskColor(d.riskLevel))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("filter", d => `drop-shadow(0 0 8px ${d.isExchange ? "#3b82f6" : getRiskColor(d.riskLevel)})`)

    node.append("text")
      .attr("dy", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "10px")
      .text(d => d.label)

    node.filter(d => d.isExchange)
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text("CEX")

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x || 0)
        .attr("y1", d => (d.source as GraphNode).y || 0)
        .attr("x2", d => (d.target as GraphNode).x || 0)
        .attr("y2", d => (d.target as GraphNode).y || 0)

      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`)
    })

    svg.on("click", () => setSelectedNode(null))

    return () => {
      simulation.stop()
    }
  }, [traceResult, getRiskColor, showHighRiskOnly])

  const formatEth = (value: number) => value.toFixed(4)

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />

      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transaction Graph Analysis</h1>
              <p className="text-muted-foreground">Visualize money flow and trace suspicious transactions</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              <Zap className="h-3 w-3 mr-1" />
              Live Analysis
            </Badge>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 border-r border-border bg-card/30 backdrop-blur-sm p-4 space-y-4 overflow-auto shrink-0">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Analysis Controls
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Wallet Address</Label>
                  <Input
                    placeholder="0x..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="font-mono text-xs"
                    onKeyDown={(e) => e.key === "Enter" && handleTrace()}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Trace Depth: {depth[0]}</Label>
                  <Slider
                    value={depth}
                    onValueChange={setDepth}
                    min={1}
                    max={3}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">Higher depth = more wallets traced</p>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">High Risk Only</Label>
                  <Switch checked={showHighRiskOnly} onCheckedChange={setShowHighRiskOnly} />
                </div>

                <Button onClick={() => handleTrace()} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? "Tracing..." : "Trace Wallet"}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-semibold mb-2">Risk Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" style={{boxShadow: "0 0 6px #ef4444"}}></div>
                  <span>High/Critical Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" style={{boxShadow: "0 0 6px #f59e0b"}}></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" style={{boxShadow: "0 0 6px #22c55e"}}></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" style={{boxShadow: "0 0 6px #3b82f6"}}></div>
                  <span>Exchange (Exit Point)</span>
                </div>
              </div>
            </div>

            {traceResult && (
              <Card className="border-border bg-card/50">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-xs">Trace Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 px-3 pb-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallets:</span>
                    <span className="font-mono">{traceResult.nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connections:</span>
                    <span className="font-mono">{traceResult.edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exit Points:</span>
                    <span className="font-mono">{traceResult.exitPoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suspicious:</span>
                    <span className="font-mono text-red-500">{traceResult.suspiciousAddresses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-mono">{formatEth(traceResult.totalVolume)} ETH</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            <div ref={containerRef} className="flex-1 relative bg-card/30 rounded-lg border border-border overflow-hidden" style={{background: "linear-gradient(45deg, #0a0a0f 0%, #1a1a2e 100%)"}}>
              {!traceResult ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter a wallet address and click Trace to visualize the transaction graph</p>
                    <p className="text-xs mt-2 text-muted-foreground">Requires ETHERSCAN_API_KEY in secrets</p>
                  </div>
                </div>
              ) : traceResult.nodes.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions found for this address</p>
                    <p className="text-xs mt-2">The address may be new or have no activity</p>
                  </div>
                </div>
              ) : (
                <svg ref={svgRef} className="w-full h-full" />
              )}
            </div>

            {traceResult && traceResult.nodes.length > 0 && (
              <div className="flex gap-4 shrink-0">
                <Card className="flex-1 border-border bg-card/80">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Wallets</p>
                      <p className="text-lg font-bold">{traceResult.nodes.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1 border-border bg-card/80">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Exit Points</p>
                      <p className="text-lg font-bold">{traceResult.exitPoints.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1 border-border bg-card/80">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Suspicious</p>
                      <p className="text-lg font-bold">{traceResult.suspiciousAddresses.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="flex-1 border-border bg-card/80">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Volume</p>
                      <p className="text-lg font-bold">{formatEth(traceResult.totalVolume)} ETH</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {selectedNode && (
            <div className="w-72 border-l border-border bg-card/30 backdrop-blur-sm p-4 overflow-auto shrink-0">
              <h3 className="font-semibold mb-4">Wallet Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Address</label>
                  <p className="font-mono text-xs break-all">{selectedNode.id}</p>
                </div>
                {selectedNode.isExchange && (
                  <Badge className="bg-blue-500/20 text-blue-500">
                    <Building2 className="h-3 w-3 mr-1" />
                    {selectedNode.exchangeName || "Exchange"}
                  </Badge>
                )}
                <div>
                  <label className="text-xs text-muted-foreground">Risk Score</label>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${selectedNode.riskScore}%`,
                            backgroundColor: getRiskColor(selectedNode.riskLevel),
                          }}
                        />
                      </div>
                      <span className="font-bold text-sm">{selectedNode.riskScore}</span>
                    </div>
                    <Badge
                      className="mt-2"
                      style={{
                        backgroundColor: `${getRiskColor(selectedNode.riskLevel)}20`,
                        color: getRiskColor(selectedNode.riskLevel),
                      }}
                    >
                      {selectedNode.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Total In</label>
                    <p className="font-bold text-sm">{formatEth(selectedNode.totalIn)} ETH</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Total Out</label>
                    <p className="font-bold text-sm">{formatEth(selectedNode.totalOut)} ETH</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Transactions</label>
                  <p className="font-bold text-sm">{selectedNode.txCount}</p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/risk?address=${selectedNode.id}`)}
                >
                  View Full Analysis
                </Button>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    setAddress(selectedNode.id)
                    handleTrace(selectedNode.id)
                  }}
                >
                  Trace This Wallet
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function GraphPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background">Loading...</div>}>
      <GraphContent />
    </Suspense>
  )
}
