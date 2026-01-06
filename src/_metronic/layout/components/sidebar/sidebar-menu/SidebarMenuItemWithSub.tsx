import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useLocation } from 'react-router'
import { checkIsActive, KTIcon, WithChildren } from '../../../../helpers'
import { useLayout } from '../../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

// Kiểm tra active sub menu
const hasActiveChild = (children: React.ReactNode, pathname: string): boolean => {
  return React.Children.toArray(children).some((child): child is React.ReactElement => {
    if (React.isValidElement(child)) {
      const childTo = child.props.to
      if (childTo && typeof childTo === 'string') {
        return checkIsActive(pathname, childTo)
      }
      if (child.props.children) {
        return hasActiveChild(child.props.children, pathname)
      }
    }
    return false
  })
}

const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
}) => {
  const { pathname } = useLocation()
  const { config } = useLayout()
  const { app } = config

  const [isSidebarMini, setIsSidebarMini] = useState(
    () => document.body.getAttribute('data-kt-app-sidebar-minimize') === 'on'
  )

  const isChildActive = hasActiveChild(children, pathname)

  // OPEN STATE ────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(() => {
    if (!isSidebarMini) return isChildActive // normal mode → mở theo active
    return false // minimized → phải click mới mở
  })

  // Theo dõi toggle minimize
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const minimized = document.body.getAttribute('data-kt-app-sidebar-minimize') === 'on'
      setIsSidebarMini(minimized)

      if (!minimized) {
        // khi mở rộng → tự mở menu active
        setIsOpen(isChildActive)
      }
    })

    observer.observe(document.body, { attributes: true, attributeFilter: ['data-kt-app-sidebar-minimize'] })
    return () => observer.disconnect()
  }, [isChildActive])

  // Click menu parent
  const handleClick = () => {
    if (isSidebarMini) {
      // ❗ minimized → luôn toggle
      setIsOpen(prev => !prev)
    }
  }

  return (
    <>
      <div
        className={clsx('menu-item menu-accordion', {
          'here show': !isSidebarMini && isChildActive,
          'menu-open': isSidebarMini && isOpen,
        })}
        {...(!isSidebarMini && { 'data-kt-menu-trigger': 'click' })}
        onClick={handleClick}
      >
        <span className='menu-link'>
          {hasBullet && (
            <span className='menu-bullet'>
              <span className='bullet bullet-dot'></span>
            </span>
          )}

          {/* ICON + TOOLTIP MINI */}
          {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
            <span className="menu-icon mini-tooltip-container">
              <KTIcon iconName={icon} className="fs-2" />

              {isSidebarMini && <span className="mini-tooltip">{title}</span>}
            </span>
          )}

          <span className='menu-title'>{title}</span>

          <span
            className={clsx('menu-arrow', {
              'rotate-180': (!isSidebarMini && isChildActive) || (isSidebarMini && isOpen),
            })}
          ></span>
        </span>

        {/* SUB MENU */}
        <div
          className={clsx('menu-sub menu-sub-accordion', {
            show: (!isSidebarMini && isChildActive) || (isSidebarMini && isOpen),
            'd-none': isSidebarMini && !isOpen,
          })}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export { SidebarMenuItemWithSub }
