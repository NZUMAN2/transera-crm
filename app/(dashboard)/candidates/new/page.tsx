// app/(dashboard)/candidates/new/page.tsx

import { createCandidate } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NewCandidatePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Candidate</h1>
        <p className="text-gray-600 mt-1">Create a new candidate profile</p>
      </div>

      <form action={createCandidate} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input 
                  id="first_name"
                  name="first_name"
                  required
                  placeholder="John"
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input 
                  id="last_name"
                  name="last_name"
                  required
                  placeholder="Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john.doe@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  name="phone"
                  placeholder="+27 71 234 5678"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  placeholder="Cape Town, South Africa"
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input 
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_position">Current Position</Label>
                <Input 
                  id="current_position"
                  name="current_position"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <Label htmlFor="current_company">Current Company</Label>
                <Input 
                  id="current_company"
                  name="current_company"
                  placeholder="Tech Corp"
                />
              </div>

              <div>
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input 
                  id="years_experience"
                  name="years_experience"
                  type="number"
                  min="0"
                  placeholder="5"
                />
              </div>

              <div>
                <Label htmlFor="notice_period">Notice Period</Label>
                <Input 
                  id="notice_period"
                  name="notice_period"
                  placeholder="30 days"
                />
              </div>

              <div>
                <Label htmlFor="salary_current">Current Salary (ZAR)</Label>
                <Input 
                  id="salary_current"
                  name="salary_current"
                  type="number"
                  placeholder="600000"
                />
              </div>

              <div>
                <Label htmlFor="salary_expected">Expected Salary (ZAR)</Label>
                <Input 
                  id="salary_expected"
                  name="salary_expected"
                  type="number"
                  placeholder="750000"
                />
              </div>
            </div>
          </div>

          {/* Skills and Education */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Education</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input 
                  id="skills"
                  name="skills"
                  placeholder="JavaScript, React, Node.js, Python"
                />
                <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <textarea
                  id="education"
                  name="education"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="BSc Computer Science - University of Cape Town (2015-2018)"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="placed">Placed</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </div>

              <div>
                <Label htmlFor="source">Source</Label>
                <select
                  id="source"
                  name="source"
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select source</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                  <option value="job_board">Job Board</option>
                  <option value="direct">Direct Application</option>
                  <option value="agency">Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Additional notes about the candidate..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link href="/candidates">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit">
              Create Candidate
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}