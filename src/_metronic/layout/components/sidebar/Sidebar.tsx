/* eslint-disable no-prototype-builtins */
import React, { memo, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { ILayout, ISidebar, useLayout } from '../../core'
import { SidebarMenu } from './sidebar-menu/SidebarMenu'
import { SidebarFooter } from './SidebarFooter'
import { SidebarLogo } from './SidebarLogo'

const Sidebar = memo(() => {
  const { config } = useLayout()
  const prevSidebarConfig = useRef<ISidebar | null>(null)

  useEffect(() => {
    const currentSidebarConfig = config.app?.sidebar

    if (JSON.stringify(prevSidebarConfig.current) !== JSON.stringify(currentSidebarConfig)) {
      updateDOM(config)
      prevSidebarConfig.current = currentSidebarConfig || null
    }
  }, [config])

  if (!config.app?.sidebar?.display) {
    return null
  }

  return (
    <div
      id="kt_app_sidebar"
      className={clsx('app-sidebar', config.app?.sidebar?.default?.class)}
    >
      <SidebarLogo />
      <SidebarMenu />
      <SidebarFooter />
    </div>
  )
})

const updateDOM = (config: ILayout) => {
  // if (config.app?.sidebar?.default?.minimize?.desktop?.enabled) {
  //   if (config.app?.sidebar?.default?.minimize?.desktop?.default) {
  //     document.body.setAttribute('data-kt-app-sidebar-minimize', 'on')
  //   }
  // }

  // if (config.app?.sidebar?.default?.collapse?.desktop?.enabled) {
  //   if (config.app?.sidebar?.default?.collapse?.desktop?.default) {
  //     document.body.setAttribute('data-kt-app-sidebar-collapse', 'on')
  //   }
  // }

  // if (config.app?.sidebar?.default?.collapse?.mobile?.enabled) {
  //   if (config.app?.sidebar?.default?.collapse?.mobile?.default) {
  //     document.body.setAttribute('data-kt-app-sidebar-collapse-mobile', 'on')
  //   }
  // }

  // if (config.app?.sidebar?.default?.stacked) {
  //   document.body.setAttribute('app-sidebar-stacked', 'true')
  // }

  document.body.setAttribute('data-kt-app-sidebar-enabled', 'true')
  document.body.setAttribute(
    'data-kt-app-sidebar-fixed',
    config.app?.sidebar?.default?.fixed?.desktop?.toString() || ''
  )

  const appSidebarDefaultDrawerEnabled = config.app?.sidebar?.default?.drawer?.enabled
  const appSidebarDefaultDrawerAttributes =
    (appSidebarDefaultDrawerEnabled && (config.app?.sidebar?.default?.drawer?.attributes || {})) || {}

  // const appSidebarDefaultStickyEnabled = config.app?.sidebar?.default?.sticky?.enabled
  // const appSidebarDefaultStickyAttributes =
  //   (appSidebarDefaultStickyEnabled && (config.app?.sidebar?.default?.sticky?.attributes || {})) || {}

  // Cập nhật attributes cho sidebar element ngay lập tức (bỏ setTimeout để đồng bộ)
  const sidebarElement = document.getElementById('kt_app_sidebar')
  if (sidebarElement) {
    // Remove tất cả attribute data- trước đó
    const sidebarAttributes = sidebarElement.getAttributeNames().filter((attr) => attr.startsWith('data-'))
    sidebarAttributes.forEach((attr) => sidebarElement.removeAttribute(attr))

    // Gán lại các thuộc tính drawer nếu có
    if (appSidebarDefaultDrawerEnabled) {
      Object.entries(appSidebarDefaultDrawerAttributes).forEach(([key, value]) => {
        sidebarElement.setAttribute(key, value)
      })
    }

    // // Gán lại các thuộc tính sticky nếu có
    // if (appSidebarDefaultStickyEnabled) {
    //   Object.entries(appSidebarDefaultStickyAttributes).forEach(([key, value]) => {
    //     sidebarElement.setAttribute(key, value)
    //   })
    // }
  }
}

export { Sidebar }