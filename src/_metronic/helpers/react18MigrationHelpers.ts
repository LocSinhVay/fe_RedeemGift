import { ReactNode } from 'react'
import { MenuComponent, ScrollComponent } from '../assets/ts/components'

type WithChildren = {
  children?: ReactNode
}

const reInitMenu = () => {
  setTimeout(() => {
    MenuComponent.reinitialization()
  }, 300)
}

const reInitScroll = () => {
  setTimeout(() => {
    const el = document.querySelector('#kt_app_sidebar_menu_wrapper') as HTMLElement
    if (!el) return

    const scroll = ScrollComponent.getInstance(el)
    scroll ? scroll.update() : ScrollComponent.createInstances('[data-kt-scroll="true"]')
  }, 300)
}

export { type WithChildren, reInitMenu, reInitScroll }
