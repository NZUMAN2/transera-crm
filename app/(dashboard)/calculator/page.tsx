'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CalculatorPage() {
  const [salary, setSalary] = useState('')
  const [percentage, setPercentage] = useState('20')
  const [fee, setFee] = useState(0)

  const calculateFee = () => {
    const salaryNum = parseFloat(salary) || 0
    const percentNum = parseFloat(percentage) || 0
    const calculatedFee = (salaryNum * percentNum) / 100
    setFee(calculatedFee)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Fee Calculator 💰
        </h1>
        <p className="text-gray-600 mt-1">Calculate recruitment fees quickly</p>
      </div>

      {/* Calculator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-2xl"
      >
        <div className="space-y-6">
          {/* Salary Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💵 Annual Salary
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 100000"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg"
            />
          </div>

          {/* Percentage Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Fee Percentage
            </label>
            <div className="flex gap-2">
              {['15', '20', '25', '30'].map(percent => (
                <button
                  key={percent}
                  onClick={() => setPercentage(percent)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    percentage === percent
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {percent}%
                </button>
              ))}
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="px-4 py-2 border rounded-lg w-24"
                placeholder="Custom"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateFee}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all"
          >
            🧮 Calculate Fee
          </button>

          {/* Result */}
          {fee > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 text-center"
            >
              <p className="text-sm text-gray-600 mb-2">Recruitment Fee</p>
              <p className="text-4xl font-bold text-purple-600">
                ${fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Reference */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Fee Structure Reference 📋</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Standard Roles</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Junior positions: 15-18%</li>
              <li>• Mid-level positions: 18-22%</li>
              <li>• Senior positions: 20-25%</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Executive Roles</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Director level: 25-30%</li>
              <li>• VP level: 30-33%</li>
              <li>• C-Suite: 33-35%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}