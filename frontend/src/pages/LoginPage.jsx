import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../components/ui/button'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { login as loginRequest } from '../services/authService'
import { showToast } from '../utils/toast'
import { zodResolver } from '../utils/zodResolver'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTES.dashboard, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (values) => {
    try {
      const response = await loginRequest(values)

      if (!response.success) {
        showToast({
          type: 'error',
          title: 'Login failed',
          message: response.message ?? 'Invalid email or password',
        })
        return
      }

      login(response.data)
      navigate(location.state?.from?.pathname ?? ROUTES.dashboard, { replace: true })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Login failed',
        message: error?.response?.data?.message ?? 'Invalid email or password',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Login</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your SplitMate account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            autoComplete="current-password"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            {...register('password')}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Need an account?{' '}
        <Link className="font-medium text-slate-950 underline" to={ROUTES.register}>
          Register
        </Link>
      </p>
    </div>
  )
}
