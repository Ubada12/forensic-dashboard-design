import { NextRequest, NextResponse } from "next/server";
import { getTransactions, getBalance, isValidEthAddress, identifyExchange, weiToEth } from "@/lib/ethereum";
import { calculateRiskScore } from "@/lib/risk-scoring";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address.toLowerCase();

    if (!isValidEthAddress(address)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 });
    }

    const [transactions, balanceWei] = await Promise.all([
      getTransactions(address),
      getBalance(address),
    ]);

    const balance = weiToEth(balanceWei);
    const exchangeName = identifyExchange(address);

    let totalIn = 0;
    let totalOut = 0;
    const connections = new Set<string>();
    const timestamps: number[] = [];

    for (const tx of transactions) {
      const value = weiToEth(tx.value);
      if (tx.from.toLowerCase() === address) {
        totalOut += value;
        if (tx.to) connections.add(tx.to.toLowerCase());
      } else {
        totalIn += value;
        connections.add(tx.from.toLowerCase());
      }
      timestamps.push(parseInt(tx.timeStamp) * 1000);
    }

    let avgTimeBetweenTx = 0;
    if (timestamps.length > 1) {
      timestamps.sort((a, b) => a - b);
      let totalDiff = 0;
      for (let i = 1; i < timestamps.length; i++) {
        totalDiff += (timestamps[i] - timestamps[i - 1]) / 1000;
      }
      avgTimeBetweenTx = totalDiff / (timestamps.length - 1);
    }

    const riskAnalysis = calculateRiskScore(
      address,
      transactions.length,
      connections.size,
      avgTimeBetweenTx,
      totalIn + totalOut,
      exchangeName !== null,
      false
    );

    const recentTransactions = transactions.slice(-20).reverse().map((tx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: weiToEth(tx.value),
      timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
      blockNumber: parseInt(tx.blockNumber),
    }));

    return NextResponse.json({
      address,
      balance,
      totalIn,
      totalOut,
      transactionCount: transactions.length,
      uniqueConnections: connections.size,
      isExchange: exchangeName !== null,
      exchangeName,
      riskScore: riskAnalysis.score,
      riskLevel: riskAnalysis.level,
      riskDescription: riskAnalysis.description,
      riskFactors: riskAnalysis.factors,
      firstSeen: timestamps.length > 0 ? new Date(Math.min(...timestamps)).toISOString() : null,
      lastSeen: timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null,
      recentTransactions,
    });
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    return NextResponse.json({ error: "Failed to analyze wallet" }, { status: 500 });
  }
}
