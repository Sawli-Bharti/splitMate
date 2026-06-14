import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="grid min-h-svh place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">SplitMate</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">Welcome</h1>
        </div>
        <Outlet />
      </section>
    </main>
  )
}
