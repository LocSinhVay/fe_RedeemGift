import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

interface ProjectModalProps {
  show: boolean;
  onClose: () => void;
  project?: {
    ProjectID: number;
    ProjectCode: string;
    ProjectName: string;
  };
  onSave: (updatedData: any) => void;
}

const initialFormData = {
  ProjectID: 0,
  ProjectCode: '',
  ProjectName: '',
};

export const ProjectModal = ({ show, onClose, project, onSave }: ProjectModalProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const isEdit = !!project;

  useEffect(() => {
    if (!show) return;

    if (isEdit && project) {
      setFormData({ ...project });
    } else {
      setFormData(initialFormData);
    }
  }, [show, project]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Cập nhật" : "Thêm"} Dự án</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="required fw-bold">Mã Dự án</Form.Label>
            <Form.Control
              type="text"
              placeholder="Mã dự án"
              value={formData.ProjectCode}
              onChange={(e) => handleChange("ProjectCode", e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="required fw-bold">Tên Dự án</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên dự án"
              value={formData.ProjectName}
              onChange={(e) => handleChange("ProjectName", e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => onSave(formData)}>
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};