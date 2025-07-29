import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProposalSchema, type CreateProposalForm } from '../../schemas/proposals';
import { databaseService } from '../../libs/supabase-service';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface CreateProposalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateProposalForm({ onSuccess, onCancel }: CreateProposalFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProposalForm>({
    resolver: zodResolver(createProposalSchema),
  });

  const onSubmit = async (data: CreateProposalForm) => {
    if (!user) {
      toast.error('You must be logged in to create a proposal');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await databaseService.createProposal(data);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Proposal created successfully!');
        onSuccess();
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter project title"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your project requirements..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget ($)</Label>
        <Input
          id="budget"
          type="number"
          step="0.01"
          placeholder="Enter budget amount"
          {...register('budget', { valueAsNumber: true })}
        />
        {errors.budget && (
          <p className="text-sm text-red-600">{errors.budget.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expected_start_date">Expected Start Date</Label>
          <Input
            id="expected_start_date"
            type="date"
            {...register('expected_start_date')}
          />
          {errors.expected_start_date && (
            <p className="text-sm text-red-600">{errors.expected_start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected_end_date">Expected End Date</Label>
          <Input
            id="expected_end_date"
            type="date"
            {...register('expected_end_date')}
          />
          {errors.expected_end_date && (
            <p className="text-sm text-red-600">{errors.expected_end_date.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Proposal'}
        </Button>
      </div>
    </form>
  );
}
