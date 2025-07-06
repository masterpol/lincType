import { ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function resolveDefaultTag(variant: TitleProps['variant']) {
  switch (variant) {
    case 'main':
      return 'h1'
    case 'sub':
      return 'h2'
    case 'default':
      return 'h3'
    default:
      return 'h3'
  }
}

const titleVariants = cva(
  "font-bold tracking-tight mb-4", // added mb-4 for bottom margin
  {
    variants: {
      variant: {
        main: "text-4xl font-extrabold lg:text-5xl",
        sub: "text-2xl lg:text-3xl",
        default: "text-xl lg:text-2xl"
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-bold",
        extrabold: "font-extrabold"
      }
    },
    defaultVariants: {
      variant: "default",
      weight: "bold"
    }
  }
)

interface TitleProps extends VariantProps<typeof titleVariants> {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

function Title({ 
  children, 
  variant, 
  weight,
  className,
  as: Component = resolveDefaultTag(variant), 
  ...props 
}: TitleProps) {
  return (
    <Component
      className={cn(titleVariants({ variant, weight, className }))}
      {...props}
    >
      {children}
    </Component>
  )
}

export { Title, titleVariants }
