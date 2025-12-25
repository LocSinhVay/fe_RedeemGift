import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useProjects } from "../../../../../hooks/useProjects";
import { OptionType } from "../../../../../components/models/CommonModels";
import { allowPositiveNumbersOnly } from "../../../../../hooks/allowPositiveNumbersOnly";
import { SearchableComboBox } from "../../../../../components/searchableComboBox/SearchableComboBox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../../../../hooks/formatDate";

interface RedeemSpinModalProps {
  show: boolean;
  onClose: () => void;
  redeemSpin?: {
    RuleID: number;
    ProjectCode: string;
    BillValuePerSpin: number;
    MaxSpinsPerBill: number;
    StartDate: Date;
    EndDate: Date;
  };
  onSave: (updatedData: any) => void;
}

const initialFormData = {
  RuleID: 0,
  ProjectCode: "",
  BillValuePerSpin: 0,
  MaxSpinsPerBill: 0,
  StartDate: new Date(),
  EndDate: new Date(),
};

export const RedeemSpinModal = ({
  show,
  onClose,
  redeemSpin,
  onSave,
}: RedeemSpinModalProps) => {
  const { visibleProjects, defaultProject, isAll } = useProjects(show);

  const [formData, setFormData] = useState(initialFormData);
  // ✅ Dự án lọc (nếu không isAll thì set mặc định)
  const [projectCode, setProjectCode] = useState<OptionType | null>(
    isAll
      ? { value: '', label: 'Chọn dự án' }
      : defaultProject ?? { value: '', label: 'Chọn dự án' }
  )

  const isEdit = useMemo(() => !!redeemSpin, [redeemSpin]);

  useEffect(() => {
    if (!show) return;

    if (redeemSpin) {
      setFormData({
        ...redeemSpin,
        StartDate: new Date(redeemSpin.StartDate),
        EndDate: new Date(redeemSpin.EndDate),
      });
      setProjectCode(
        visibleProjects.find((p) => p.value === redeemSpin.ProjectCode) ||
        defaultProject
      );
    } else {
      // reset
      setFormData((prev) => ({
        ...initialFormData,
        ProjectCode: String(defaultProject?.value || ""),
      }));
      setProjectCode(
        isAll
          ? { value: '', label: 'Chọn dự án' }
          : defaultProject ?? { value: '', label: 'Chọn dự án' }
      );
    }
  }, [show, redeemSpin, visibleProjects, defaultProject]);

  const handleNumberChange = (
    field: "BillValuePerSpin" | "MaxSpinsPerBill",
    value: string
  ) => {
    const cleanValue = allowPositiveNumbersOnly(value);
    setFormData((prev) => ({
      ...prev,
      [field]: Number(cleanValue.replace(/,/g, "")) || 0,
    }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      StartDate: formatDate(formData.StartDate, "api"),
      EndDate: formatDate(formData.EndDate, "api"),
    });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Cập nhật" : "Thêm"} Tỷ lệ quy đổi</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label className="required fw-bold">Dự án</Form.Label>
              <SearchableComboBox
                options={visibleProjects}
                value={projectCode}
                onChange={(selected) => {
                  const newProject = selected || defaultProject;
                  setProjectCode(newProject);
                  handleChange("ProjectCode", newProject?.value || "");
                }}
                includeAllOption={isAll}
                width="100%"
                isDisabled={!isAll} // nếu không có quyền chọn nhiều dự án thì khóa luôn combobox
              />
            </Form.Group>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">
                  Giá trị (VNĐ)
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Giá trị"
                  value={formData.BillValuePerSpin.toLocaleString("en-US")}
                  onChange={(e) =>
                    handleNumberChange("BillValuePerSpin", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Từ ngày</Form.Label>
                <div className="position-relative">
                  <DatePicker
                    selected={formData.StartDate}
                    placeholderText="Từ ngày"
                    onChange={(date) => handleChange("StartDate", date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                  <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                    <i className="ki-duotone ki-calendar fs-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Số lượt quay</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Số lượt quay tối đa"
                  value={formData.MaxSpinsPerBill.toLocaleString("en-US")}
                  onChange={(e) =>
                    handleNumberChange("MaxSpinsPerBill", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Đến ngày</Form.Label>
                <div className="position-relative">
                  <DatePicker
                    selected={formData.EndDate}
                    placeholderText="Đến ngày"
                    onChange={(date) => handleChange("EndDate", date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                  <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                    <i className="ki-duotone ki-calendar fs-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
