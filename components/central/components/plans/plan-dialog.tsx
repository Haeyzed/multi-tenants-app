"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"
import { Plan } from "@/types/central/plan"
import { PlanForm } from "./plan-form"
import { useCreatePlan, useUpdatePlan } from "@/hooks/central/use-plan-query"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  status: z.enum(["active", "inactive"]),
})

export function PlanDialog({
  children,
  plan,
}: {
  children: React.ReactNode
  plan?: Plan
}) {
  const [open, setOpen] = React.useState(false)
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (plan) {
      updatePlan.mutate({ id: plan.id, plan: values })
    } else {
      createPlan.mutate(values)
    }
    setOpen(false)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {plan ? "Edit Plan" : "Create Plan"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <PlanForm plan={plan} onSubmit={onSubmit} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}