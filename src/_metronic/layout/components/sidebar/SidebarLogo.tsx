import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../helpers'
const SidebarLogo = () => {
  return (
    <div className='app-sidebar-logo px-6' id='kt_app_sidebar_logo'>
      <Link to='/'>
        {(
          <>
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/logos/logo-ppl.png')}
              className='h-50px app-sidebar-logo-default theme-light-show'
            />
          </>
        )}

        <img
          alt='Logo'
          src={toAbsoluteUrl('media/logos/logo-ppl.png')}
          className='h-15px app-sidebar-logo-minimize'
        />
      </Link>
    </div>
  )
}

export { SidebarLogo }
