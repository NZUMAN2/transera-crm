"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: any) => {
  return <span>{placeholder}</span>
}

const SelectContent = ({ children, className }: any) => {
  return (
    <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md", className)}>
      {children}
    </div>
  )
}

const SelectItem = ({ children, value, ...props }: any) => {
  return (
    <div className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-gray-100" {...props}>
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }