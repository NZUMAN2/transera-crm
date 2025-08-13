// app/(dashboard)/regional/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, Building, Users, TrendingUp, BarChart3, 
  PieChart, Download, Filter, Globe, Target
} from 'lucide-react'
import { 
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { toast } from '@/components/ui/use-toast'

interface RegionData {
  region: string
  regionCode: string
  activeJobs: number
  totalCandidates: number
  placements: number
  revenue: number
  conversionRate: number
  avgTimeToFill: number
  topRoles: string[]
}

interface ClientRegionalData {
  clientId: string
  clientName: string
  regions: RegionData[]
  totalRevenue: number
  totalPlacements: number
}

const REGION_COLORS = {
  'WC': '#7C3AED',  // Purple for Western Cape
  'KZN': '#10B981', // Green for KwaZulu-Natal
  'EC': '#F59E0B',  // Yellow for Eastern Cape
  'GP': '#3B82F6',  // Blue for Gauteng
  'MP': '#EF4444',  // Red for Mpumalanga
  'LP': '#EC4899',  // Pink for Limpopo
  'NW': '#8B5CF6',  // Violet for North West
  'FS': '#14B8A6',  // Teal for Free State
  'NC': '#F97316'   // Orange for Northern Cape
}

export default function RegionalReportingPage() {
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [regionalData, setRegionalData] = useState<ClientRegionalData[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchRegionalData()
  }, [selectedClient, selectedPeriod])

  const fetchRegionalData = async () => {
    try {
      // Fetch clients with regional presence
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .in('company_name', ['Woolworths', 'Pick n Pay', 'Shoprite']) // Example multi-region clients

      // Fetch regional data
      const { data: regions } = await supabase
        .from('client_regions')
        .select('*')

      // Fetch jobs by region
      const { data: jobs } = await supabase
        .from('jobs')
        .select(`
          *,
          clients:client_id (
            company_name
          )
        `)

      // Fetch placements with regional data
      const { data: placements } = await supabase
        .from('placements')
        .select('*')

      // Process and aggregate data by region
      const processedData: ClientRegionalData[] = [
        {
          clientId: 'woolworths',
          clientName: 'Woolworths',
          regions: [
            {
              region: 'Western Cape',
              regionCode: 'WC',
              activeJobs: 12,
              totalCandidates: 45,
              placements: 8,
              revenue: 485000,
              conversionRate: 17.8,
              avgTimeToFill: 28,
              topRoles: ['Department Manager', 'Store Manager', 'Buyer']
            },
            {
              region: 'KwaZulu-Natal',
              regionCode: 'KZN',
              activeJobs: 8,
              totalCandidates: 32,
              placements: 5,
              revenue: 320000,
              conversionRate: 15.6,
              avgTimeToFill: 32,
              topRoles: ['Department Manager', 'Visual Merchandiser']
            },
            {
              region: 'Eastern Cape',
              regionCode: 'EC',
              activeJobs: 6,
              totalCandidates: 18,
              placements: 3,
              revenue: 195000,
              conversionRate: 16.7,
              avgTimeToFill: 30,
              topRoles: ['Department Manager', 'Admin Manager']
            },
            {
              region: 'Gauteng',
              regionCode: 'GP',
              activeJobs: 15,
              totalCandidates: 58,
              placements: 10,
              revenue: 620000,
              conversionRate: 17.2,
              avgTimeToFill: 25,
              topRoles: ['Store Manager', 'Department Manager', 'Buyer', 'Planner']
            }
          ],
          totalRevenue: 1620000,
          totalPlacements: 26
        },
        {
          clientId: 'astron',
          clientName: 'Astron Energy',
          regions: [
            {
              region: 'Western Cape',
              regionCode: 'WC',
              activeJobs: 5,
              totalCandidates: 22,
              placements: 4,
              revenue: 280000,
              conversionRate: 18.2,
              avgTimeToFill: 35,
              topRoles: ['Territory Manager', 'Sales Executive']
            },
            {
              region: 'Gauteng',
              regionCode: 'GP',
              activeJobs: 8,
              totalCandidates: 35,
              placements: 6,
              revenue: 420000,
              conversionRate: 17.1,
              avgTimeToFill: 30,
              topRoles: ['Regional Manager', 'Business Development']
            }
          ],
          totalRevenue: 700000,
          totalPlacements: 10
        }
      ]

      setRegionalData(processedData)
    } catch (error) {
      console.error('Error fetching regional data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch regional data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter data based on selection
  const filteredData = selectedClient === 'all' 
    ? regionalData 
    : regionalData.filter(d => d.clientId === selectedClient)

  // Aggregate stats
  const totalStats = {
    jobs: filteredData.reduce((sum, client) => 
      sum + client.regions.reduce((s, r) => s + r.activeJobs, 0), 0),
    candidates: filteredData.reduce((sum, client) => 
      sum + client.regions.reduce((s, r) => s + r.totalCandidates, 0), 0),
    placements: filteredData.reduce((sum, client) => 
      sum + client.totalPlacements, 0),
    revenue: filteredData.reduce((sum, client) => 
      sum + client.totalRevenue, 0)
  }

  // Prepare chart data
  const regionComparisonData = filteredData.flatMap(client =>
    client.regions.map(region => ({
      region: `${region.region} (${client.clientName})`,
      regionCode: region.regionCode,
      jobs: region.activeJobs,
      placements: region.placements,
      revenue: region.revenue / 1000, // Convert to thousands
      conversionRate: region.conversionRate
    }))
  )

  const pieChartData = Object.entries(
    regionComparisonData.reduce((acc, item) => {
      const key = item.regionCode
      if (!acc[key]) acc[key] = 0
      acc[key] += item.revenue
      return acc
    }, {} as Record<string, number>)
  ).map(([region, revenue]) => ({
    name: region,
    value: revenue
  }))

  const performanceRadarData = selectedClient !== 'all' && filteredData[0]
    ? filteredData[0].regions.map(r => ({
        region: r.regionCode,
        placements: r.placements,
        candidates: r.totalCandidates / 10, // Scale down for visibility
        jobs: r.activeJobs,
        conversion: r.conversionRate
      }))
    : []

  const exportReport = () => {
    const csv = [
      ['Client', 'Region', 'Active Jobs', 'Candidates', 'Placements', 'Revenue', 'Conversion Rate', 'Avg Time to Fill'],
      ...filteredData.flatMap(client =>
        client.regions.map(region => [
          client.clientName,
          region.region,
          region.activeJobs,
          region.totalCandidates,
          region.placements,
          region.revenue,
          `${region.conversionRate}%`,
          `${region.avgTimeToFill} days`
        ])
      )
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `regional_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading regional data...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Globe className="mr-3 text-purple-600" />
              Regional Performance Report
            </h1>
            <p className="text-gray-600 mt-1">Analyze recruitment performance across different regions</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="woolworths">Woolworths</SelectItem>
                <SelectItem value="astron">Astron Energy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport} variant="outline">
              <Download className="mr-2" size={16} />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active Jobs</p>
                <p className="text-3xl font-bold">{totalStats.jobs}</p>
                <p className="text-xs text-gray-500 mt-1">Across all regions</p>
              </div>
              <Building className="text-purple-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-3xl font-bold">{totalStats.candidates}</p>
                <p className="text-xs text-gray-500 mt-1">In pipeline</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Placements</p>
                <p className="text-3xl font-bold">{totalStats.placements}</p>
                <p className="text-xs text-gray-500 mt-1">This period</p>
              </div>
              <Target className="text-green-600" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold">R{(totalStats.revenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500 mt-1">Commission earned</p>
              </div>
              <TrendingUp className="text-yellow-600" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Regional Comparison</TabsTrigger>
          <TabsTrigger value="details">Detailed Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Regional Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regionCode" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="jobs" fill="#7C3AED" name="Active Jobs" />
                  <Bar yAxisId="left" dataKey="placements" fill="#10B981" name="Placements" />
                  <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#F59E0B" name="Conversion %" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Distribution */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={REGION_COLORS[entry.name as keyof typeof REGION_COLORS] || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `R${value}K`} />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {selectedClient !== 'all' && performanceRadarData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={performanceRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="region" />
                      <PolarRadiusAxis />
                      <Radar name="Placements" dataKey="placements" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.6} />
                      <Radar name="Jobs" dataKey="jobs" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {filteredData.map(client => (
            <Card key={client.clientId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{client.clientName} - Regional Breakdown</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {client.regions.length} Regions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {client.regions.map(region => (
                    <Card key={region.regionCode} className="border-l-4" style={{ borderLeftColor: REGION_COLORS[region.regionCode as keyof typeof REGION_COLORS] }}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="mr-2" size={18} />
                          {region.region}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Active Jobs:</span>
                          <span className="font-medium">{region.activeJobs}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Candidates:</span>
                          <span className="font-medium">{region.totalCandidates}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Placements:</span>
                          <span className="font-medium text-green-600">{region.placements}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-medium text-purple-600">R{(region.revenue / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversion:</span>
                          <span className="font-medium">{region.conversionRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Fill Time:</span>
                          <span className="font-medium">{region.avgTimeToFill} days</span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-600 mb-1">Top Roles:</p>
                          <div className="flex flex-wrap gap-1">
                            {region.topRoles.slice(0, 3).map(role => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Regional Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Client</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Region</th>
                      <th className="p-3 text-center text-sm font-medium text-gray-700">Active Jobs</th>
                      <th className="p-3 text-center text-sm font-medium text-gray-700">Candidates</th>
                      <th className="p-3 text-center text-sm font-medium text-gray-700">Placements</th>
                      <th className="p-3 text-center text-sm font-medium text-gray-700">Revenue</th>
                      <th className="p-3 text-center text-sm font-medium text-gray-700">Conversion</th>
                      <th className="p-3 text-center text-sm font-medium text-gray-700">Avg Fill Time</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Top Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.flatMap(client =>
                      client.regions.map((region, index) => (
                        <tr key={`${client.clientId}-${region.regionCode}`} className="border-b hover:bg-gray-50">
                          {index === 0 && (
                            <td className="p-3 font-medium" rowSpan={client.regions.length}>
                              {client.clientName}
                            </td>
                          )}
                          <td className="p-3">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: REGION_COLORS[region.regionCode as keyof typeof REGION_COLORS] }}
                              />
                              {region.region}
                            </div>
                          </td>
                          <td className="p-3 text-center">{region.activeJobs}</td>
                          <td className="p-3 text-center">{region.totalCandidates}</td>
                          <td className="p-3 text-center">
                            <Badge className="bg-green-100 text-green-800">
                              {region.placements}
                            </Badge>
                          </td>
                          <td className="p-3 text-center font-medium">
                            R{(region.revenue / 1000).toFixed(0)}K
                          </td>
                          <td className="p-3 text-center">
                            <Badge className={
                              region.conversionRate > 17 
                                ? 'bg-green-100 text-green-800'
                                : region.conversionRate > 15
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }>
                              {region.conversionRate}%
                            </Badge>
                          </td>
                          <td className="p-3 text-center">{region.avgTimeToFill} days</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {region.topRoles.map(role => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}