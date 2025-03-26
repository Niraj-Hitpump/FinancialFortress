import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "outline" | "noBg"
  animation?: "scale" | "slide" | "fade" | "none"
  bordered?: boolean
  hoverEffect?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", animation = "none", bordered = true, hoverEffect = true, ...props }, ref) => {
    const baseClasses = "rounded-lg shadow-sm transition-all duration-300"
    
    // Variant-specific classes
    const variantClasses = {
      default: "bg-card text-card-foreground",
      glass: "glass backdrop-blur-md bg-opacity-20 bg-card/20 text-card-foreground",
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-800 text-white",
      outline: "bg-transparent border border-border text-card-foreground",
      noBg: "bg-transparent text-card-foreground"
    }
    
    // Animation classes
    const animationClasses = {
      scale: "hover:scale-[1.02]",
      slide: "hover:-translate-y-1",
      fade: "hover:opacity-95",
      none: ""
    }
    
    // Border classes
    const borderClasses = bordered ? "border" : "border-0"
    
    // Hover effect
    const hoverClasses = hoverEffect 
      ? "hover:shadow-lg transition-shadow"
      : ""
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          animationClasses[animation],
          borderClasses,
          hoverClasses,
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
