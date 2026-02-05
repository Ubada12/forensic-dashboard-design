"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Network,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileBarChart,
  Hexagon,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Cases", href: "/cases", icon: FileText },
  { name: "Graph Analysis", href: "/graph", icon: Network },
  { name: "Risk Analysis", href: "/risk", icon: TrendingUp },
  { name: "Reports", href: "/reports", icon: FileBarChart },
]

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-cyan-400 to-emerald-400 rounded-xl blur-lg opacity-60 animate-pulse" />
        <div className="relative w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-primary/30 flex items-center justify-center overflow-hidden">
          <Hexagon className="w-5 h-5 text-primary absolute" strokeWidth={1.5} />
          <Shield className="w-4 h-4 text-cyan-300" strokeWidth={2} />
        </div>
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-base font-bold bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Crypto
          </span>
          <span className="text-sm font-semibold text-slate-300 -mt-1">
            TraceChain
          </span>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <Logo collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-cyan-500/10 text-primary border border-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  collapsed && "justify-center px-2",
                )}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  isActive && "text-primary"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                </div>
                {!collapsed && (
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.name}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <div className={cn(
          "flex items-center gap-2 text-xs text-slate-500",
          collapsed && "justify-center"
        )}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {!collapsed && <span>Law Enforcement v1.0</span>}
        </div>
      </div>
    </div>
  )
}
