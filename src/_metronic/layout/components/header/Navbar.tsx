import clsx from 'clsx'
import { HeaderUserMenu } from '../../../partials'
import { useAuth } from '../../../../app/pages/Login'
import { ProjectSelector } from '../../../../app/pages/Login/core/ProjectSelector'

const itemClass = 'ms-1 ms-md-4'
const userAvatarClass = 'symbol-35px'

const Navbar = () => {
  const { auth } = useAuth()
  return (
    <div className='app-navbar flex-shrink-0'>
      <div className={clsx('app-navbar-item', itemClass)}>
        <div className='app-navbar-item me-3'>
          <ProjectSelector />
        </div>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img alt='UserAvatar' src={auth?.AvatarImage} />
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  )
}

export { Navbar }
