"use client"

import { useState } from "react"
import { Sidebar, MobileHeader } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Shield, Calendar, User, ExternalLink } from "lucide-react"

interface Transaction {
  hash: string
  sender: string
  receiver: string
  amount: string
  timestamp: string
  kycInfo?: string
  status: "confirmed" | "pending" | "flagged"
}

interface EvidenceReport {
  caseId: string
  title: string
  investigator: string
  dateCreated: string
  status: "draft" | "review" | "approved" | "submitted"
  transactions: Transaction[]
}

export default function EvidenceReports() {
  const [selectedCase, setSelectedCase] = useState("CT-00123")
  const [reportFormat, setReportFormat] = useState("pdf")

  const currentReport: EvidenceReport = {
    caseId: "CT-00123",
    title: "Cryptocurrency Fraud Investigation - DeFi Protocol Exploit",
    investigator: "Agent Sarah Chen",
    dateCreated: "2024-01-15",
    status: "review",
    transactions: [
      {
        hash: "0xabc123def456789abcdef123456789abcdef123456789abcdef123456789abcdef",
        sender: "0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681",
        receiver: "0x8ba1f109eddd4bd1c328d14c65a0a5c543a92b47",
        amount: "50.00 ETH",
        timestamp: "2024-01-15 14:30:25",
        kycInfo: "Rajesh Kumar (Binance Verified)",
        status: "confirmed",
      },
      {
        hash: "0xdef456abc789123def456abc789123def456abc789123def456abc789123def456",
        sender: "0x8ba1f109eddd4bd1c328d14c65a0a5c543a92b47",
        receiver: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        amount: "45.50 ETH",
        timestamp: "2024-01-15 15:10:42",
        status: "confirmed",
      },
      {
        hash: "0x789123456def789abc123456def789abc123456def789abc123456def789abc123",
        sender: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        receiver: "0x9876543210fedcba0987654321fedcba09876543",
        amount: "10.00 USDT",
        timestamp: "2024-01-15 16:00:15",
        kycInfo: "Maria Santos (Coinbase Pro)",
        status: "flagged",
      },
      {
        hash: "0x456789abcdef456789abcdef456789abcdef456789abcdef456789abcdef456789",
        sender: "0x9876543210fedcba0987654321fedcba09876543",
        receiver: "0xabcdef1234567890abcdef1234567890abcdef12",
        amount: "8.75 USDT",
        timestamp: "2024-01-15 16:30:08",
        status: "pending",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-success"
      case "pending":
        return "text-warning"
      case "flagged":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "outline"
      case "pending":
        return "secondary"
      case "flagged":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleDownloadReport = () => {
    const link = document.createElement('a')
    link.href = '/reports/CryptoTraceChain_Forensic_Report.pdf'
    link.download = `CryptoTraceChain_Case_${selectedCase}_Report.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex h-screen bg-background blockchain-bg">
      <Sidebar />
      <MobileHeader />

      <main className="flex-1 overflow-auto pt-[60px] md:pt-0">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground">Evidence Reports</h1>
              <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">Generate and manage forensic investigation reports</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Badge variant="outline" className="text-primary border-primary">
                <Shield className="h-3 w-3 mr-1" />
                Confidential
              </Badge>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 space-y-4 md:space-y-6">
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Report Generation
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Select case and format for evidence report generation</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 md:gap-4">
                <div className="flex-1">
                  <label className="text-xs md:text-sm font-medium mb-2 block">Case ID</label>
                  <Select value={selectedCase} onValueChange={setSelectedCase}>
                    <SelectTrigger className="text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CT-00123">CT-00123 - DeFi Protocol Exploit</SelectItem>
                      <SelectItem value="CT-00124">CT-00124 - Exchange Manipulation</SelectItem>
                      <SelectItem value="CT-00125">CT-00125 - NFT Fraud Ring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-xs md:text-sm font-medium mb-2 block">Format</label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger className="text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="csv">CSV Data Export</SelectItem>
                      <SelectItem value="json">JSON Evidence Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleDownloadReport} className="neon-glow shrink-0">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download Report ({reportFormat.toUpperCase()})</span>
                  <span className="sm:hidden">Download</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base md:text-xl">Forensic Evidence Report</CardTitle>
                  <CardDescription>Case ID: {currentReport.caseId}</CardDescription>
                </div>
                <div className="text-left sm:text-right text-xs md:text-sm text-muted-foreground">
                  <div>Generated: {new Date().toLocaleDateString()}</div>
                  <div className="text-[10px] md:text-xs opacity-50">CONFIDENTIAL</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-3 md:p-4 bg-muted/20 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Case Title</label>
                    <p className="font-medium text-xs md:text-sm">{currentReport.title}</p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Lead Investigator</label>
                    <p className="flex items-center gap-2 text-xs md:text-sm">
                      <User className="h-3 w-3 md:h-4 md:w-4" />
                      {currentReport.investigator}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Date Created</label>
                    <p className="flex items-center gap-2 text-xs md:text-sm">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      {currentReport.dateCreated}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {currentReport.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4">Transaction Evidence</h3>

                <div className="hidden md:block border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Transaction Hash</TableHead>
                        <TableHead className="font-semibold">Sender Wallet</TableHead>
                        <TableHead className="font-semibold">Receiver Wallet</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Timestamp</TableHead>
                        <TableHead className="font-semibold">Exchange KYC</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentReport.transactions.map((tx, index) => (
                        <TableRow key={tx.hash} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[120px]">{tx.hash}</span>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{tx.sender}</TableCell>
                          <TableCell className="font-mono text-xs">{tx.receiver}</TableCell>
                          <TableCell className="font-semibold">{tx.amount}</TableCell>
                          <TableCell className="font-mono text-xs">{tx.timestamp}</TableCell>
                          <TableCell>
                            {tx.kycInfo ? (
                              <div className="text-xs">
                                <div className="font-medium">{tx.kycInfo}</div>
                                <Badge variant="outline" className="text-xs mt-1">
                                  Verified
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No KYC Data</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(tx.status)} className="text-xs">
                              {tx.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden space-y-3">
                  {currentReport.transactions.map((tx, index) => (
                    <div key={tx.hash} className="border border-border rounded-lg p-3 bg-muted/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusBadgeVariant(tx.status)} className="text-[10px]">
                          {tx.status.toUpperCase()}
                        </Badge>
                        <span className="font-semibold text-sm">{tx.amount}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <span className="text-[10px] text-muted-foreground">From:</span>
                          <p className="font-mono text-[10px] truncate">{tx.sender}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground">To:</span>
                          <p className="font-mono text-[10px] truncate">{tx.receiver}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{tx.timestamp}</span>
                        {tx.kycInfo && (
                          <Badge variant="outline" className="text-[10px]">KYC: {tx.kycInfo.split(' (')[0]}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 md:p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm md:text-base">Investigation Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">Total Transactions:</span>
                    <span className="ml-2 font-semibold">{currentReport.transactions.length}</span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">Flagged Transactions:</span>
                    <span className="ml-2 font-semibold text-destructive">
                      {currentReport.transactions.filter((tx) => tx.status === "flagged").length}
                    </span>
                  </div>
                  <div className="flex justify-between sm:block">
                    <span className="text-muted-foreground">KYC Identified:</span>
                    <span className="ml-2 font-semibold text-success">
                      {currentReport.transactions.filter((tx) => tx.kycInfo).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center py-4 md:py-8 opacity-30 hidden md:block">
                <div className="text-2xl md:text-4xl font-bold text-muted-foreground transform rotate-12">
                  CONFIDENTIAL
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
