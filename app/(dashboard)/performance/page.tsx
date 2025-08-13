'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Users, DollarSign } from 'lucide-react'

export default function PerformancePage() {
  const [metrics, setMetrics] = useState({
    totalPlacements: 0,
    monthlyTarget: 350000,
    currentRevenue: 0,
    teamMembers: 6
  })

  useEffect(() => {
    fetchMetrics()
  }, [])

  async function fetchMetrics() {
    const supabase = createClient()
    
    // Fetch actual data from your database
    const { count: placementCount } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'placed')

    setMetrics(prev => ({
      ...prev,
      totalPlacements: placementCount || 0
    }))
  }

  const targetPercentage = (metrics.currentRevenue / metrics.monthlyTarget) * 100

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPlacements}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R350K</div>
            <p className="text-xs text-muted-foreground">Company target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{(metrics.currentRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">{targetPercentage.toFixed(0)}% of target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.teamMembers}</div>
            <p className="text-xs text-muted-foreground">Active consultants</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Consultant Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Athi Mbete', 'Steven Phiri', 'Steven Ngwira', 'Blessing Kemlo'].map((name) => (
                <div key={name} className="flex items-center justify-between">
                  <span>{name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Target: R150K</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}