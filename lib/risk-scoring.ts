import { isExchangeAddress } from "./ethereum";

export interface RiskFactors {
  rapidTransfers: number;
  mixerPatterns: number;
  highVolume: number;
  manyConnections: number;
  knownBadActors: number;
  exitPointProximity: number;
  circularFlows: number;
  unusualTimings: number;
}

export interface RiskAnalysis {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  factors: RiskFactors;
  description: string;
}

const KNOWN_MIXERS = [
  "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
  "0x722122df12d4e14e13ac3b6895a86e84145b6967",
  "0x23773e65ed146a459791799d01336db287f25334",
];

export function calculateRiskScore(
  address: string,
  transactionCount: number,
  uniqueConnections: number,
  avgTimeBetweenTx: number,
  totalVolume: number,
  hasExitPointConnection: boolean,
  hasCircularFlow: boolean
): RiskAnalysis {
  const factors: RiskFactors = {
    rapidTransfers: 0,
    mixerPatterns: 0,
    highVolume: 0,
    manyConnections: 0,
    knownBadActors: 0,
    exitPointProximity: 0,
    circularFlows: 0,
    unusualTimings: 0,
  };

  if (avgTimeBetweenTx < 300 && transactionCount > 5) {
    factors.rapidTransfers = Math.min(25, Math.floor((300 - avgTimeBetweenTx) / 12));
  }

  if (KNOWN_MIXERS.includes(address.toLowerCase())) {
    factors.mixerPatterns = 30;
  }

  if (totalVolume > 100) {
    factors.highVolume = Math.min(20, Math.floor(totalVolume / 50));
  }

  if (uniqueConnections > 20) {
    factors.manyConnections = Math.min(15, Math.floor((uniqueConnections - 20) / 5));
  }

  if (hasExitPointConnection) {
    factors.exitPointProximity = 15;
  }

  if (hasCircularFlow) {
    factors.circularFlows = 20;
  }

  const totalScore = Object.values(factors).reduce((sum, val) => sum + val, 0);
  const score = Math.min(100, totalScore);

  let level: "low" | "medium" | "high" | "critical";
  let description: string;

  if (score < 25) {
    level = "low";
    description = "Low risk - Normal transaction patterns observed";
  } else if (score < 50) {
    level = "medium";
    description = "Medium risk - Some suspicious patterns detected";
  } else if (score < 75) {
    level = "high";
    description = "High risk - Multiple concerning indicators present";
  } else {
    level = "critical";
    description = "Critical risk - Strong indicators of illicit activity";
  }

  return { score, level, factors, description };
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "low": return "#22c55e";
    case "medium": return "#f59e0b";
    case "high": return "#ef4444";
    case "critical": return "#dc2626";
    default: return "#6b7280";
  }
}

export function getRiskBadgeClass(level: string): string {
  switch (level) {
    case "low": return "bg-green-100 text-green-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "high": return "bg-red-100 text-red-800";
    case "critical": return "bg-red-200 text-red-900";
    default: return "bg-gray-100 text-gray-800";
  }
}
