'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator, DollarSign } from 'lucide-react'

export default function FeeCalculatorPage() {
  const [amount, setAmount] = useState<string>('')
  const [percentage, setPercentage] = useState<string>('12')
  const [commission, setCommission] = useState<number>(0)
  const [vat, setVat] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  // Calculate fees whenever amount or percentage changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const baseAmount = parseFloat(amount)
      const feePercentage = parseFloat(percentage) / 100
      
      const calculatedCommission = baseAmount * feePercentage
      const calculatedVat = calculatedCommission * 0.15 // 15% VAT
      const calculatedTotal = calculatedCommission + calculatedVat

      setCommission(calculatedCommission)
      setVat(calculatedVat)
      setTotal(calculatedTotal)
    } else {
      setCommission(0)
      setVat(0)
      setTotal(0)
    }
  }, [amount, percentage])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Placement Fee Calculator</h1>
        <p className="text-muted-foreground">Calculate placement fees and generate invoice amounts</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Placement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salary">Base Salary (Annual)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Enter annual salary"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="rate">Commission Rate (%)</Label>
              <select
                id="rate"
                className="w-full mt-1 p-2 border rounded-md"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
              >
                <option value="8">Contract Rate (8%)</option>
                <option value="10">Volume Rate (10%)</option>
                <option value="12">Standard Rate (12%)</option>
                <option value="15">Premium Rate (15%)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Package Amount:</Label>
                <p className="text-2xl font-bold">
                  R {amount ? parseFloat(amount).toLocaleString('en-ZA') : '0'}
                </p>
              </div>
              
              <div>
                <Label>Commission ({percentage}%):</Label>
                <p className="text-2xl font-bold">
                  R {commission.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div>
                <Label>VAT (15%):</Label>
                <p className="text-2xl font-bold">
                  R {vat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <Label>Total Invoice:</Label>
                <p className="text-3xl font-bold text-purple-600">
                  R {total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Projection */}
      {commission > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monthly Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">If you close this placement:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Consultant Commission (40%):</Label>
                <p className="text-xl font-bold text-green-600">
                  R {(commission * 0.4).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label>Company Revenue (60%):</Label>
                <p className="text-xl font-bold text-blue-600">
                  R {(commission * 0.6).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}