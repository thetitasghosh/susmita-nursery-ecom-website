'use client'

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextProps | undefined>(undefined)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("useSheet must be used within a Sheet provider")
  }
  return context
}

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [localOpen, setLocalOpen] = React.useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : localOpen
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value)
      } else {
        setLocalOpen(value)
      }
    },
    [onOpenChange]
  )

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps {
  children: React.ReactElement
  asChild?: boolean
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { setOpen } = useSheet()
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) {
        children.props.onClick(e)
      }
      setOpen(true)
    }
  })
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
}

export function SheetContent({
  children,
  side = "right",
  className,
  ...props
}: SheetContentProps) {
  const { open, setOpen } = useSheet()
  
  // State to manage mounting/unmounting for smooth CSS transitions
  const [shouldRender, setShouldRender] = React.useState(open)
  const [animate, setAnimate] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setShouldRender(true)
      const timer = setTimeout(() => setAnimate(true), 10)
      return () => clearTimeout(timer)
    } else {
      setAnimate(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out cursor-pointer",
          animate ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Sheet panel */}
      <div
        className={cn(
          "fixed bg-card shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out h-full overflow-hidden",
          {
            "top-0 bottom-0 right-0 w-full max-w-xl border-l border-border rounded-l-[32px]": side === "right",
            "translate-x-full": side === "right" && !animate,
            
            "top-0 bottom-0 left-0 w-full max-w-xl border-r border-border rounded-r-[32px]": side === "left",
            "-translate-x-full": side === "left" && !animate,

            "top-0 left-0 right-0 h-96 border-b border-border rounded-b-[32px]": side === "top",
            "-translate-y-full": side === "top" && !animate,

            "bottom-0 left-0 right-0 h-[600px] border-t border-border rounded-t-[32px]": side === "bottom",
            "translate-y-full": side === "bottom" && !animate,

            "translate-x-0": (side === "right" || side === "left") && animate,
            "translate-y-0": (side === "top" || side === "bottom") && animate,
          },
          className
        )}
        {...props}
      >
        {/* Close trigger */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-6 top-6 p-2 rounded-full text-neutral-400 hover:text-white bg-white/5 hover:bg-neutral-800 cursor-pointer transition-all duration-200 z-10"
        >
          <X size={16} />
          <span className="sr-only">Close sheet</span>
        </button>
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6 border-b border-border bg-neutral-dark text-white rounded-tl-[32px] shrink-0",
        className
      )}
      {...props}
    />
  )
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-border bg-card shrink-0 mt-auto",
        className
      )}
      {...props}
    />
  )
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-serif font-bold text-white tracking-wide block leading-none",
        className
      )}
      {...props}
    />
  )
}

export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[10px] text-neutral-400 font-sans tracking-widest uppercase block mt-1", className)}
      {...props}
    />
  )
}

export function SheetClose({
  children,
}: {
  children: React.ReactElement
}) {
  const { setOpen } = useSheet()
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) {
        children.props.onClick(e)
      }
      setOpen(false)
    }
  })
}
