import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { zodResolver } from '../../utils/zodResolver'
import { showToast } from '../../utils/toast'
import { useAddMember } from '../../hooks/useGroups'

const addMemberSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
})

export default function AddMemberDialog({ open, onOpenChange, groupId }) {
  const addMember = useAddMember()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(addMemberSchema),
  })

  const onSubmit = async (values) => {
    try {
      await addMember.mutateAsync({
        groupId,
        data: values,
      })
      showToast({
        type: 'success',
        title: 'Member added',
        message: 'Member has been added to the group.',
      })
      reset()
      onOpenChange(false)
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to add member',
        message: error?.response?.data?.message ?? 'Unable to add member',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a new member to this group by their email address.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium text-slate-800" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="friend@example.com"
              autoComplete="off"
              {...register('email')}
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || addMember.isPending}>
              {isSubmitting || addMember.isPending ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
