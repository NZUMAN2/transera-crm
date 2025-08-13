'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  RiDownloadLine, 
  RiFileExcelLine, 
  RiFilePdfLine,
  RiPrinterLine,
  RiMailLine
} from 'react-icons/ri'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  
  const reportTypes = [
    { id: 'monthly', name: 'Monthly Report', icon: '📊' },
    { id: 'candidates', name: 'Candidates Report', icon: '👥' },
    { id: 'placements', name: 'Placements Report', icon: '✅' },
    { id: 'performance', name: 'Performance Report', icon: '📈' }
  ]

  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    // Create sample data
    const data = [
      ['Name', 'Role', 'Status', 'Date'],
      ['John Doe', 'Software Engineer', 'Hired', '2025-01-15'],
      ['Jane Smith', 'Product Manager', 'Interview', '2025-01-14'],
      ['Mike Johnson', 'Designer', 'Applied', '2025-01-13']
    ]

    if (format === 'csv') {
      const csv = data.map(row => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${Date.now()}.csv`
      a.click()
    } else {
      alert(`Exporting as ${format.toUpperCase()}... (Feature will be fully implemented with libraries)`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Reports & Export 📊
          </h1>
          <p className="text-gray-600 mt-1">Generate and export recruitment reports</p>
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Select Report Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportTypes.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedReport === report.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{report.icon}</div>
              <div className="text-sm font-medium">{report.name}</div>
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Export Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportData('pdf')}
            className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
          >
            <RiFilePdfLine className="text-red-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Export as PDF</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportData('excel')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all"
          >
            <RiFileExcelLine className="text-green-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Export as Excel</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportData('csv')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
          >
            <RiDownloadLine className="text-blue-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Export as CSV</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all"
          >
            <RiMailLine className="text-purple-500 text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Email Report</span>
          </motion.button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Report Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Candidate</th>
                <th className="text-left py-2 px-4">Position</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', position: 'Software Engineer', status: 'Hired', date: '2025-01-15' },
                { name: 'Jane Smith', position: 'Product Manager', status: 'Interview', date: '2025-01-14' },
                { name: 'Mike Johnson', position: 'Designer', status: 'Applied', date: '2025-01-13' }
              ].map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{row.name}</td>
                  <td className="py-2 px-4">{row.position}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.status === 'Hired' ? 'bg-green-100 text-green-600' :
                      row.status === 'Interview' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{row.date}</td>
                  <td className="py-2 px-4">
                    <button className="text-purple-600 hover:text-purple-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}