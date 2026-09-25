import { z } from 'zod'

export const amountSchema = z
  .string('Amount is required')
  .min(1, 'Amount is required')
  .regex(/^\d+(\.\d{1,2})?$/, {
    message: 'Amount must be a positive number with up to 2 decimal places'
  })
  .transform((value) => Number(value))
  .refine((value) => value > 0.01, 'Amount cannot be less than 0.01')
  .refine((value) => value <= 99999999.99, 'Amount cannot be more than 99999999.99')
