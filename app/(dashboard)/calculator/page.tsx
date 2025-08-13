'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator, DollarSign } from 'lucide-react'

export default function FeeCalculatorPage() {
  const [amount, setAmount] = useState('')
  const [percentage, setPercentage] = useState('12')
  const [result, setResult] = useState<{
    fee: number
    vat: number
    total: number
  } | null>(null)

  // Auto-calculate when values change
  useEffect(() => {
    if (amount && percentage) {
      calculateFee()
    }
  }, [amount, percentage])

  const calculateFee = () => {
    const baseAmount = parseFloat(amount) || 0
    const feePercentage = parseFloat(percentage) / 100
    
    const fee = baseAmount * feePercentage
    const vat = fee * 0.15 // 15% VAT
    const total = fee + vat

    setResult({
      fee,
      vat,
      total
    })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fee Calculator</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculate Placement Fee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Base Salary (Annual)</Label>
              <Input
                id="amount"
                type="text"
                placeholder="e.g., 500000"
                value={amount}
                onChange={handleAmountChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="percentage">Commission Rate (%)</Label>
              <select
                id="percentage"
                className="w-full mt-1 p-2 border rounded-md bg-white"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              >
                <option value="8">8% - Contract Rate</option>
                <option value="10">10% - Volume Rate</option>
                <option value="12">12% - Standard Rate (TransEra)</option>
                <option value="15">15% - Premium Rate</option>
              </select>
            </div>
            
            <Button 
              onClick={calculateFee} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Calculate Fee
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fee Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Package Amount:</span>
                <span className="font-semibold">
                  R {amount ? parseFloat(amount).toLocaleString('en-ZA') : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Commission ({percentage}%):</span>
                <span className="font-semibold">
                  R {result ? result.fee.toLocaleString('en-ZA') : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT (15%):</span>
                <span className="font-semibold">
                  R {result ? result.vat.toLocaleString('en-ZA') : '0'}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t text-lg font-bold">
                <span>Total Invoice:</span>
                <span className="text-purple-600">
                  R {result ? result.total.toLocaleString('en-ZA') : '0'}
                </span>
              </div>
            </div>

            {result && result.total > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Monthly Projection</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Consultant Commission (40%):</span>
                    <span className="font-semibold text-green-600">
                      R {(result.fee * 0.4).toLocaleString('en-ZA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Revenue (60%):</span>
                    <span className="font-semibold text-green-600">
                      R {(result.fee * 0.6).toLocaleString('en-ZA')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}