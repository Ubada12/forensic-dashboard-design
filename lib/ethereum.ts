const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

export interface EthTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  timeStamp: string;
  gasUsed: string;
  gasPrice: string;
  isError: string;
}

export interface EthBalance {
  address: string;
  balance: string;
}

export async function getTransactions(address: string, startBlock = 0, endBlock = 99999999): Promise<EthTransaction[]> {
  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "1" && Array.isArray(data.result)) {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function getInternalTransactions(address: string): Promise<EthTransaction[]> {
  const url = `${ETHERSCAN_BASE_URL}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "1" && Array.isArray(data.result)) {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error("Error fetching internal transactions:", error);
    return [];
  }
}

export async function getBalance(address: string): Promise<string> {
  const url = `${ETHERSCAN_BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "1") {
      return data.result;
    }
    return "0";
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
}

export function weiToEth(wei: string): number {
  return parseFloat(wei) / 1e18;
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

const KNOWN_EXCHANGES: Record<string, string> = {
  "0x28c6c06298d514db089934071355e5743bf21d60": "Binance Hot Wallet",
  "0x21a31ee1afc51d94c2efccaa2092ad1028285549": "Binance",
  "0xdfd5293d8e347dfe59e90efd55b2956a1343963d": "Binance",
  "0x56eddb7aa87536c09ccc2793473599fd21a8b17f": "Binance",
  "0x9696f59e4d72e237be84ffd425dcad154bf96976": "Binance",
  "0x4976a4a02f38326660d17bf34b431dc6e2eb2327": "Binance",
  "0xd551234ae421e3bcba99a0da6d736074f22192ff": "Binance",
  "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be": "Binance",
  "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8": "Binance Cold Wallet",
  "0x2b5634c42055806a59e9107ed44d43c426e58258": "KuCoin",
  "0xd6216fc19db775df9774a6e33526131da7d19a2c": "KuCoin",
  "0xeb2629a2734e272bcc07bda959863f316f4bd4cf": "Coinbase",
  "0x71660c4005ba85c37ccec55d0c4493e66fe775d3": "Coinbase",
  "0xa090e606e30bd747d4e6245a1517ebe430f0057e": "Coinbase",
  "0x503828976d22510aad0201ac7ec88293211d23da": "Coinbase",
  "0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740": "Coinbase",
  "0x3cd751e6b0078be393132286c442345e5dc49699": "Coinbase",
  "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511": "Coinbase",
};

export function identifyExchange(address: string): string | null {
  const lowerAddress = address.toLowerCase();
  return KNOWN_EXCHANGES[lowerAddress] || null;
}

export function isExchangeAddress(address: string): boolean {
  return identifyExchange(address) !== null;
}
