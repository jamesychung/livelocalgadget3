import * as React from "react"

import { cn } from "../../lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const id = props.id || Math.random().toString(36).slice(2);
    return (
      <label
        htmlFor={id}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
          checked ? "bg-primary" : "bg-input",
          className
        )}
      >
        <input
          id={id}
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch } 
