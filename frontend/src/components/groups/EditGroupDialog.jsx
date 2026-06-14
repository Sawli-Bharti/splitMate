import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { zodResolver } from '../../utils/zodResolver'
import { showToast } from '../../utils/toast'
import { useUpdateGroup } from '../../hooks/useGroups'

const editGroupSchema = z.object({
  name: z.string()
    .min(1, 'Group name is required')
    .min(3, 'Group name must be at least 3 characters')
    .max(100, 'Group name cannot exceed 100 characters'),
  description: z.string().optional().default(''),
})

export default function EditGroupDialog({ open, onOpenChange, group }) {
  const updateGroup = useUpdateGroup()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(editGroupSchema),
  })

  useEffect(() => {
    if (open && group) {
      reset({
        name: group.name,
        description: group.description || '',
      })
    }
  }, [open, group, reset])

  const onSubmit = async (values) => {
    try {
      await updateGroup.mutateAsync({
        groupId: group.id,
        data: values,
      })
      showToast({
        type: 'success',
        title: 'Group updated',
        message: 'Your group has been updated successfully.',
      })
      onOpenChange(false)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to update group',
        message: error?.response?.data?.message ?? 'Unable to update group',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Update group details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="edit-name">
              Group Name
            </label>
            <Input
              id="edit-name"
              placeholder="e.g., Goa Trip"
              autoComplete="off"
              {...register('name')}
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="edit-description">
              Description
            </label>
            <Textarea
              id="edit-description"
              placeholder="e.g., Trip Expenses"
              autoComplete="off"
              {...register('description')}
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || updateGroup.isPending}>
              {isSubmitting || updateGroup.isPending ? 'Updating...' : 'Update Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
