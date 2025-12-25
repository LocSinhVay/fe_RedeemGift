import * as Yup from 'yup';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import { recoveryPassword } from '../../../controllers/Login/LoginController';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Vui lòng nhập Mật khẩu mới'),
  confirmPassword: Yup.string()
    .required('Vui lòng Xác nhận mật khẩu')
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
});

const initialValues = {
  newPassword: '',
  confirmPassword: '',
};

export function RecoveryPassword() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    const tokenParam = searchParams.get('token');

    if (userIdParam) setUserId(userIdParam);
    if (tokenParam) setToken(decodeURIComponent(tokenParam));
  }, [searchParams]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await recoveryPassword(userId, token, values.newPassword);

        if (result.Status === 'Success') {
          Swal.fire({
            text: 'Khôi phục mật khẩu thành công.',
            icon: 'success',
            confirmButtonText: 'Đăng nhập',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary fw-bold',
            },
          }).then(() => {
            window.location.href = '/auth';
          });
        } else {
          Swal.fire({
            text: `${result.Message || 'Không thể khôi phục mật khẩu!'}`,
            icon: 'error',
            confirmButtonText: 'Đóng',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-warning fw-bold',
            },
          });
        }
      } catch (error: any) {
        Swal.fire({
          text: 'Đã xảy ra lỗi khi khôi phục mật khẩu. Vui lòng thử lại.',
          icon: 'warning',
          confirmButtonText: 'Đóng',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-warning',
          },
        });
      }
    },
  });

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <form className="form bg-white p-5 shadow rounded" onSubmit={formik.handleSubmit} noValidate>
            <div className="text-center mb-11">
              <h1 className="text-gray-900 fw-bolder mb-3">Khôi phục mật khẩu</h1>
            </div>

            <div className="fv-row mb-8">
              <label className="form-label fs-6 fw-bolder text-gray-900">Mật khẩu mới</label>
              <input
                type="password"
                className={`form-control form-control-lg form-control-solid ${formik.touched.newPassword && (formik.errors.newPassword ? 'is-invalid' : 'is-valid')}`}
                {...formik.getFieldProps('newPassword')}
                placeholder="Nhập mật khẩu mới"
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="invalid-feedback">{formik.errors.newPassword}</div>
              )}
            </div>

            <div className="fv-row mb-8">
              <label className="form-label fs-6 fw-bolder text-gray-900">Xác nhận mật khẩu</label>
              <input
                type="password"
                className={`form-control form-control-lg form-control-solid ${formik.touched.confirmPassword && (formik.errors.confirmPassword ? 'is-invalid' : 'is-valid')}`}
                {...formik.getFieldProps('confirmPassword')}
                placeholder="Xác nhận lại mật khẩu"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
              )}
            </div>

            <div className="d-grid mb-10">
              <button type="submit" className="btn btn-primary">
                Khôi phục mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
