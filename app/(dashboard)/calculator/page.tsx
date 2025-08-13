'use client'

import { useState } from 'react'
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

  const calculateFee = () => {
    const baseAmount = parseFloat(amount)
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
              <Label htmlFor="amount">Candidate Annual Package (ZAR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="percentage">Fee Percentage (%)</Label>
              <select
                id="percentage"
                className="w-full p-2 border rounded-md"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              >
                <option value="8">8% - Junior Positions</option>
                <option value="10">10% - Mid-Level</option>
                <option value="12">12% - Standard (TransEra)</option>
                <option value="15">15% - Executive</option>
              </select>
            </div>
            
            <Button 
              onClick={calculateFee} 
              className="w-full"
              disabled={!amount}
            >
              Calculate Fee
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Fee Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b">
                  <span>Placement Fee ({percentage}%)</span>
                  <span className="font-semibold">
                    R {result.fee.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span>VAT (15%)</span>
                  <span className="font-semibold">
                    R {result.vat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-lg font-bold">
                  <span>Total Invoice Amount</span>
                  <span className="text-green-600">
                    R {result.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}