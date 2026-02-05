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
import { Search, ZoomIn, ZoomOut, RefreshCw, Filter, AlertTriangle, Building2, Wallet, Zap, Play, Beaker } from "lucide-react"
import { toast } from "sonner"
import * as d3 from "d3"

const DEMO_ADDRESSES = {
  scammer: '0xSCAMMER001',
  victim: '0xVICTIM001', 
  mule: '0xMULE001',
  exchange: '0xBINANCE001'
}

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
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    const addr = searchParams.get("address")
    if (addr) {
      setAddress(addr)
      handleTrace(addr)
    }
  }, [searchParams])

  const isDemoAddress = (addr: string) => {
    return addr.includes('SCAMMER') || addr.includes('MULE') || addr.includes('VICTIM') || addr.includes('MIXER') || addr.includes('BINANCE') || addr.includes('COINBASE')
  }

  const handleTrace = async (addr?: string) => {
    const targetAddress = addr || address
    if (!targetAddress.trim()) {
      toast.error("Please enter a wallet address")
      return
    }

    const isDemo = demoMode || isDemoAddress(targetAddress)
    
    if (!isDemo && !/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      toast.error("Invalid Ethereum address format")
      return
    }

    setIsLoading(true)
    setSelectedNode(null)

    try {
      const response = await fetch("/api/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: targetAddress, depth: depth[0], demoMode: isDemo }),
      })

      if (response.ok) {
        const data = await response.json()
        setTraceResult(data)
        if (data.nodes.length > 0) {
          const modeText = data.isDemo ? " (Demo Mode)" : ""
          toast.success(`Traced ${data.nodes.length} wallets and ${data.edges.length} connections${modeText}`)
        } else {
          toast.info("No transactions found for this address. Try using Demo Mode for a demonstration.")
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
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-hidden flex flex-col page-gradient">
        <header className="sticky top-0 z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <h1 className="text-2xl font-bold text-white">Transaction Graph Analysis</h1>
              <p className="text-slate-400 text-sm mt-0.5">Visualize money flow and trace suspicious transactions</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-xs text-primary font-medium">Live Analysis</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 border-r border-slate-800/50 bg-slate-950/50 backdrop-blur-sm p-5 space-y-5 overflow-auto shrink-0">
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-white">
                <Filter className="h-4 w-4 text-primary" />
                Analysis Controls
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-400">Wallet Address</Label>
                  <Input
                    placeholder="0x..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="font-mono text-xs h-10 bg-slate-900/50 border-slate-700/50 rounded-xl focus:border-primary/50"
                    onKeyDown={(e) => e.key === "Enter" && handleTrace()}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-400">Trace Depth: {depth[0]}</Label>
                  <Slider
                    value={depth}
                    onValueChange={setDepth}
                    min={1}
                    max={3}
                    step={1}
                    className="py-2"
                  />
                  <p className="text-xs text-slate-500">Higher depth = more wallets traced</p>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
                  <Label className="text-xs text-slate-400">High Risk Only</Label>
                  <Switch checked={showHighRiskOnly} onCheckedChange={setShowHighRiskOnly} />
                </div>

                <Button 
                  onClick={() => handleTrace()} 
                  disabled={isLoading} 
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-slate-900 font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? "Tracing..." : "Trace Wallet"}
                </Button>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-800/50">
              <div className="flex items-center gap-2 mb-3">
                <Beaker className="h-4 w-4 text-violet-400" />
                <h4 className="text-xs font-semibold text-slate-300">Demo Mode</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3">Use sample data for demonstration</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAddress(DEMO_ADDRESSES.scammer)
                    setDemoMode(true)
                    handleTrace(DEMO_ADDRESSES.scammer)
                  }}
                  disabled={isLoading}
                  className="text-xs h-9 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Scammer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAddress(DEMO_ADDRESSES.victim)
                    setDemoMode(true)
                    handleTrace(DEMO_ADDRESSES.victim)
                  }}
                  disabled={isLoading}
                  className="text-xs h-9 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                  <Wallet className="h-3 w-3 mr-1" />
                  Victim
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAddress(DEMO_ADDRESSES.mule)
                    setDemoMode(true)
                    handleTrace(DEMO_ADDRESSES.mule)
                  }}
                  disabled={isLoading}
                  className="text-xs h-9 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Mule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAddress(DEMO_ADDRESSES.exchange)
                    setDemoMode(true)
                    handleTrace(DEMO_ADDRESSES.exchange)
                  }}
                  disabled={isLoading}
                  className="text-xs h-9 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  Exchange
                </Button>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-800/50">
              <h4 className="text-xs font-semibold mb-3 text-slate-300">Risk Legend</h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" style={{boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)"}}></div>
                  <span className="text-slate-400">High/Critical Risk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" style={{boxShadow: "0 0 8px rgba(245, 158, 11, 0.6)"}}></div>
                  <span className="text-slate-400">Medium Risk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" style={{boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)"}}></div>
                  <span className="text-slate-400">Low Risk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" style={{boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)"}}></div>
                  <span className="text-slate-400">Exchange (Exit Point)</span>
                </div>
              </div>
            </div>

            {traceResult && (
              <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800/50">
                  <h4 className="text-xs font-semibold text-white">Trace Summary</h4>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Wallets:</span>
                    <span className="font-mono text-white">{traceResult.nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Connections:</span>
                    <span className="font-mono text-white">{traceResult.edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Exit Points:</span>
                    <span className="font-mono text-blue-400">{traceResult.exitPoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Suspicious:</span>
                    <span className="font-mono text-red-400">{traceResult.suspiciousAddresses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Volume:</span>
                    <span className="font-mono text-white">{formatEth(traceResult.totalVolume)} ETH</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col p-5 gap-4 overflow-hidden">
            <div ref={containerRef} className="flex-1 relative rounded-2xl border border-slate-800/50 overflow-hidden" style={{background: "radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)"}}>
              {!traceResult ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-slate-600" />
                    </div>
                    <p className="text-slate-400">Enter a wallet address and click Trace to visualize the transaction graph</p>
                    <p className="text-xs mt-2 text-slate-600">Requires ETHERSCAN_API_KEY in secrets</p>
                  </div>
                </div>
              ) : traceResult.nodes.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="h-8 w-8 text-amber-500/50" />
                    </div>
                    <p className="text-slate-400">No transactions found for this address</p>
                    <p className="text-xs mt-2 text-slate-600">The address may be new or have no activity</p>
                  </div>
                </div>
              ) : (
                <svg ref={svgRef} className="w-full h-full" />
              )}
            </div>

            {traceResult && traceResult.nodes.length > 0 && (
              <div className="grid grid-cols-4 gap-3 shrink-0">
                <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Wallets</p>
                    <p className="text-xl font-bold text-white">{traceResult.nodes.length}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Building2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Exit Points</p>
                    <p className="text-xl font-bold text-blue-400">{traceResult.exitPoints.length}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Suspicious</p>
                    <p className="text-xl font-bold text-red-400">{traceResult.suspiciousAddresses.length}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <RefreshCw className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Volume</p>
                    <p className="text-xl font-bold text-white">{formatEth(traceResult.totalVolume)} ETH</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {selectedNode && (
            <div className="w-72 border-l border-slate-800/50 bg-slate-950/50 backdrop-blur-sm p-5 overflow-auto shrink-0">
              <h3 className="font-semibold mb-4 text-white">Wallet Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500">Address</label>
                  <p className="font-mono text-xs break-all text-white mt-1">{selectedNode.id}</p>
                </div>
                {selectedNode.isExchange && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
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
