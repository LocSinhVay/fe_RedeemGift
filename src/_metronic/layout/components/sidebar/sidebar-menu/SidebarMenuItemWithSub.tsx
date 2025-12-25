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

// Tách ra ngoài để tránh tạo lại mỗi lần render
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

  const [isOpen, setIsOpen] = useState(() =>
    !isSidebarMini && hasActiveChild(children, pathname)
  )

  const isChildActive = hasActiveChild(children, pathname)

  // Theo dõi thay đổi của attribute minimize
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const minimized = document.body.getAttribute('data-kt-app-sidebar-minimize') === 'on'
      setIsSidebarMini(minimized)
    })

    observer.observe(document.body, { attributes: true, attributeFilter: ['data-kt-app-sidebar-minimize'] })
    return () => observer.disconnect()
  }, [])

  // Cập nhật isOpen khi pathname hoặc sidebar thay đổi
  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true)
    } else if (!isSidebarMini) {
      setIsOpen(false)
    }
  }, [pathname, isSidebarMini, isChildActive])

  const handleClick = () => {
    if (isSidebarMini) {
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <div
      className={clsx('menu-item menu-accordion', {
        'here show': isSidebarMini ? isOpen : isChildActive,
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

        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}

        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}

        <span className='menu-title'>{title}</span>

        <span
          className={clsx('menu-arrow', {
            'rotate-180': isSidebarMini ? isOpen : isChildActive,
          })}
        ></span>
      </span>

      <div
        className={clsx('menu-sub menu-sub-accordion', {
          'menu-active-bg': isSidebarMini ? (isChildActive || isOpen) : isChildActive,
          'd-none': isSidebarMini && !isOpen && !isChildActive,
          'show': isSidebarMini && (isOpen || isChildActive),
        })}
      >
        {children}
      </div>
    </div>
  )
}

export { SidebarMenuItemWithSub }
