import * as Yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { changePassword } from '../../../controllers/UserSystem/UserSystemController';
import Swal from 'sweetalert2';

const initialValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Vui lòng nhập Mật khẩu hiện tại'),
  newPassword: Yup.string().required('Vui lòng nhập Mật khẩu mới'),
  confirmPassword: Yup.string().required('Vui lòng Xác nhận mật khẩu'),
});

interface ChangePasswordProps {
  show: boolean;
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ show, onClose }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await changePassword(
          values.currentPassword,
          values.newPassword,
          values.confirmPassword,
          false
        );
        if (result.Status === 'Success') {
          Swal.fire({
            text: 'Đổi mật khẩu thành công.',
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
            text: `${result.Message || "Không thể đổi mật khẩu!"}`,
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
          text: 'Đã xảy ra lỗi khi thực hiện đổi mật khẩu. Vui lòng thử lại.',
          icon: 'warning',
          buttonsStyling: false,
          confirmButtonText: 'Đóng',
          customClass: {
            confirmButton: 'btn btn-warning',
          },
        });
      }
    }
  })

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu hiện tại</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              {...formik.getFieldProps('currentPassword')}
              isInvalid={!!formik.errors.currentPassword && formik.touched.currentPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.currentPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu mới"
              {...formik.getFieldProps('newPassword')}
              isInvalid={!!formik.errors.newPassword && formik.touched.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.newPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...formik.getFieldProps('confirmPassword')}
              isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting || !formik.isValid}>
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal >
  );
};

export { ChangePassword };
