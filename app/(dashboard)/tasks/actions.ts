// app/(dashboard)/tasks/actions.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTask(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  const taskData = {
    organization_id: profile?.organization_id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    priority: formData.get('priority') as string || 'medium',
    status: 'pending',
    due_date: formData.get('due_date') as string,
    assigned_to: formData.get('assigned_to') as string || user.id,
    created_by: user.id
  }

  const { error } = await supabase
    .from('tasks')
    .insert(taskData)

  if (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }

  revalidatePath('/tasks')
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }

  revalidatePath('/tasks')
}