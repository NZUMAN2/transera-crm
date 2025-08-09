'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FileUpload({ 
  candidateId, 
  onUploadComplete 
}: { 
  candidateId: string
  onUploadComplete?: (url: string) => void 
}) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${candidateId}-${Date.now()}.${fileExt}`
      const filePath = `resumes/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // Update candidate with resume URL
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ resume_url: publicUrl })
        .eq('id', candidateId)

      if (updateError) throw updateError

      onUploadComplete?.(publicUrl)
      alert('Resume uploaded successfully!')
    } catch (error) {
      alert('Error uploading file!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
        <span>{uploading ? 'Uploading...' : 'Upload Resume'}</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  )
}