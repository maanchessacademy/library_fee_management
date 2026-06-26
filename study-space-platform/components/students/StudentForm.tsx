"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { addMonths, format } from "date-fns"
import { useEffect } from "react"

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number"),
  seatNumber: z.string().min(1, "Seat number is required"),
  monthlyFee: z.coerce.number().min(1, "Monthly fee is required"),
  subscriptionStart: z.string().min(1, "Start date is required"),
  subscriptionEnd: z.string().min(1, "End date is required"),
})

export type StudentFormValues = z.infer<typeof studentSchema>

interface StudentFormProps {
  onSubmit: (data: StudentFormValues) => Promise<void>
  isLoading: boolean
  defaultValues?: Partial<StudentFormValues>
  submitLabel?: string
}

export function StudentForm({ onSubmit, isLoading, defaultValues, submitLabel = "Add Student" }: StudentFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      whatsappNumber: defaultValues?.whatsappNumber || '',
      seatNumber: defaultValues?.seatNumber || '',
      monthlyFee: defaultValues?.monthlyFee || 0,
      subscriptionStart: defaultValues?.subscriptionStart || format(new Date(), 'yyyy-MM-dd'),
      subscriptionEnd: defaultValues?.subscriptionEnd || format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    }
  })

  const startDate = watch('subscriptionStart')

  useEffect(() => {
    if (startDate && !defaultValues?.subscriptionEnd) {
      const endDate = addMonths(new Date(startDate), 1)
      setValue('subscriptionEnd', format(endDate, 'yyyy-MM-dd'))
    }
  }, [startDate, setValue, defaultValues?.subscriptionEnd])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="name"
        label="Full Name"
        placeholder="Rahul Sharma"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        id="whatsappNumber"
        label="WhatsApp Number"
        placeholder="919876543210"
        error={errors.whatsappNumber?.message}
        {...register("whatsappNumber")}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="seatNumber"
          label="Seat Number"
          placeholder="A12"
          error={errors.seatNumber?.message}
          {...register("seatNumber")}
        />
        <Input
          id="monthlyFee"
          label="Monthly Fee (₹)"
          type="number"
          placeholder="1500"
          error={errors.monthlyFee?.message}
          {...register("monthlyFee")}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="subscriptionStart"
          label="Subscription Start"
          type="date"
          error={errors.subscriptionStart?.message}
          {...register("subscriptionStart")}
        />
        <Input
          id="subscriptionEnd"
          label="Subscription End"
          type="date"
          error={errors.subscriptionEnd?.message}
          {...register("subscriptionEnd")}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
