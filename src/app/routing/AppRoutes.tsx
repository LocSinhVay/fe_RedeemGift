import { FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { App } from '../App'
import { AuthPage, useAuth } from '../pages/Login'
import { RecoveryPassword } from '../pages/Login/components/RecoveryPassword'
import { ErrorsPage } from '../components/errors/ErrorsPage'
import { LuckyWheelPage } from '../pages/LuckyWheel/LuckyWheelPage'

const RedirectToAuth = () => <Navigate to="/auth" replace />

const AppRoutes: FC = () => {
  const { auth } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* Các trang lỗi */}
          <Route path="error/*" element={<ErrorsPage />} />

          {/* <-- Luôn đăng ký /auth để có thể redirect về đây bất kể auth true/false */}
          <Route path="auth/*" element={<AuthPage />} />

          {auth ? (
            // Đã login
            auth.Menu && auth.Menu.length > 0 ? (
              <>
                {/* Redirect mặc định → menu đầu tiên */}
                <Route index element={<Navigate to={auth.Menu[0].MenuPath} replace />} />

                {/* Các route private */}
                <Route path="/*" element={<PrivateRoutes />} />
                <Route path="recoveryPassword/*" element={<RecoveryPassword />} />
                <Route path="luckyWheel/spin/:spinGrantId" element={<LuckyWheelPage />} />
              </>
            ) : (
              // Đã login nhưng không có menu → redirect về /auth (AuthPage đã được đăng ký phía trên)
              // Dùng index + catch-all để đảm bảo mọi đường dẫn đều được chuyển về auth
              <>
                <Route index element={<Navigate to="/auth" replace state={{ noMenu: true }} />} />
                <Route path="*" element={<Navigate to="/auth" replace state={{ noMenu: true }} />} />
              </>
            )
          ) : (
            // Chưa login
            <>
              {/* AuthPage đã đăng ký ở ngoài rồi, chỉ cần các route bổ sung */}
              <Route path="recoveryPassword/*" element={<RecoveryPassword />} />
              <Route path="luckyWheel/spin/:spinGrantId" element={<LuckyWheelPage />} />
              {/* Mặc định redirect tới auth nếu chưa đăng nhập */}
              <Route path="*" element={<RedirectToAuth />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
