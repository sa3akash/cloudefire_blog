import React from 'react'
import { TooltipProvider } from "@/components/ui/tooltip";

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
       <TooltipProvider>{children}</TooltipProvider>
    )
}

export default Provider