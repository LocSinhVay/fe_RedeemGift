
import { FC, useState } from 'react'
import { useAuth } from '../../../../app/pages/Login'
import { ChangePassword } from '../../../../app/pages/Login/components/ChangePassword'

const HeaderUserMenu: FC = () => {
  const { auth, logout } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false) // State quản lý modal
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='UserAvatar' src={auth?.AvatarImage} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {auth?.FullName}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {auth?.Username} <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>{auth?.RoleName}</span>
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>
      <div className='menu-item px-5'>
        <a onClick={() => setShowChangePassword(true)} className='menu-link px-5'>
          Đổi mật khẩu
        </a>
      </div>
      {/* Modal ChangePassword */}
      {showChangePassword && <ChangePassword show={showChangePassword} onClose={() => setShowChangePassword(false)} />}
      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Đăng xuất
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
