import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/button'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { register as registerRequest } from '../services/authService'
import { showToast } from '../utils/toast'
import { zodResolver } from '../utils/zodResolver'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTES.dashboard, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (values) => {
    try {
      const response = await registerRequest(values)

      if (!response.success) {
        showToast({
          type: 'error',
          title: 'Registration failed',
          message: response.message ?? 'Unable to create account',
        })
        return
      }

      showToast({
        type: 'success',
        title: 'Account created',
        message: response.message ?? 'You can now log in.',
      })

      if (response.data?.token) {
        login(response.data)
        navigate(ROUTES.dashboard, { replace: true })
        return
      }

      navigate(ROUTES.login, { replace: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Registration failed',
        message: error?.response?.data?.message ?? 'Unable to create account',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Register</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Create your SplitMate account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            {...register('name')}
          />
          {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name.message}</p> : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            {...register('email')}
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            {...register('password')}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-slate-950 underline" to={ROUTES.login}>
          Login
        </Link>
      </p>
    </div>
  )
}
