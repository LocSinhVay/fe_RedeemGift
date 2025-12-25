import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { MasterInit } from '../_metronic/layout/MasterInit'
import { AuthInit, useAuth } from './pages/Login'

const App = () => {
  // const { auth } = useAuth()
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          {/* <ThemeModeProvider> */}
          <AuthInit>
            {/* {auth && <Sidebar />} */}
            <Outlet /> {/* Đây là nơi render nội dung dựa trên routes */}
            <MasterInit />
          </AuthInit>
          {/* </ThemeModeProvider> */}
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export { App }
