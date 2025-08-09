'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function RevenueChart({ data }: { data: any[] }) {
  const chartData = [
    { month: 'Jan', revenue: 45000, placements: 3 },
    { month: 'Feb', revenue: 52000, placements: 4 },
    { month: 'Mar', revenue: 61000, placements: 5 },
    { month: 'Apr', revenue: 58000, placements: 4 },
    { month: 'May', revenue: 73000, placements: 6 },
    { month: 'Jun', revenue: 69000, placements: 5 }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="placements" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function PipelineChart({ data }: { data: any[] }) {
  const chartData = [
    { name: 'Client & Sourcing', value: 15, color: '#3b82f6' },
    { name: 'Screening', value: 28, color: '#f97316' },
    { name: 'Interview', value: 18, color: '#8b5cf6' },
    { name: 'Offer', value: 8, color: '#10b981' },
    { name: 'Placed', value: 12, color: '#059669' }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}