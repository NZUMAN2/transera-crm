'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly')
  const [dateRange, setDateRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  })
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const reportTypes = [
    { id: 'monthly', name: 'Monthly Report', icon: '📊', count: 45 },
    { id: 'candidates', name: 'Candidates Report', icon: '👥', count: 326 },
    { id: 'placements', name: 'Placements Report', icon: '✅', count: 12 },
    { id: 'performance', name: 'Performance Report', icon: '📈', count: 8 }
  ]

  useEffect(() => {
    generateReport()
  }, [selectedReport, dateRange])

  function generateReport() {
    setLoading(true)
    setTimeout(() => {
      let data = []
      
      if (selectedReport === 'candidates') {
        data = [
          { name: 'John Doe', role: 'Software Engineer', status: 'Hired', date: '2025-01-15', salary: 120000 },
          { name: 'Jane Smith', role: 'Product Manager', status: 'Interview', date: '2025-01-14', salary: 150000 },
          { name: 'Mike Johnson', role: 'Designer', status: 'Applied', date: '2025-01-13', salary: 95000 },
          { name: 'Sarah Williams', role: 'Data Scientist', status: 'Screening', date: '2025-01-12', salary: 130000 },
          { name: 'Tom Brown', role: 'DevOps Engineer', status: 'Offer', date: '2025-01-11', salary: 110000 }
        ]
      } else if (selectedReport === 'placements') {
        data = [
          { candidate: 'John Doe', client: 'Tech Corp', position: 'Senior Developer', fee: 24000, date: '2025-01-15' },
          { candidate: 'Emily Davis', client: 'StartupXYZ', position: 'Frontend Lead', fee: 20000, date: '2025-01-10' },
          { candidate: 'Mark Taylor', client: 'Finance Inc', position: 'Full Stack Dev', fee: 18000, date: '2025-01-05' }
        ]
      } else if (selectedReport === 'performance') {
        data = [
          { recruiter: 'Sarah Johnson', placements: 5, revenue: 120000, conversion: '15%' },
          { recruiter: 'Michael Chen', placements: 4, revenue: 95000, conversion: '12%' },
          { recruiter: 'Emily Davis', placements: 3, revenue: 75000, conversion: '10%' }
        ]
      } else {
        data = [
          { month: 'January', candidates: 45, placements: 12, revenue: 240000 },
          { month: 'February', candidates: 52, placements: 15, revenue: 300000 },
          { month: 'March', candidates: 38, placements: 10, revenue: 200000 }
        ]
      }
      
      setReportData(data)
      setLoading(false)
    }, 500)
  }

  function exportCSV() {
    if (reportData.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(reportData[0])
    let csvContent = headers.join(',') + '\n'
    
    reportData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      })
      csvContent += values.join(',') + '\n'
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedReport}_report_${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function exportPDF() {
    if (reportData.length === 0) {
      alert('No data to export')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const reportType = reportTypes.find(r => r.id === selectedReport)
    const headers = Object.keys(reportData[0])
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportType?.name || 'Report'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #7c3aed; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>${reportType?.name || 'Report'}</h1>
          <p>Date Range: ${dateRange.start} to ${dateRange.end}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h.charAt(0).toUpperCase() + h.slice(1)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${reportData.map(row => `
                <tr>
                  ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  function emailReport() {
    const reportType = reportTypes.find(r => r.id === selectedReport)
    const subject = encodeURIComponent(`${reportType?.name} - ${new Date().toLocaleDateString()}`)
    const body = encodeURIComponent(`Please find attached the ${selectedReport} report for the period ${dateRange.start} to ${dateRange.end}.\n\nBest regards,\nTransEra CRM`)
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Reports & Analytics 📊
          </h1>
          <p className="text-gray-600 mt-1">Generate and export recruitment reports</p>
        </div>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
        >
          🔄 Refresh Data
        </button>
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

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Date Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Export Options</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportPDF}
            className="px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            📄 Export as PDF
          </button>
          <button
            onClick={exportCSV}
            className="px-6 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
          >
            📊 Export as Excel
          </button>
          <button
            onClick={exportCSV}
            className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            💾 Export as CSV
          </button>
          <button
            onClick={emailReport}
            className="px-6 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
          >
            ✉️ Email Report
          </button>
        </div>
      </div>

      {/* Data Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Data Preview</h3>
          <span className="text-sm text-gray-500">{reportData.length} records</span>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading report data...</span>
            </div>
          </div>
        ) : reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(reportData[0]).map(header => (
                    <th key={header} className="text-left py-3 px-4 font-medium text-gray-700 capitalize">
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t hover:bg-gray-50">
                    {Object.entries(row).map(([colKey, value], colIndex) => (
                      <td key={colIndex} className="py-3 px-4">
                        {typeof value === 'number' && colKey.includes('salary') || colKey.includes('revenue') || colKey.includes('fee')
                          ? `$${value.toLocaleString()}`
                          : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length > 10 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Showing 10 of {reportData.length} records
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No data available for selected report</p>
        )}
      </div>
    </div>
  )
}