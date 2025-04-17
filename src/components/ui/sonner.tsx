
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:cursor-pointer",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:!bg-green-500 group-[.toaster]:!border-green-700/30 group-[.toaster]:text-white",
          error: "group-[.toaster]:!bg-destructive group-[.toaster]:!border-destructive/30 group-[.toaster]:text-white",
          info: "group-[.toaster]:!bg-blue-500 group-[.toaster]:!border-blue-700/30 group-[.toaster]:text-white",
          warning: "group-[.toaster]:!bg-yellow-500 group-[.toaster]:!border-yellow-700/30 group-[.toaster]:text-white",
          loading: "group-[.toaster]:!bg-background group-[.toaster]:!border-border/50 group-[.toaster]:text-foreground",
        },
        closeButton: false,
        onClick: () => true, // This makes the toast dismissible when clicked
      }}
      {...props}
    />
  )
}

export { Toaster }
