import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import { UserSystemPage } from '../pages/UserSystem/UserSystemPage'
import { RolePage } from '../pages/Role/RolePage'
import { MenuPage } from '../pages/Menu/MenuPage'
import { EmailConfigPage } from '../pages/EmailConfig/EmailConfigPage'
import { useAuth } from '../pages/Login'
import { RedeemSpinPage } from '../pages/RedeemSpin/RedeemSpinPage'
import { PrizesPage } from '../pages/Prizes/PrizesPage'
import { QRPage } from '../pages/QR/QRPage'
import { ProjectPage } from '../pages/Project/ProjectPage'
import { GiftPage } from '../pages/Gift/GiftPage'
import { HistorySpinPage } from '../pages/HistorySpin/HistorySpinPage'

const PrivateRoutes = () => {
  const { auth } = useAuth()
  const location = useLocation()

  // Nếu chưa login → về auth
  if (!auth) {
    return <Navigate to="/auth" replace />
  }

  // Lấy danh sách path hợp lệ từ menu của user
  const allowedPaths =
    auth?.Menu?.map((m) => m.MenuPath).filter((p): p is string => !!p) || []

  // Nếu đã login nhưng chưa có menu
  if (!allowedPaths.length) {
    return <Navigate to="/auth" replace state={{ noMenu: true }} />
  }

  // Nếu path hiện tại không thuộc menu user có → về 404
  const isAllowed = allowedPaths.some((menuPath) =>
    location.pathname.startsWith(menuPath)
  )
  if (!isAllowed) {
    return <Navigate to="/error/404" replace />
  }

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Pages trong hệ thống */}
        <Route path="redeemSpin" element={<RedeemSpinPage />} />
        <Route path="prizes" element={<PrizesPage />} />
        <Route path="qr" element={<QRPage />} />
        <Route path="historySpin" element={<HistorySpinPage />} />
        <Route path="userSystem" element={<UserSystemPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route path="gift" element={<GiftPage />} />
        <Route path="role" element={<RolePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="emailConfig" element={<EmailConfigPage />} />

        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" replace />} />
      </Route>
    </Routes>
  )
}

export { PrivateRoutes }
