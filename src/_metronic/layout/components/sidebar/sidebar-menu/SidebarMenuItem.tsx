import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useLocation } from 'react-router'
import { checkIsActive, KTIcon } from '../../../../helpers'
import { useLayout } from '../../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const SidebarMenuItem: React.FC<Props> = ({ to, title, icon, fontIcon, hasBullet }) => {
  const { pathname } = useLocation()
  const isActive = checkIsActive(pathname, to)
  const { config } = useLayout()
  const { app } = config

  const [isSidebarMini, setIsSidebarMini] = useState(
    () => document.body.getAttribute('data-kt-app-sidebar-minimize') === 'on'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsSidebarMini(
        document.body.getAttribute('data-kt-app-sidebar-minimize') === 'on'
      )
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-kt-app-sidebar-minimize'] })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="menu-item">
        <a href={to} className={clsx('menu-link', { active: isActive })}>
          {icon && (
            <span
              className={clsx(
                'menu-icon mini-tooltip-container',
                app?.sidebar?.default?.menu?.iconType === 'svg' && 'has-icon'
              )}
            >
              <KTIcon iconName={icon} className="fs-2" />

              {isSidebarMini && (
                <span className="mini-tooltip">{title}</span>
              )}
            </span>
          )}

          <span className="menu-title">{title}</span>
        </a>
      </div>
    </>
  )
}

export { SidebarMenuItem }
