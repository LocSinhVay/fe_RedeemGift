
// import { KTIcon } from '../../../helpers'
// import clsx from 'clsx'
// import { useLayout } from '../../core'

// export const SidebarFooter = () => {
//   const { config } = useLayout()
//   const appSidebarDefaultMinimizeDesktopEnabled =
//     config?.app?.sidebar?.default?.minimize?.desktop?.enabled
//   const appSidebarDefaultCollapseDesktopEnabled =
//     config?.app?.sidebar?.default?.collapse?.desktop?.enabled
//   const toggleType = appSidebarDefaultCollapseDesktopEnabled
//     ? 'collapse'
//     : appSidebarDefaultMinimizeDesktopEnabled
//       ? 'minimize'
//       : ''
//   const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? 'active' : ''

//   return (
//     <div className='app-sidebar-footer flex-column-auto pt-2 pb-6 px-6' id='kt_app_sidebar_footer'>
//       {(appSidebarDefaultMinimizeDesktopEnabled || appSidebarDefaultCollapseDesktopEnabled) && (
//         <div
//           // ref={toggleRef}
//           id='kt_app_sidebar_toggle'
//           className={clsx(
//             'btn btn-icon btn-primary overflow-hidden text-nowrap px-0 h-40px w-100',
//           )}
//           data-kt-toggle='true'
//           data-kt-toggle-state={toggleState}
//           data-kt-toggle-target='body'
//           data-kt-toggle-name={`app-sidebar-${toggleType}`}
//         >
//           <KTIcon iconName='left' className='fs-3 rotate-180 ms-1' />
//         </div>
//       )}
//     </div>
//   )
// }

import { KTIcon } from '../../../helpers'
import clsx from 'clsx'
import { useLayout } from '../../core'
import { useEffect, useState } from 'react'

export const SidebarFooter = () => {
  const { config } = useLayout()

  const minimizeEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled

  const collapseEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled

  // const toggleType = collapseEnabled ? 'collapse' : minimizeEnabled ? 'minimize' : ''

  // --- 1) State hiện tại của sidebar (đọc từ localStorage hoặc config) ---
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem('sidebar_minimized') // 'on' | 'off'
    if (saved) return saved === 'on'

    // Nếu chưa có localStorage → lấy default từ config
    return config.app?.sidebar?.default?.minimize?.desktop?.default || false
  })

  // --- 2) Cập nhật DOM BODY khi state thay đổi ---
  useEffect(() => {
    document.body.setAttribute('data-kt-app-sidebar-minimize', isMinimized ? 'on' : 'off')
    localStorage.setItem('sidebar_minimized', isMinimized ? 'on' : 'off')
  }, [isMinimized])

  const handleToggle = () => {
    setIsMinimized(prev => !prev)
  }

  return (
    <div className='app-sidebar-footer flex-column-auto pt-2 pb-6 px-6' id='kt_app_sidebar_footer'>
      {(minimizeEnabled || collapseEnabled) && (
        <button
          onClick={handleToggle}
          className={clsx(
            'btn btn-icon btn-primary overflow-hidden text-nowrap px-0 h-40px w-100'
          )}
        >
          <KTIcon
            iconName={isMinimized ? 'right' : 'left'}
            className='fs-1'
          />
        </button>
      )}
    </div>
  )
}
