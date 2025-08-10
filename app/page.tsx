// app/page.tsx

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transera-gradient flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">TransEra Solutions</h1>
        <p className="text-2xl mb-8">Professional Recruitment CRM</p>
        <Link 
          href="/login"
          className="bg-white text-transera-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
