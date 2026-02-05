# Crypto-TraceChain

Forensic blockchain investigation platform for law enforcement - tracks P2P crypto scams, identifies root scammers, and protects innocent mules.

## Overview

Crypto-TraceChain is designed to solve the problem of P2P crypto scams where black money flows through multiple wallets to innocent "mules" who unknowingly receive tainted crypto. The system traces the complete money trail backwards and forwards to identify the actual criminal, not just the innocent intermediaries.

## Core Features

- **Transaction Graph Analysis**: D3.js-powered visualization of money flow between wallets
- **Risk Scoring**: ML-ready suspicion scores (0-100) for each wallet based on transaction patterns
- **Exit Point Detection**: Identifies when funds touch KYC-enabled exchanges (Binance, Coinbase, etc.)
- **Case Management**: Create and manage forensic investigation cases
- **Cross-Case Correlation**: Link multiple cases to expose common patterns
- **Subpoena-Ready Reports**: Generate PDF/CSV evidence packages for law enforcement

## Tech Stack

- **Frontend**: Next.js 14 with React 19, Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Blockchain Data**: Etherscan API for Ethereum transaction data
- **Visualization**: D3.js for interactive transaction graphs

## Project Structure

```
app/
  api/
    cases/           # Case management CRUD
    trace/           # Transaction graph traversal
    wallet/          # Individual wallet analysis
  cases/             # Cases management page
  graph/             # Transaction graph visualization
  risk/              # Risk analysis dashboard
  reports/           # Evidence report generation
lib/
  db/
    schema.ts        # Database schema (cases, wallets, transactions)
    index.ts         # Database connection
  ethereum.ts        # Etherscan API integration
  risk-scoring.ts    # Risk calculation algorithms
components/
  sidebar.tsx        # Navigation sidebar
  ui/                # Shadcn UI components
```

## Environment Variables Required

- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)
- `ETHERSCAN_API_KEY`: For fetching real Ethereum transaction data

## Getting Started

1. Add your `ETHERSCAN_API_KEY` to secrets for real blockchain data
2. The database is automatically configured via Replit
3. Run `npm run dev` to start the development server

## Key Workflows

1. **Create a Case**: Go to Cases page, enter a seed wallet address to investigate
2. **Trace Transactions**: The graph page visualizes money flow with risk scores
3. **Identify Exit Points**: Blue nodes indicate exchanges where funds can be traced to KYC
4. **Generate Reports**: Export evidence for law enforcement use

## Team

DeFi Dynamo - Smart India Hackathon 2025
