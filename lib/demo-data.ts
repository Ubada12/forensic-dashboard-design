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
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    label: 'Root Scammer',
    type: 'scammer',
    riskScore: 95,
    totalReceived: 45.8,
    totalSent: 45.2
  },
  {
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    label: 'Victim Wallet',
    type: 'victim',
    riskScore: 5,
    totalReceived: 50,
    totalSent: 45.8
  },
  {
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    label: 'Mule Layer 1-A',
    type: 'mule',
    riskScore: 52,
    totalReceived: 15.2,
    totalSent: 14.8
  },
  {
    address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    label: 'Mule Layer 1-B',
    type: 'mule',
    riskScore: 48,
    totalReceived: 15.0,
    totalSent: 14.6
  },
  {
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    label: 'Mule Layer 1-C',
    type: 'mule',
    riskScore: 45,
    totalReceived: 15.0,
    totalSent: 14.5
  },
  {
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    label: 'Mule Layer 2-A',
    type: 'mule',
    riskScore: 38,
    totalReceived: 7.5,
    totalSent: 7.2
  },
  {
    address: '0x53e0bca35ec356bd5dddfebb06019f53fb3e9f4d',
    label: 'Mule Layer 2-B',
    type: 'mule',
    riskScore: 35,
    totalReceived: 7.3,
    totalSent: 7.0
  },
  {
    address: '0x85955046df4668e1dd369d2de9f3aeb98dd2a369',
    label: 'Mule Layer 2-C',
    type: 'mule',
    riskScore: 42,
    totalReceived: 7.6,
    totalSent: 7.3
  },
  {
    address: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
    label: 'Tornado Cash Mixer',
    type: 'mixer',
    riskScore: 88,
    totalReceived: 7.5,
    totalSent: 7.4
  },
  {
    address: '0x28c6c06298d514db089934071355e5743bf21d60',
    label: 'Binance Hot Wallet',
    type: 'exchange',
    riskScore: 10,
    totalReceived: 14.5,
    totalSent: 500000
  },
  {
    address: '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43',
    label: 'Coinbase Hot Wallet',
    type: 'exchange',
    riskScore: 8,
    totalReceived: 7.0,
    totalSent: 350000
  }
];

export const DEMO_TRANSACTIONS: DemoTransaction[] = [
  { hash: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456', from: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', to: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', value: 45.8, timestamp: Date.now() - 86400000 * 7 },
  
  { hash: '0xdef456789012345678901234567890abcdef1234567890abcdef123456789abc', from: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', to: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', value: 15.2, timestamp: Date.now() - 86400000 * 6 },
  { hash: '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0', from: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', to: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', value: 15.0, timestamp: Date.now() - 86400000 * 6 },
  { hash: '0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123', from: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', to: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', value: 15.0, timestamp: Date.now() - 86400000 * 6 },
  
  { hash: '0x789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456', from: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', to: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', value: 7.5, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789', from: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', to: '0xd6df932a45c0f255f85145f286ea0b292b21c90b', value: 7.3, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789ab', from: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', to: '0x53e0bca35ec356bd5dddfebb06019f53fb3e9f4d', value: 7.3, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0xef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd', from: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', to: '0x85955046df4668e1dd369d2de9f3aeb98dd2a369', value: 7.3, timestamp: Date.now() - 86400000 * 5 },
  { hash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', from: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', to: '0x28c6c06298d514db089934071355e5743bf21d60', value: 14.5, timestamp: Date.now() - 86400000 * 4 },
  
  { hash: '0x23456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01', from: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', to: '0x28c6c06298d514db089934071355e5743bf21d60', value: 7.0, timestamp: Date.now() - 86400000 * 3 },
  { hash: '0x3456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012', from: '0x53e0bca35ec356bd5dddfebb06019f53fb3e9f4d', to: '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43', value: 7.0, timestamp: Date.now() - 86400000 * 3 },
  { hash: '0x56789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234', from: '0x85955046df4668e1dd369d2de9f3aeb98dd2a369', to: '0x28c6c06298d514db089934071355e5743bf21d60', value: 7.0, timestamp: Date.now() - 86400000 * 2 },
  { hash: '0x6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345', from: '0xd6df932a45c0f255f85145f286ea0b292b21c90b', to: '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43', value: 7.2, timestamp: Date.now() - 86400000 * 1 },
];

export const DEMO_SEED_ADDRESS = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';

export function getDemoGraphData(seedAddress: string, depth: number = 2) {
  const nodes: Map<string, any> = new Map();
  const links: any[] = [];
  const visited = new Set<string>();
  
  function addWalletNode(address: string) {
    if (nodes.has(address)) return;
    
    const wallet = DEMO_WALLETS.find(w => w.address.toLowerCase() === address.toLowerCase());
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

    const normalizedAddress = address.toLowerCase();
    const outgoing = DEMO_TRANSACTIONS.filter(tx => tx.from.toLowerCase() === normalizedAddress);
    const incoming = DEMO_TRANSACTIONS.filter(tx => tx.to.toLowerCase() === normalizedAddress);

    if (direction === 'both' || direction === 'out') {
      outgoing.forEach(tx => {
        addWalletNode(tx.to);
        const linkId = `${tx.from.toLowerCase()}-${tx.to.toLowerCase()}`;
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
        const linkId = `${tx.from.toLowerCase()}-${tx.to.toLowerCase()}`;
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
  scammer: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  victim: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  mule: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  exchange: '0x28c6c06298d514db089934071355e5743bf21d60'
};
