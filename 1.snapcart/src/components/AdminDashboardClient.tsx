'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { IndianRupee, Package, Truck, Users, LayoutDashboard, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'

type propType = {
  earning: {
    today: number,
    sevenDays: number,
    total: number
  },
  stats: {
    title: string;
    value: number;
  }[],
  chartData: {
    day: string;
    orders: number;
  }[]
}

function AdminDashboardClient({ earning, stats, chartData }: propType) {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">("total")

  const currenEarning = filter === "today" ? earning.today
    : filter === "sevenDays" ? earning.sevenDays
      : earning.total

  const title = filter === "today" ? "Daily Revenue"
    : filter === "sevenDays" ? "Weekly Revenue"
      : "Lifetime Revenue"

  const iconColors = [
    "bg-blue-500/10 text-blue-500",
    "bg-green-500/10 text-green-500",
    "bg-amber-500/10 text-amber-500",
    "bg-emerald-500/10 text-emerald-500"
  ]

  const dashboardStats = (Array.isArray(stats) ? stats : []).map((s, i) => ({
    ...s,
    icon: [Package, Users, Truck, IndianRupee][i] || Package,
    color: iconColors[i] || iconColors[0],
    trend: i % 2 === 0 ? "+12.5%" : "+5.2%",
    isUp: true
  }))

  return (
    <div className='min-h-screen bg-zinc-50 pb-20 pt-[120px]'>
      <div className='w-[95%] md:w-[85%] mx-auto space-y-10'>

        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-[10px]">
              <LayoutDashboard size={14} />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Control Center</h1>
            <p className="text-zinc-500 text-sm font-medium">Monitoring millet ecosystem metrics and chain performance.</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-zinc-100">
            {(['today', 'sevenDays', 'total'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === f
                  ? "bg-zinc-900 text-white shadow-lg"
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {f === 'sevenDays' ? '7 Days' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Top Highlight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 bg-zinc-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[280px]"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
            <div>
              <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-widest text-[10px] mb-4">
                <IndianRupee size={16} />
                <span>Financial Overview</span>
              </div>
              <h2 className='text-zinc-400 text-sm font-medium mb-1'>{title}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter text-white">₹{currenEarning.toLocaleString()}</span>
                <span className="text-green-400 font-bold text-sm bg-green-400/10 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                  <ArrowUpRight size={14} /> 12%
                </span>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Active Scale</div>
                <div className="text-lg font-bold">100% Load</div>
              </div>
              <Activity className="text-green-400" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-2xl shadow-zinc-900/5 border border-zinc-100"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className='text-xl font-black text-zinc-900 tracking-tight'>Orders Velocity</h3>
                <p className="text-zinc-400 text-xs font-medium">Daily order frequency for the current week.</p>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
                <Calendar size={14} className="text-zinc-400" />
                <span className="text-[10px] font-black uppercase text-zinc-500">Weekly Stats</span>
              </div>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData || []}>
                  <Bar dataKey="orders">
                    {Array.isArray(chartData) && chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? "#16A34A" : "#E4E4E7"} />
                    ))}
                  </Bar>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#A1A1AA' }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Metric Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {dashboardStats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-zinc-100 shadow-xl shadow-zinc-900/5 rounded-[2.5rem] p-8 flex flex-col gap-6 relative group transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{s.title}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-zinc-900 tracking-tight">{s.value.toLocaleString()}</p>
                    <div className={`flex items-center gap-0.5 text-[10px] font-black ${s.isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {s.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {s.trend}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboardClient

