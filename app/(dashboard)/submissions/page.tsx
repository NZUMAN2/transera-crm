'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Send, Clock } from 'lucide-react'

export default function CVSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    fetchSubmissions()
  }, [])

  async function fetchSubmissions() {
    const supabase = createClient()
    const { data } = await supabase
      .from('candidates')
      .select(`
        *,
        jobs (title, company_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    setSubmissions(data || [])
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">CV Submissions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <div>
                      <p className="font-medium">
                        {submission.first_name} {submission.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {submission.job_title} • {submission.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {submission.status || 'pending'}
                    </span>
                    <Button size="sm" variant="outline">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No CV submissions yet. Start by adding candidates.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}