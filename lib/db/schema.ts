import { pgTable, serial, text, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("open"),
  seedAddress: text("seed_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  label: text("label"),
  riskScore: integer("risk_score").default(0),
  isFlagged: boolean("is_flagged").default(false),
  isExitPoint: boolean("is_exit_point").default(false),
  walletType: text("wallet_type"),
  totalIncoming: decimal("total_incoming", { precision: 30, scale: 18 }).default("0"),
  totalOutgoing: decimal("total_outgoing", { precision: 30, scale: 18 }).default("0"),
  transactionCount: integer("transaction_count").default(0),
  firstSeen: timestamp("first_seen"),
  lastSeen: timestamp("last_seen"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  value: decimal("value", { precision: 30, scale: 18 }).notNull(),
  blockNumber: integer("block_number"),
  timestamp: timestamp("timestamp"),
  gasUsed: decimal("gas_used", { precision: 30, scale: 0 }),
  gasPrice: decimal("gas_price", { precision: 30, scale: 0 }),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const caseWallets = pgTable("case_wallets", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => cases.id),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  role: text("role"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evidenceLogs = pgTable("evidence_logs", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull().references(() => cases.id),
  action: text("action").notNull(),
  description: text("description"),
  evidenceHash: text("evidence_hash"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
