import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Login } from './components/Login'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route index element={<Login />} />
      <Route element={<Login />} />
    </Route>
  </Routes>
)

export { AuthPage }
