'use client'

import { useToast } from '@/components/ui/use-toast'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const variant = toast.variant || 'default'
        
        const variantStyles = {
          default: 'bg-white border-gray-200 text-gray-900',
          destructive: 'bg-red-50 border-red-200 text-red-900',
          success: 'bg-green-50 border-green-200 text-green-900'
        }

        const iconMap = {
          default: <Info className="h-5 w-5 text-blue-600" />,
          destructive: <AlertCircle className="h-5 w-5 text-red-600" />,
          success: <CheckCircle className="h-5 w-5 text-green-600" />
        }

        return (
          <div
            key={toast.id}
            className={`
              relative flex items-start gap-3 w-full p-4 pr-10
              border rounded-lg shadow-lg
              animate-in slide-in-from-bottom-2 fade-in duration-300
              ${variantStyles[variant]}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {iconMap[variant]}
            </div>
            
            <div className="flex-1 space-y-1">
              {toast.title && (
                <p className="font-semibold text-sm">
                  {toast.title}
                </p>
              )}
              {toast.description && (
                <p className="text-sm opacity-90">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}