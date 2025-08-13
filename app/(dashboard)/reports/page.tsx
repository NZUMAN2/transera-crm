'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Building, TrendingUp } from 'lucide-react'

export default function RegionalReportsPage() {
  const [regions] = useState([
    { name: 'Western Cape', clients: 12, placements: 45, revenue: 850000 },
    { name: 'Gauteng', clients: 25, placements: 78, revenue: 1500000 },
    { name: 'KwaZulu-Natal', clients: 8, placements: 23, revenue: 450000 },
    { name: 'Eastern Cape', clients: 5, placements: 12, revenue: 250000 }
  ])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Regional Reports</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {regions.map((region) => (
          <Card key={region.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {region.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Clients</span>
                  <span className="font-semibold">{region.clients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Placements</span>
                  <span className="font-semibold">{region.placements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-semibold">
                    R{(region.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Multi-Region Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5" />
                <span className="font-medium">Woolworths</span>
              </div>
              <span className="text-sm text-muted-foreground">WC, KZN, EC</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}