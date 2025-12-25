import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useAuth } from '../core/Auth'
import { login } from '../../../controllers/Login/LoginController'
import { ForgotPassword } from './ForgotPassword'

const initialValues = {
  username: '',
  password: '',
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Vui lòng nhập Username'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
})

export function Login() {
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { saveAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // ⚡ Bắt state noMenu từ Navigate (chỉ dùng 1 lần)
  const [noMenu, setNoMenu] = useState(
    (location.state as { noMenu?: boolean })?.noMenu || false
  )

  useEffect(() => {
    if (noMenu) {
      // xoá state khỏi history để refresh không còn hiện nữa
      window.history.replaceState({}, document.title, location.pathname)
    }
  }, [noMenu, location.pathname])

  // Reset status khi user nhập lại
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formik.status) formik.setStatus(undefined)
    if (noMenu) setNoMenu(false)
    formik.handleChange(e)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setNoMenu(false)
      try {
        const user = await login(values.username, values.password)
        if (user.Data && user.Data.Token) {
          // saveAuth(user.Data)
          // 👉 Xử lý ProjectCodes
          const projectCodes = (user.Data.ProjectCodes || '')
            .split(',')
            .map((p: string) => p.trim())
            .filter(Boolean)

          // Dự án mặc định
          let selectedProject = null
          if (projectCodes.length === 1) {
            selectedProject = projectCodes[0]
          } else if (projectCodes.length > 1) {
            selectedProject = projectCodes[0] // mặc định lấy đầu tiên
          }

          saveAuth({
            ...user.Data,
            ProjectCodes: projectCodes,
            SelectedProject: selectedProject,
          })
          navigate('/', { replace: true })
        } else {
          setStatus(user.Message)
        }
      } catch (error) {
        console.error(error)
        saveAuth(null)
      } finally {
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <form
          className="form bg-white p-5 shadow rounded"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="text-center mb-11">
            <h1 className="text-gray-900 fw-bolder mb-3">Đăng nhập tài khoản</h1>
          </div>

          {/* ⚡ Cảnh báo khi tài khoản chưa có menu (hiện 1 lần) */}
          {noMenu && (
            <div className="alert alert-warning mb-5">
              Tài khoản của bạn chưa được cấp menu nào.<br />
              Vui lòng liên hệ quản trị viên để được phân quyền.
            </div>
          )}

          <div className="fv-row mb-8">
            <label className="form-label fs-6 fw-bolder text-gray-900">Username</label>
            <input
              type="text"
              className={`form-control form-control-lg form-control-solid ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''
                }`}
              placeholder="Nhập Username"
              {...formik.getFieldProps('username')}
              onChange={handleChange}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="invalid-feedback d-block">{formik.errors.username}</div>
            )}
          </div>

          <div className="fv-row mb-8">
            <label className="form-label fs-6 fw-bolder text-gray-900">Mật khẩu</label>
            <input
              type="password"
              className={`form-control form-control-lg form-control-solid ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                }`}
              placeholder="Nhập mật khẩu"
              {...formik.getFieldProps('password')}
              onChange={handleChange}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback d-block">{formik.errors.password}</div>
            )}
          </div>

          {formik.status && (
            <div className="text-danger mb-3">{formik.status}</div>
          )}

          <div className="d-grid mb-10">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!loading ? 'Đăng nhập' : 'Vui lòng chờ...'}
            </button>
          </div>

          <div className="text-end">
            <a href="#" onClick={() => setShowForgotPassword(true)}>
              Quên mật khẩu?
            </a>
          </div>
        </form>

        {/* ForgotPassword Modal */}
        {showForgotPassword && (
          <ForgotPassword
            show={showForgotPassword}
            onClose={() => setShowForgotPassword(false)}
          />
        )}
      </div>
    </div>
  )
}
