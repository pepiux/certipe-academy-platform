
import * as React from "react"

import { cn } from "@/lib/utils"

const Pagination = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex w-full items-center justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

export { Pagination }
