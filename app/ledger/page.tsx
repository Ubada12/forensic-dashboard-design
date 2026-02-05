"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Database, Shield, CheckCircle, Clock, Hash, ExternalLink } from "lucide-react"

interface BlockchainBlock {
  blockNumber: number
  caseId: string
  timestamp: string
  evidenceHash: string
  status: "anchored" | "pending" | "verified"
  investigator: string
  description: string
}

interface LedgerRecord {
  id: string
  caseId: string
  timestamp: string
  evidenceType: string
  hash: string
  status: "anchored" | "pending" | "verified"
  verificationCount: number
}

export default function BlockchainLedger() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null)

  const blocks: BlockchainBlock[] = [
    {
      blockNumber: 1001,
      caseId: "CT-00123",
      timestamp: "2024-01-15 16:30:25",
      evidenceHash: "e3f8a2b7c9d1e4f6a8b2c5d7e9f1a3b5c7d9e2f4a6b8c1d3e5f7a9b2c4d6e8f0",
      status: "anchored",
      investigator: "Agent Sarah Chen",
      description: "DeFi Protocol Exploit Evidence Package",
    },
    {
      blockNumber: 1002,
      caseId: "CT-00124",
      timestamp: "2024-01-15 17:45:12",
      evidenceHash: "f4a6b8c1d3e5f7a9b2c4d6e8f0a2b4c6d8e1f3a5b7c9d2e4f6a8b1c3d5e7f9a2",
      status: "anchored",
      investigator: "Agent Mike Rodriguez",
      description: "Exchange Manipulation Transaction Records",
    },
    {
      blockNumber: 1003,
      caseId: "CT-00125",
      timestamp: "2024-01-15 18:20:08",
      evidenceHash: "a5b7c9d2e4f6a8b1c3d5e7f9a2b4c6d8e1f3a5b7c9d2e4f6a8b1c3d5e7f9a2b4",
      status: "verified",
      investigator: "Agent Lisa Park",
      description: "NFT Fraud Ring Digital Assets",
    },
    {
      blockNumber: 1004,
      caseId: "CT-00126",
      timestamp: "2024-01-15 19:10:33",
      evidenceHash: "b6c8d1e3f5a7b9c2d4e6f8a1b3c5d7e9f2a4b6c8d1e3f5a7b9c2d4e6f8a1b3c5",
      status: "pending",
      investigator: "Agent David Kim",
      description: "Ransomware Payment Tracking",
    },
  ]

  const ledgerRecords: LedgerRecord[] = [
    {
      id: "LR-001",
      caseId: "CT-00123",
      timestamp: "2024-01-15 16:30:25",
      evidenceType: "Transaction Evidence",
      hash: "e3f8a2b7c9d1e4f6a8b2c5d7e9f1a3b5",
      status: "anchored",
      verificationCount: 3,
    },
    {
      id: "LR-002",
      caseId: "CT-00123",
      timestamp: "2024-01-15 16:35:42",
      evidenceType: "Wallet Analysis",
      hash: "c7d9e2f4a6b8c1d3e5f7a9b2c4d6e8f0",
      status: "anchored",
      verificationCount: 2,
    },
    {
      id: "LR-003",
      caseId: "CT-00124",
      timestamp: "2024-01-15 17:45:12",
      evidenceType: "Exchange Records",
      hash: "f4a6b8c1d3e5f7a9b2c4d6e8f0a2b4c6",
      status: "verified",
      verificationCount: 5,
    },
    {
      id: "LR-004",
      caseId: "CT-00125",
      timestamp: "2024-01-15 18:20:08",
      evidenceType: "Digital Assets",
      hash: "a5b7c9d2e4f6a8b1c3d5e7f9a2b4c6d8",
      status: "pending",
      verificationCount: 1,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "anchored":
        return "text-success"
      case "verified":
        return "text-primary"
      case "pending":
        return "text-warning"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "anchored":
        return "outline"
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const BlockVisualization = () => {
    return (
      <div className="relative">
        <div className="flex items-center justify-center space-x-4 p-8 bg-gradient-to-r from-background via-muted/20 to-background rounded-lg border border-border">
          {blocks.slice(0, 4).map((block, index) => (
            <div key={block.blockNumber} className="flex items-center">
              {/* Block */}
              <div
                className={`relative w-24 h-24 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  block.status === "anchored"
                    ? "bg-success/20 border-success neon-glow"
                    : block.status === "verified"
                      ? "bg-primary/20 border-primary neon-glow"
                      : "bg-warning/20 border-warning"
                }`}
                onClick={() => setSelectedBlock(block)}
              >
                <div className="absolute inset-2 bg-background/80 rounded border border-border flex flex-col items-center justify-center">
                  <Database className="h-6 w-6 mb-1" style={{ color: getStatusColor(block.status) }} />
                  <span className="text-xs font-mono">#{block.blockNumber}</span>
                </div>
                {/* Glowing edges */}
                <div
                  className="absolute inset-0 rounded-lg opacity-50"
                  style={{
                    boxShadow: `0 0 10px ${
                      block.status === "anchored" ? "#22c55e" : block.status === "verified" ? "#3b82f6" : "#f59e0b"
                    }`,
                  }}
                />
              </div>

              {/* Connection Line */}
              {index < blocks.slice(0, 4).length - 1 && (
                <div className="w-8 h-0.5 bg-primary/50 relative">
                  <div className="absolute inset-0 bg-primary/80 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Block Details */}
        {selectedBlock && (
          <Card className="mt-6 border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Block #{selectedBlock.blockNumber} Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Case ID</label>
                  <p className="font-mono">{selectedBlock.caseId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={getStatusBadgeVariant(selectedBlock.status)} className="ml-2">
                    {selectedBlock.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="font-mono text-sm">{selectedBlock.timestamp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Investigator</label>
                  <p>{selectedBlock.investigator}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Evidence Hash</label>
                <p className="font-mono text-xs break-all bg-muted/50 p-2 rounded mt-1">{selectedBlock.evidenceHash}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p>{selectedBlock.description}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Suspicion Ledger – Hyperledger Fabric Integration</h1>
              <p className="text-muted-foreground">Immutable blockchain evidence storage and verification</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-success border-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                Blockchain Connected
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Search and Controls */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by Case ID, Hash, or Investigator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Hash className="h-4 w-4 mr-2" />
                  Hash Verification
                </Button>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Case Lookup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="blockchain" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blockchain">Blockchain Visualization</TabsTrigger>
              <TabsTrigger value="records">Ledger Records</TabsTrigger>
              <TabsTrigger value="verification">Hash Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="blockchain" className="space-y-6">
              <Card className="border-border bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Recent Blocks
                  </CardTitle>
                  <CardDescription>
                    Interactive blockchain visualization showing evidence anchoring status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlockVisualization />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              <Card className="border-border bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Ledger Records
                  </CardTitle>
                  <CardDescription>Complete audit trail of all evidence submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Record ID</TableHead>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Evidence Type</TableHead>
                        <TableHead>Hash</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verifications</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm">{record.id}</TableCell>
                          <TableCell className="font-mono">{record.caseId}</TableCell>
                          <TableCell className="font-mono text-sm">{record.timestamp}</TableCell>
                          <TableCell>{record.evidenceType}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <span className="truncate max-w-[120px] block">{record.hash}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(record.status)}>{record.status.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span>{record.verificationCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <Card className="border-border bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    Hash Verification
                  </CardTitle>
                  <CardDescription>Verify evidence integrity using blockchain hashes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter evidence hash to verify..."
                      className="flex-1 font-mono bg-input border-border"
                    />
                    <Button className="neon-glow">
                      <Shield className="h-4 w-4 mr-2" />
                      Verify Hash
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="border-border bg-muted/20">
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                        <h4 className="font-semibold">Verified Hashes</h4>
                        <p className="text-2xl font-bold text-success">1,247</p>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-muted/20">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
                        <h4 className="font-semibold">Pending</h4>
                        <p className="text-2xl font-bold text-warning">23</p>
                      </CardContent>
                    </Card>

                    <Card className="border-border bg-muted/20">
                      <CardContent className="p-4 text-center">
                        <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold">Total Records</h4>
                        <p className="text-2xl font-bold text-foreground">1,270</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
