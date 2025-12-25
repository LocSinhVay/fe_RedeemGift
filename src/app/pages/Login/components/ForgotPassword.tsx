import { useState } from 'react';
import * as Yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { sendRequestReset } from '../../../controllers/Login/LoginController';

const initialValues = {
  email: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Sai định dạng mail')
    .required('Bắt buộc nhập Email'),
});

interface ForgotPasswordProps {
  show: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await sendRequestReset(
          values.email,
        );
        if (result.Status === 'Success') {
          Swal.fire({
            text: 'Yêu cầu khôi phục mật khẩu đã được tiếp nhận. Vui lòng kiểm tra e-mail và thực hiện theo hướng dẫn.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Đóng',
            customClass: {
              confirmButton: 'btn fw-bold btn-primary',
            },
          });
          onClose();
        } else {
          Swal.fire({
            text: `${result.Message || "Không thể gửi yêu cầu!"}`,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Đóng",
            customClass: {
              confirmButton: "btn fw-bold btn-warning",
            },
          });
        }
      } catch (error: any) {
        Swal.fire({
          text: 'Đã xảy ra lỗi khi gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại.',
          icon: 'warning',
          buttonsStyling: false,
          confirmButtonText: 'Đóng',
          customClass: {
            confirmButton: 'btn btn-warning',
          },
        });
      }
      setLoading(false);
    }
  })

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="border-0 flex-column align-items-center">
        <Modal.Title className="w-100 text-center fw-bold fs-3 mb-2">
          Quên mật khẩu ?
        </Modal.Title>
        <div className="separator separator-content my-4 w-100">
          <span className="text-muted text-nowrap">
            Nhập vào e-mail khôi phục mật khẩu
          </span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Control
              type="email"
              placeholder="Email"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent rounded px-4 py-3',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                { 'is-valid': formik.touched.email && !formik.errors.email }
              )}
            />
            <Form.Control.Feedback type="invalid">
              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.email}</span>
                  </div>
                </div>
              )}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="light"
              onClick={onClose}
              className="px-4 border"
              disabled={loading}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="px-4"
            >
              {!loading ? 'Gửi' : 'Vui lòng chờ...'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export { ForgotPassword };
