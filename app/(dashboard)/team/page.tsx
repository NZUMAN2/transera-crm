// app/(dashboard)/team/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { 
  Users, Mail, Phone, UserPlus, Edit, 
  Shield, Award, Target, TrendingUp,
  CheckCircle, XCircle, Clock
} from 'lucide-react'

interface TeamMember {
  id: string
  full_name: string
  email: string
  role: string
  department: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface UserPerformance {
  userId: string
  totalPlacements: number
  totalRevenue: number
  activeCandidates: number
  activeJobs: number
  monthlyTarget: number
  monthlyProgress: number
}

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [performance, setPerformance] = useState<UserPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  
  const [newMember, setNewMember] = useState({
    full_name: '',
    email: '',
    role: 'consultant',
    department: 'recruitment',
    phone: ''
  })

  const supabase = createClient()

  // Predefined team members from the email
  const defaultTeamMembers = [
    { full_name: 'Athi Mbete', email: 'athi@transerasolutions.co.za', role: 'consultant', department: 'recruitment' },
    { full_name: 'Lillian Kavamgugu', email: 'lillian@transerasolutions.co.za', role: 'admin', department: 'operations' },
    { full_name: 'Steven Phiri', email: 'steven@transerasolutions.co.za', role: 'consultant', department: 'recruitment' },
    { full_name: 'Steven Ngwira', email: 'steven.n@transerasolutions.co.za', role: 'consultant', department: 'recruitment' },
    { full_name: 'Blessing Kemlo', email: 'blessing@transerasolutions.co.za', role: 'consultant', department: 'recruitment' },
    { full_name: 'Thembeka Dube', email: 'thembeka@transerasolutions.co.za', role: 'manager', department: 'management' }
  ]

  useEffect(() => {
    fetchTeamData()
    initializeDefaultTeam()
  }, [])

  const initializeDefaultTeam = async () => {
    try {
      // Check if team members already exist
      const { data: existingMembers } = await supabase
        .from('user_profiles')
        .select('email')

      const existingEmails = existingMembers?.map(m => m.email) || []

      // Add missing default team members
      const newMembers = defaultTeamMembers.filter(
        member => !existingEmails.includes(member.email)
      )

      if (newMembers.length > 0) {
        const { error } = await supabase
          .from('user_profiles')
          .insert(newMembers)

        if (error) throw error

        toast({
          title: "Success",
          description: `Added ${newMembers.length} team members`
        })

        fetchTeamData()
      }
    } catch (error) {
      console.error('Error initializing team:', error)
    }
  }

  const fetchTeamData = async () => {
    try {
      // Fetch team members
      const { data: membersData, error: membersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('full_name')

      if (membersError) throw membersError
      setTeamMembers(membersData || [])

      // Fetch performance data (mock for now)
      const performanceData: UserPerformance[] = membersData?.map(member => ({
        userId: member.id,
        totalPlacements: Math.floor(Math.random() * 20) + 5,
        totalRevenue: Math.floor(Math.random() * 500000) + 100000,
        activeCandidates: Math.floor(Math.random() * 50) + 10,
        activeJobs: Math.floor(Math.random() * 15) + 5,
        monthlyTarget: member.role === 'consultant' ? 150000 : 0,
        monthlyProgress: Math.floor(Math.random() * 80) + 20
      })) || []

      setPerformance(performanceData)

    } catch (error) {
      console.error('Error fetching team data:', error)
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addTeamMember = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert(newMember)

      if (error) throw error

      toast({
        title: "Success",
        description: "Team member added successfully"
      })

      setNewMember({
        full_name: '',
        email: '',
        role: 'consultant',
        department: 'recruitment',
        phone: ''
      })
      setShowAddForm(false)
      fetchTeamData()
    } catch (error) {
      console.error('Error adding team member:', error)
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      })
    }
  }

  const updateTeamMember = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: member.full_name,
          email: member.email,
          role: member.role,
          department: member.department,
          phone: member.phone,
          is_active: member.is_active
        })
        .eq('id', member.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Team member updated successfully"
      })

      setEditingMember(null)
      fetchTeamData()
    } catch (error) {
      console.error('Error updating team member:', error)
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive"
      })
    }
  }

  const toggleMemberStatus = async (memberId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !isActive })
        .eq('id', memberId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Team member ${!isActive ? 'activated' : 'deactivated'}`
      })

      fetchTeamData()
    } catch (error) {
      console.error('Error updating member status:', error)
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive"
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-500'
      case 'admin': return 'bg-blue-500'
      case 'consultant': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPerformanceForUser = (userId: string) => {
    return performance.find(p => p.userId === userId)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading team data...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Manage TransEra Solutions team members and performance</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Team Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Consultants</p>
                <p className="text-2xl font-bold">
                  {teamMembers.filter(m => m.role === 'consultant' && m.is_active).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Target</p>
                <p className="text-2xl font-bold">R350K</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold">
                  {Math.round(performance.reduce((acc, p) => acc + p.monthlyProgress, 0) / performance.length || 0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        {/* Team Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => {
              const memberPerformance = getPerformanceForUser(member.id)
              return (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{member.full_name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      {member.is_active ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Role</span>
                        <Badge className={`${getRoleColor(member.role)} text-white`}>
                          {member.role}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Department</span>
                        <span className="text-sm">{member.department}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Phone</span>
                          <span className="text-sm">{member.phone}</span>
                        </div>
                      )}
                    </div>

                    {memberPerformance && member.role === 'consultant' && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Placements</span>
                            <p className="font-medium">{memberPerformance.totalPlacements}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Revenue</span>
                            <p className="font-medium">R{(memberPerformance.totalRevenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant={member.is_active ? "destructive" : "default"}
                        onClick={() => toggleMemberStatus(member.id, member.is_active)}
                      >
                        {member.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Team Performance Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers
                  .filter(member => member.role === 'consultant' && member.is_active)
                  .map((member) => {
                    const memberPerformance = getPerformanceForUser(member.id)
                    if (!memberPerformance) return null

                    return (
                      <div key={member.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium">{member.full_name}</h3>
                            <p className="text-sm text-gray-600">Recruitment Consultant</p>
                          </div>
                          <Badge variant={memberPerformance.monthlyProgress >= 80 ? 'default' : 'secondary'}>
                            {memberPerformance.monthlyProgress}% of target
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Monthly Target</p>
                            <p className="text-lg font-semibold">R{(memberPerformance.monthlyTarget / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Revenue YTD</p>
                            <p className="text-lg font-semibold">R{(memberPerformance.totalRevenue / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Placements</p>
                            <p className="text-lg font-semibold">{memberPerformance.totalPlacements}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Active Pipeline</p>
                            <p className="text-lg font-semibold">{memberPerformance.activeCandidates}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              memberPerformance.monthlyProgress >= 80 ? 'bg-green-600' : 
                              memberPerformance.monthlyProgress >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(memberPerformance.monthlyProgress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management">
          <div className="space-y-6">
            {/* Add New Member Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={newMember.full_name}
                        onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="consultant">Consultant</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <select
                        id="department"
                        value={newMember.department}
                        onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="recruitment">Recruitment</option>
                        <option value="operations">Operations</option>
                        <option value="management">Management</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addTeamMember}>Add Member</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Member Form */}
            {editingMember && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="edit_full_name">Full Name</Label>
                      <Input
                        id="edit_full_name"
                        value={editingMember.full_name}
                        onChange={(e) => setEditingMember({...editingMember, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_email">Email</Label>
                      <Input
                        id="edit_email"
                        type="email"
                        value={editingMember.email}
                        onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_role">Role</Label>
                      <select
                        id="edit_role"
                        value={editingMember.role}
                        onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="consultant">Consultant</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="edit_department">Department</Label>
                      <select
                        id="edit_department"
                        value={editingMember.department}
                        onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="recruitment">Recruitment</option>
                        <option value="operations">Operations</option>
                        <option value="management">Management</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="edit_phone">Phone</Label>
                    <Input
                      id="edit_phone"
                      value={editingMember.phone || ''}
                      onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="edit_is_active"
                      checked={editingMember.is_active}
                      onChange={(e) => setEditingMember({...editingMember, is_active: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="edit_is_active">Active Member</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => updateTeamMember(editingMember)}>Update Member</Button>
                    <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team List */}
            <Card>
              <CardHeader>
                <CardTitle>All Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{member.full_name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getRoleColor(member.role)} text-white`}>
                          {member.role}
                        </Badge>
                        {member.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}