import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { FooterWrapper } from '../../../_metronic/layout/components/footer'
import { Login } from './components/Login'

const AuthLayout = () => {
  // const [showLogin, setShowLogin] = useState(false) // State quản lý modal
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <div
        className="container-fluid bg-white border-bottom py-3"
        style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="d-flex justify-content-between align-items-center mx-auto">
          <a className="d-flex align-items-center" href="/">
            <img src="/media/logos/logo-ppl.png" alt="Logo" height={40} className="me-3" />
          </a>

          <div className="d-flex align-items-center gap-4 me-10">
            <a href="http://www.peoplelinkvietnam.com/" className="text-dark fw-semibold text-decoration-none" target="_blank">
              <i className="fa fa-cubes me-1"></i> About Us
            </a>
            <a href="http://www.peoplelinkvietnam.com/clients/" className="text-dark fw-semibold text-decoration-none" target="_blank">
              <i className="fa fa-users me-1"></i> Customers
            </a>
            <a href="https://www.peoplelinkvietnam.com/en/contact-us" className="text-dark fw-semibold text-decoration-none" target="_blank">
              <i className="fa fa-map-marker me-1"></i> Contact Us
            </a>
            {/* <button className="btn btn-primary fw-bold px-4" onClick={() => setShowLogin(true)}>
              Đăng nhập
            </button> */}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center w-100 p-10">
        <div className="w-lg-500px p-10">
          <Outlet />
        </div>
      </div>

      {/* Footer luôn nằm sát đáy */}
      <FooterWrapper />


      {/* Modal đăng nhập */}
      {/* {showLogin && <Login show={showLogin} onClose={() => setShowLogin(false)} />} */}
    </div>
  )
}

export { AuthLayout }
