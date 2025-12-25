import React, { useMemo } from 'react'
import { SidebarMenuItem } from './SidebarMenuItem'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { useAuth } from '../../../../../app/pages/Login'

const SidebarMenuMain: React.FC = React.memo(() => {
  const { auth } = useAuth()

  const menuTree = useMemo(() => {
    const flatMenus = auth?.Menu || []
    const map = new Map<number, any>()
    const roots: any[] = []

    flatMenus.forEach(m => map.set(m.MenuID, { ...m, Children: [] }))
    flatMenus.forEach(m => {
      if (m.ParentId) {
        const parent = map.get(m.ParentId)
        if (parent) parent.Children.push(map.get(m.MenuID))
        else roots.push(map.get(m.MenuID))
      } else {
        roots.push(map.get(m.MenuID))
      }
    })
    return roots
  }, [auth?.Menu]) // 👈 Chỉ re-render khi menu thay đổi

  const renderMenu = (menus: any[]): React.ReactNode =>
    menus.map(menu =>
      menu.Children.length > 0 ? (
        <SidebarMenuItemWithSub
          key={menu.MenuID}
          to={menu.MenuPath}
          icon={menu.Icon}
          title={menu.MenuName}
        >
          {renderMenu(menu.Children)}
        </SidebarMenuItemWithSub>
      ) : (
        <SidebarMenuItem
          key={menu.MenuID}
          to={menu.MenuPath}
          icon={menu.Icon}
          title={menu.MenuName}
        />
      )
    )

  return <>{renderMenu(menuTree)}</>
})

export { SidebarMenuMain }