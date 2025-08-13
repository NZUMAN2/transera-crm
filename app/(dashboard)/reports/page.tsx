'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  RiDownloadLine, 
  RiFileExcelLine, 
  RiFilePdfLine,
  RiMailLine,
  RiBarChartLine
} from 'react-icons/ri'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly')
  
  const reportTypes = [
    { id: 'monthly', name: 'Monthly Report', icon: '📊', count: 45 },
    { id: 'candidates', name: 'Candidates Report', icon: '👥', count: 326 },
    { id: 'placements', name: 'Placements Report', icon: '✅', count: 12 },
    { id: 'performance', name: 'Performance Report', icon: '📈', count: 8 }
  ]

  const handleExport = (format: string) => {
    // Sample CSV export
    if (format === 'csv') {
      const csvContent = "Name,Role,Status,Date\nJohn Doe,Software Engineer,Hired,2025-01-15\nJane Smith,Product Manager,Interview,2025-01-14"
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${Date.now()}.csv`
      a.click()
    } else {
      alert(`Export as ${format.toUpperCase()} will be available soon!`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Reports & Analytics 📊
        </h1>
        <p className="text-gray-600 mt-1">Generate and export recruitment reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedReport(report.id)}
            className={`p-6 rounded-xl cursor-pointer transition-all ${
              selectedReport === report.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white border border-gray-200 hover:shadow-md'
            }`}
          >
            <div className="text-3xl mb-3">{report.icon}</div>
            <h3 className="font-bold text-lg mb-1">{report.name}</h3>
            <p className={`text-2xl font-bold ${
              selectedReport === report.id ? 'text-white' : 'text-gray-800'
            }`}>
              {report.count}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Export Options</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('pdf')}
            className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2"
          >
            <RiFilePdfLine /> Export as PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-2"
          >
            <RiFileExcelLine /> Export as Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-2"
          >
            <RiDownloadLine /> Export as CSV
          </button>
          <button
            onClick={() => alert('Email feature coming soon!')}
            className="px-6 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center gap-2"
          >
            <RiMailLine /> Email Report
          </button>
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', position: 'Software Engineer', status: 'Hired', date: '2025-01-15' },
                { name: 'Jane Smith', position: 'Product Manager', status: 'Interview', date: '2025-01-14' },
                { name: 'Mike Johnson', position: 'Designer', status: 'Applied', date: '2025-01-13' },
                { name: 'Sarah Williams', position: 'Data Scientist', status: 'Screening', date: '2025-01-12' }
              ].map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{row.name}</td>
                  <td className="py-3 px-4">{row.position}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === 'Hired' ? 'bg-green-100 text-green-700' :
                      row.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                      row.status === 'Screening' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}