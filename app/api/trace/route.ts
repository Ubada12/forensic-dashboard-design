import { NextRequest, NextResponse } from "next/server";
import { getTransactions, isValidEthAddress, identifyExchange, weiToEth } from "@/lib/ethereum";
import { calculateRiskScore } from "@/lib/risk-scoring";
import { getDemoGraphData, DEMO_WALLETS } from "@/lib/demo-data";

interface GraphNode {
  id: string;
  label: string;
  riskScore: number;
  riskLevel: string;
  isExchange: boolean;
  exchangeName: string | null;
  totalIn: number;
  totalOut: number;
  txCount: number;
  interactsWithExchange: boolean;
  type?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  value: number;
  txCount: number;
  txHashes: string[];
}

interface TraceResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  totalVolume: number;
  exitPoints: string[];
  suspiciousAddresses: string[];
}

function isDemoAddress(address: string): boolean {
  return DEMO_WALLETS.some(w => w.address.toLowerCase() === address.toLowerCase());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, depth = 2, demoMode = false } = body;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    if (demoMode || isDemoAddress(address)) {
      const demoData = getDemoGraphData(address, depth);
      
      const nodes: GraphNode[] = demoData.nodes.map(n => ({
        id: n.id,
        label: n.label || `${n.id.slice(0, 8)}...${n.id.slice(-4)}`,
        riskScore: n.riskScore,
        riskLevel: n.riskScore >= 70 ? 'high' : n.riskScore >= 40 ? 'medium' : 'low',
        isExchange: n.isExchange,
        exchangeName: n.exchangeName || null,
        totalIn: n.totalReceived || 0,
        totalOut: n.totalSent || 0,
        txCount: 0,
        interactsWithExchange: n.isExchange,
        type: n.type
      }));

      const edges: GraphEdge[] = demoData.links.map(l => ({
        source: l.source,
        target: l.target,
        value: l.value,
        txCount: 1,
        txHashes: [l.hash]
      }));

      return NextResponse.json({
        nodes,
        edges,
        totalVolume: demoData.totalVolume,
        exitPoints: demoData.exitPoints,
        suspiciousAddresses: demoData.suspiciousAddresses,
        isDemo: true
      });
    }

    if (!isValidEthAddress(address)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 });
    }

    const traced = new Set<string>();
    const nodes: Map<string, GraphNode> = new Map();
    const edges: Map<string, GraphEdge> = new Map();
    const exchangeInteractions: Set<string> = new Set();
    const queue: { addr: string; level: number }[] = [{ addr: address.toLowerCase(), level: 0 }];

    while (queue.length > 0 && traced.size < 50) {
      const current = queue.shift();
      if (!current || current.level > depth) continue;
      if (traced.has(current.addr)) continue;

      traced.add(current.addr);

      const transactions = await getTransactions(current.addr);
      
      const addressStats = {
        totalIn: 0,
        totalOut: 0,
        txCount: transactions.length,
        connections: new Set<string>(),
        timestamps: [] as number[],
        interactsWithExchange: false,
      };

      for (const tx of transactions) {
        const from = tx.from.toLowerCase();
        const to = tx.to?.toLowerCase();
        const value = weiToEth(tx.value);

        if (!to) continue;

        addressStats.timestamps.push(parseInt(tx.timeStamp) * 1000);

        if (from === current.addr) {
          addressStats.totalOut += value;
          addressStats.connections.add(to);
          
          if (identifyExchange(to)) {
            addressStats.interactsWithExchange = true;
            exchangeInteractions.add(current.addr);
          }
          
          const edgeKey = `${from}-${to}`;
          const existing = edges.get(edgeKey);
          if (existing) {
            existing.value += value;
            existing.txCount++;
            existing.txHashes.push(tx.hash);
          } else {
            edges.set(edgeKey, {
              source: from,
              target: to,
              value,
              txCount: 1,
              txHashes: [tx.hash],
            });
          }

          if (!traced.has(to) && current.level < depth) {
            queue.push({ addr: to, level: current.level + 1 });
          }
        } else if (to === current.addr) {
          addressStats.totalIn += value;
          addressStats.connections.add(from);
          
          if (identifyExchange(from)) {
            addressStats.interactsWithExchange = true;
            exchangeInteractions.add(current.addr);
          }
          
          const edgeKey = `${from}-${to}`;
          const existing = edges.get(edgeKey);
          if (existing) {
            existing.value += value;
            existing.txCount++;
            existing.txHashes.push(tx.hash);
          } else {
            edges.set(edgeKey, {
              source: from,
              target: to,
              value,
              txCount: 1,
              txHashes: [tx.hash],
            });
          }

          if (!traced.has(from) && current.level < depth) {
            queue.push({ addr: from, level: current.level + 1 });
          }
        }
      }

      let avgTimeBetweenTx = 0;
      if (addressStats.timestamps.length > 1) {
        addressStats.timestamps.sort((a, b) => a - b);
        let totalDiff = 0;
        for (let i = 1; i < addressStats.timestamps.length; i++) {
          totalDiff += (addressStats.timestamps[i] - addressStats.timestamps[i - 1]) / 1000;
        }
        avgTimeBetweenTx = totalDiff / (addressStats.timestamps.length - 1);
      }

      const exchangeName = identifyExchange(current.addr);
      const isExitPoint = exchangeName !== null || addressStats.interactsWithExchange;
      
      const riskAnalysis = calculateRiskScore(
        current.addr,
        addressStats.txCount,
        addressStats.connections.size,
        avgTimeBetweenTx,
        addressStats.totalIn + addressStats.totalOut,
        isExitPoint,
        false
      );

      nodes.set(current.addr, {
        id: current.addr,
        label: exchangeName || `${current.addr.slice(0, 6)}...${current.addr.slice(-4)}`,
        riskScore: riskAnalysis.score,
        riskLevel: riskAnalysis.level,
        isExchange: exchangeName !== null,
        exchangeName,
        totalIn: addressStats.totalIn,
        totalOut: addressStats.totalOut,
        txCount: addressStats.txCount,
        interactsWithExchange: addressStats.interactsWithExchange,
      });
    }

    const exitPoints = Array.from(nodes.values())
      .filter((n) => n.isExchange || n.interactsWithExchange)
      .map((n) => n.id);

    const result: TraceResult = {
      nodes: Array.from(nodes.values()),
      edges: Array.from(edges.values()),
      totalVolume: Array.from(nodes.values()).reduce((sum, n) => sum + n.totalIn, 0),
      exitPoints,
      suspiciousAddresses: Array.from(nodes.values())
        .filter((n) => n.riskScore >= 50)
        .map((n) => n.id),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error tracing address:", error);
    return NextResponse.json({ error: "Failed to trace address" }, { status: 500 });
  }
}
