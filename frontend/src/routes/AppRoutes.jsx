import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import DashboardLayout from '../components/layouts/DashboardLayout'
import { ROUTES } from '../constants/routes'
import BalancesPage from '../pages/balances/BalancesPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import GroupDetailsPage from '../pages/GroupDetailsPage'
import GroupPage from '../pages/GroupPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import SettlementDetailsPage from '../pages/settlements/SettlementDetailsPage'
import SettlementsPage from '../pages/settlements/SettlementsPage'
import ExpenseDetailsPage from '../pages/expenses/ExpenseDetailsPage'
import ChatPage from '../pages/chat/ChatPage'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.balances} element={<BalancesPage />} />
          <Route path={ROUTES.groups} element={<GroupPage />} />
          <Route path={ROUTES.groupDetails} element={<GroupDetailsPage />} />
          <Route path={ROUTES.chat} element={<ChatPage />} />
          <Route path={ROUTES.expenseDetails} element={<ExpenseDetailsPage />} />
          <Route path={ROUTES.settlements} element={<SettlementsPage />} />
          <Route path={ROUTES.settlementDetails} element={<SettlementDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
