'use client'

import { motion } from 'framer-motion'
import { RiUserLine, RiMailLine, RiPhoneLine, RiStarLine } from 'react-icons/ri'

export default function TeamPage() {
  const team = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Recruiter', email: 'sarah@transera.com', phone: '+1 234-567-8901', performance: 92 },
    { id: 2, name: 'Michael Chen', role: 'Recruitment Lead', email: 'michael@transera.com', phone: '+1 234-567-8902', performance: 88 },
    { id: 3, name: 'Emily Davis', role: 'Junior Recruiter', email: 'emily@transera.com', phone: '+1 234-567-8903', performance: 85 },
    { id: 4, name: 'James Wilson', role: 'Executive Search', email: 'james@transera.com', phone: '+1 234-567-8904', performance: 95 }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Team Members 👥
        </h1>
        <p className="text-gray-600 mt-1">Manage your recruitment team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <RiMailLine /> {member.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <RiPhoneLine /> {member.phone}
              </div>
              <div className="flex items-center gap-2">
                <RiStarLine className="text-yellow-500" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${member.performance}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{member.performance}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}