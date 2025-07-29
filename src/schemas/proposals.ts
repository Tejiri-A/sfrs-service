import { z } from 'zod';

export const createProposalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  budget: z.number().positive('Budget must be a positive number').max(10000000, 'Budget cannot exceed $10,000,000'),
  expected_start_date: z.string().min(1, 'Start date is required'),
  expected_end_date: z.string().min(1, 'End date is required'),
}).refine(data => {
  const startDate = new Date(data.expected_start_date);
  const endDate = new Date(data.expected_end_date);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['expected_end_date'],
}).refine(data => {
  const startDate = new Date(data.expected_start_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return startDate >= today;
}, {
  message: 'Start date cannot be in the past',
  path: ['expected_start_date'],
});

export const sendBackSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (at least 10 characters)').max(500, 'Reason must be less than 500 characters'),
});

export const approvalActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
}).refine(data => {
  if (data.action === 'reject' && (!data.reason || data.reason.trim().length < 10)) {
    return false;
  }
  return true;
}, {
  message: 'Reason is required when rejecting (at least 10 characters)',
  path: ['reason'],
});

export type CreateProposalForm = z.infer<typeof createProposalSchema>;
export type SendBackForm = z.infer<typeof sendBackSchema>;
export type ApprovalActionForm = z.infer<typeof approvalActionSchema>;
