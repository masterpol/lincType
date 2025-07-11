import { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva(
  "mx-auto w-full  px-4 sm:px-6 lg:px-8 sm:border sm:border-border sm:rounded-lg sm:shadow-sm flex flex-col mt-[10%] mb-auto h-fit",
  {
    variants: {
      width: {
        full: "w-full",
        content: "max-w-7xl",
        narrow: "max-w-3xl",
        wide: "max-w-[1920px]"
      },
      padding: {
        none: "p-0",
        default: "px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10",
        tight: "px-2 py-3 sm:px-4 sm:py-4"
      }
    },
    defaultVariants: {
      width: "content",
      padding: "default"
    }
  }
)

interface ContainerProps extends ComponentProps<"div">, VariantProps<typeof containerVariants> {}

function Container({ className, width, padding, ...props }: ContainerProps) {
  return (
    <div 
      className={cn(containerVariants({ width, padding, className }))}
      {...props} 
    />
  )
}

export { Container, containerVariants }