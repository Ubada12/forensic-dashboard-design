export interface DemoWallet {
  address: string;
  label: string;
  type: 'scammer' | 'mule' | 'exchange' | 'victim' | 'mixer';
  riskScore: number;
  totalReceived: number;
  totalSent: number;
}

export interface DemoTransaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: number;
}

export const DEMO_WALLETS: DemoWallet[] = [
  {
    address: '0xSCAMMER001',
    label: 'Root Scammer',
    type: 'scammer',
    riskScore: 95,
    totalReceived: 0,
    totalSent: 15.5
  },
  {
    address: '0xMULE001',
    label: 'Mule Layer 1',
    type: 'mule',
    riskScore: 45,
    totalReceived: 5.2,
    totalSent: 5.0
  },
  {
    address: '0xMULE002',
    label: 'Mule Layer 1',
    type: 'mule',
    riskScore: 42,
    totalReceived: 5.3,
    totalSent: 5.1
  },
  {
    address: '0xMULE003',
    label: 'Mule Layer 1',
    type: 'mule',
    riskScore: 48,
    totalReceived: 5.0,
    totalSent: 4.8
  },
  {
    address: '0xMULE004',
    label: 'Mule Layer 2',
    type: 'mule',
    riskScore: 35,
    totalReceived: 3.2,
    totalSent: 3.0
  },
  {
    address: '0xMULE005',
    label: 'Mule Layer 2',
    type: 'mule',
    riskScore: 38,
    totalReceived: 4.1,
    totalSent: 3.9
  },
  {
    address: '0xMULE006',
    label: 'Mule Layer 2',
    type: 'mule',
    riskScore: 32,
    totalReceived: 2.8,
    totalSent: 2.6
  },
  {
    address: '0xMIXER001',
    label: 'Tornado Cash Mixer',
    type: 'mixer',
    riskScore: 85,
    totalReceived: 3.5,
    totalSent: 3.4
  },
  {
    address: '0xBINANCE001',
    label: 'Binance Hot Wallet',
    type: 'exchange',
    riskScore: 10,
    totalReceived: 5.2,
    totalSent: 100000
  },
  {
    address: '0xCOINBASE001',
    label: 'Coinbase Hot Wallet',
    type: 'exchange',
    riskScore: 8,
    totalReceived: 2.1,
    totalSent: 85000
  },
  {
    address: '0xVICTIM001',
    label: 'Victim Wallet',
    type: 'victim',
    riskScore: 5,
    totalReceived: 10,
    totalSent: 5.5
  }
];

export const DEMO_TRANSACTIONS: DemoTransaction[] = [
  { hash: '0xTX001', from: '0xVICTIM001', to: '0xSCAMMER001', value: 5.5, timestamp: Date.now() - 86400000 * 7 },
  { hash: '0xTX002', from: '0xSCAMMER001', to: '0xMULE001', value: 5.2, timestamp: Date.now() - 86400000 * 6 },
  { hash: '0xTX003', from: '0xSCAMMER001', to: '0xMULE002', value: 5.3, timestamp: Date.now() - 86400000 * 6 },
  { hash: '0xTX004', from: '0xSCAMMER001', to: '0xMULE003', value: 5.0, timestamp: Date.now() - 86400000 * 6 },
  { hash: '0xTX005', from: '0xMULE001', to: '0xMULE004', value: 2.5, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xTX006', from: '0xMULE001', to: '0xMIXER001', value: 2.5, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xTX007', from: '0xMULE002', to: '0xMULE005', value: 2.6, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xTX008', from: '0xMULE002', to: '0xMULE006', value: 2.5, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xTX009', from: '0xMULE003', to: '0xBINANCE001', value: 4.8, timestamp: Date.now() - 86400000 * 4 },
  { hash: '0xTX010', from: '0xMULE004', to: '0xBINANCE001', value: 2.3, timestamp: Date.now() - 86400000 * 3 },
  { hash: '0xTX011', from: '0xMULE005', to: '0xCOINBASE001', value: 2.1, timestamp: Date.now() - 86400000 * 3 },
  { hash: '0xTX012', from: '0xMULE006', to: '0xBINANCE001', value: 2.4, timestamp: Date.now() - 86400000 * 2 },
  { hash: '0xTX013', from: '0xMIXER001', to: '0xCOINBASE001', value: 3.2, timestamp: Date.now() - 86400000 * 1 },
];

export const DEMO_SEED_ADDRESS = '0xSCAMMER001';

export function getDemoGraphData(seedAddress: string, depth: number = 2) {
  const nodes: Map<string, any> = new Map();
  const links: any[] = [];
  const visited = new Set<string>();
  
  function addWalletNode(address: string) {
    if (nodes.has(address)) return;
    
    const wallet = DEMO_WALLETS.find(w => w.address === address);
    if (wallet) {
      nodes.set(address, {
        id: address,
        riskScore: wallet.riskScore,
        isExchange: wallet.type === 'exchange',
        exchangeName: wallet.type === 'exchange' ? wallet.label : undefined,
        isSuspicious: wallet.riskScore >= 70,
        label: wallet.label,
        type: wallet.type,
        totalReceived: wallet.totalReceived,
        totalSent: wallet.totalSent
      });
    } else {
      nodes.set(address, {
        id: address,
        riskScore: 20,
        isExchange: false,
        isSuspicious: false,
        label: 'Unknown Wallet',
        type: 'unknown',
        totalReceived: 0,
        totalSent: 0
      });
    }
  }

  function trace(address: string, currentDepth: number, direction: 'both' | 'in' | 'out' = 'both') {
    if (currentDepth > depth || visited.has(`${address}-${currentDepth}`)) return;
    visited.add(`${address}-${currentDepth}`);
    
    addWalletNode(address);

    const outgoing = DEMO_TRANSACTIONS.filter(tx => tx.from === address);
    const incoming = DEMO_TRANSACTIONS.filter(tx => tx.to === address);

    if (direction === 'both' || direction === 'out') {
      outgoing.forEach(tx => {
        addWalletNode(tx.to);
        const linkId = `${tx.from}-${tx.to}`;
        if (!links.find(l => l.id === linkId)) {
          links.push({
            id: linkId,
            source: tx.from,
            target: tx.to,
            value: tx.value,
            hash: tx.hash
          });
        }
        trace(tx.to, currentDepth + 1, 'out');
      });
    }

    if (direction === 'both' || direction === 'in') {
      incoming.forEach(tx => {
        addWalletNode(tx.from);
        const linkId = `${tx.from}-${tx.to}`;
        if (!links.find(l => l.id === linkId)) {
          links.push({
            id: linkId,
            source: tx.from,
            target: tx.to,
            value: tx.value,
            hash: tx.hash
          });
        }
        trace(tx.from, currentDepth + 1, 'in');
      });
    }
  }

  trace(seedAddress, 0);

  const nodesArray = Array.from(nodes.values());
  const exitPoints = nodesArray.filter(n => n.isExchange).map(n => n.id);
  const suspiciousAddresses = nodesArray.filter(n => n.isSuspicious).map(n => n.id);
  const totalVolume = links.reduce((sum, link) => sum + link.value, 0);

  return {
    nodes: nodesArray,
    links,
    exitPoints,
    suspiciousAddresses,
    totalVolume,
    seedAddress
  };
}

export const DEMO_ADDRESSES = {
  scammer: '0xSCAMMER001',
  victim: '0xVICTIM001',
  mule: '0xMULE001',
  exchange: '0xBINANCE001'
};
