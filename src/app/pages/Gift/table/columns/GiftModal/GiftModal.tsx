import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useProjects } from "../../../../../hooks/useProjects";
import { OptionType } from "../../../../../components/models/CommonModels";
import { SearchableComboBox } from "../../../../../components/searchableComboBox/SearchableComboBox";
import { allowPositiveNumbersOnly } from "../../../../../hooks/allowPositiveNumbersOnly";

interface GiftModalProps {
  show: boolean;
  onClose: () => void;
  gift?: {
    GiftID: number;
    ProjectCode: string;
    GiftName: string;
    Quantity: number;
    IsUnlimited: boolean;
  };
  onSave: (updatedData: any) => void;
}

const initialFormData = {
  GiftID: 0,
  ProjectCode: "",
  GiftName: "",
  Quantity: 0,
  IsUnlimited: false,
};

export const GiftModal = ({ show, onClose, gift, onSave }: GiftModalProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const { visibleProjects, defaultProject, isAll } = useProjects(show);
  const [projectCode, setProjectCode] = useState<OptionType | null>({
    value: "",
    label: "Chọn dự án",
  });
  const quantityRef = useRef<HTMLInputElement>(null);
  const isEdit = !!gift;

  // 🔹 Khi modal mở -> set dữ liệu
  useEffect(() => {
    if (!show) return;

    if (isEdit && gift) {
      setFormData({ ...gift });
      const selected = visibleProjects.find((p) => p.value === gift.ProjectCode);
      setProjectCode(
        selected || { value: "", label: "Chọn dự án" }
      );
    } else {
      setFormData(initialFormData);
      // nếu user bị giới hạn -> auto set dự án mặc định
      if (!isAll && defaultProject) {
        setProjectCode(defaultProject);
        setFormData((prev) => ({
          ...prev,
          ProjectCode: String(defaultProject.value),
        }));
      } else {
        setProjectCode({ value: "", label: "Chọn dự án" });
      }
    }
  }, [show, gift, visibleProjects, defaultProject, isAll]);

  // 🔹 Số lượng (chỉ cho số dương)
  const handleNumberChange = (field: string, value: string) => {
    const cleanValue = allowPositiveNumbersOnly(value);
    setFormData((prev) => ({
      ...prev,
      [field]: Number(cleanValue.replace(/,/g, "")) || 0,
    }));
  };

  // 🔹 Change handler chung
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Khi tick “Không giới hạn”
  const handleUnlimitedChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      IsUnlimited: checked,
      Quantity: checked ? 0 : prev.Quantity,
    }));

    if (!checked) {
      setTimeout(() => quantityRef.current?.focus(), 100);
    }
  };

  // 🔹 Khi lưu
  const handleSave = () => {
    const dataToSave = {
      ...formData,
      Quantity: formData.IsUnlimited ? 0 : formData.Quantity,
    };
    onSave(dataToSave);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Cập nhật" : "Thêm"} Quà tặng</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>
          {/* --- Tên quà tặng --- */}
          <Form.Group className="mb-3">
            <Form.Label className="required fw-bold">Tên quà tặng</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên quà"
              value={formData.GiftName}
              onChange={(e) => handleChange("GiftName", e.target.value)}
            />
          </Form.Group>

          {/* --- Dự án --- */}
          <Form.Group className="mb-3">
            <Form.Label className="required fw-bold">Dự án</Form.Label>
            <SearchableComboBox
              options={visibleProjects}
              value={projectCode}
              onChange={(selected) => {
                const newProject = selected || { value: "", label: "Chọn dự án" };
                setProjectCode(newProject);
                handleChange("ProjectCode", newProject.value);
              }}
              includeAllOption={isAll}
              isDisabled={!isAll} // nếu không có quyền chọn nhiều dự án thì khóa luôn combobox
            />
          </Form.Group>

          {/* --- Số lượng + Không giới hạn --- */}
          <Form.Group className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <Form.Label className="required fw-bold mb-0">Số lượng</Form.Label>
              <Form.Check
                type="checkbox"
                id="isUnlimited"
                label={
                  <span style={{ fontWeight: 500, fontSize: "0.9rem", color: "#ec1212ff" }}>
                    Không giới hạn
                  </span>
                }
                checked={formData.IsUnlimited}
                onChange={(e) => handleUnlimitedChange(e.target.checked)}
              />
            </div>

            <Form.Control
              ref={quantityRef}
              type="text"
              placeholder="Nhập số lượng"
              value={formData.Quantity.toLocaleString("en-US")}
              onChange={(e) => handleNumberChange("Quantity", e.target.value)}
              disabled={formData.IsUnlimited}
              style={{
                backgroundColor: formData.IsUnlimited ? "#f3f3f3" : undefined,
                cursor: formData.IsUnlimited ? "not-allowed" : "text",
              }}
            />
          </Form.Group>
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
