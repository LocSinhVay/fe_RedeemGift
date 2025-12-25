import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { useProjects } from "../../../../../hooks/useProjects";
import { OptionType } from "../../../../../components/models/CommonModels";
import { SearchableComboBox } from "../../../../../components/searchableComboBox/SearchableComboBox";
import { usePrizesByProject } from "../../../../../hooks/usePrizesByProject";
import { allowPositiveNumbersOnly } from "../../../../../hooks/allowPositiveNumbersOnly";

interface PrizesModalProps {
  show: boolean;
  onClose: () => void;
  prizes?: {
    PrizeID: number;
    ProjectCode: string;
    GiftID: number;
    Quantity: number;
    Weight: number;
    RemainingWeight: number;
  };
  onSave: (updatedData: any) => void;
}

const initialFormData = {
  PrizeID: 0,
  ProjectCode: "",
  GiftID: 0,
  Quantity: 0,
  Weight: 0,
  RemainingWeight: 0,
};

export const PrizesModal = ({
  show,
  onClose,
  prizes,
  onSave,
}: PrizesModalProps) => {
  // ✅ Lấy danh sách dự án có phân quyền
  const { visibleProjects, defaultProject, isAll } = useProjects(show);

  const [formData, setFormData] = useState(initialFormData);

  // ✅ Nếu không có quyền chọn nhiều dự án => set mặc định là defaultProject
  const [projectCode, setProjectCode] = useState<OptionType | null>(
    isAll
      ? { value: "", label: "Chọn dự án" }
      : defaultProject ?? { value: "", label: "Chọn dự án" }
  );

  const [GiftID, setGiftID] = useState<OptionType | null>({
    value: "",
    label: "Chọn giải thưởng",
  });

  // ✅ Lấy danh sách giải thưởng theo dự án đang chọn
  const prizesByProject = usePrizesByProject(formData.ProjectCode);

  const isEdit = useMemo(() => !!prizes, [prizes]);

  // ✅ Khi mở modal
  useEffect(() => {
    if (!show) return;

    if (prizes) {
      setFormData({ ...prizes });

      setProjectCode(
        visibleProjects.find((p) => p.value === prizes.ProjectCode) ||
        defaultProject
      );
    } else {
      setFormData({
        ...initialFormData,
        ProjectCode: String(defaultProject?.value || ""),
      });
      setProjectCode(
        isAll
          ? { value: "", label: "Chọn dự án" }
          : defaultProject ?? { value: "", label: "Chọn dự án" }
      );
      setGiftID({ value: "", label: "Chọn giải thưởng" });
    }
  }, [show, prizes, visibleProjects, defaultProject]);

  // ✅ Khi load xong danh sách giải thưởng => gán lại nếu đang edit
  useEffect(() => {
    if (isEdit && prizes && prizesByProject.length > 0) {
      setGiftID(
        prizesByProject.find((p) => p.value === prizes.GiftID) || {
          value: "",
          label: "Chọn giải thưởng",
        }
      );
    }
  }, [isEdit, prizes, prizesByProject]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWeightChange = (value: string) => {
    const cleanValue = allowPositiveNumbersOnly(value);
    const numericValue = Number(cleanValue.replace(/,/g, "")) || 0;

    // ✅ Tính giới hạn hợp lệ
    const maxAllowed = isEdit
      ? (formData.RemainingWeight ?? 0) + (prizes?.Weight ?? 0)
      : formData.RemainingWeight ?? 0;

    // ✅ Không cho vượt quá giới hạn
    if (numericValue > maxAllowed) return;

    handleChange("Weight", numericValue);
  };

  const handleSave = () => {
    if (!formData.ProjectCode) {
      alert("Vui lòng chọn dự án!");
      return;
    }
    if (!formData.GiftID || formData.GiftID === 0) {
      alert("Vui lòng chọn giải thưởng!");
      return;
    }
    if (!formData.Weight || formData.Weight <= 0) {
      alert("Vui lòng nhập tỷ trọng hợp lệ!");
      return;
    }

    onSave({ ...formData });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Cập nhật" : "Thêm"} Giải thưởng</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Row>
            {/* Cột trái: Dự án + Tồn kho */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Dự án</Form.Label>
                <SearchableComboBox
                  options={visibleProjects}
                  value={projectCode}
                  onChange={(selected) => {
                    const newProject = selected || defaultProject;
                    setProjectCode(newProject);
                    handleChange("ProjectCode", newProject?.value || "");

                    // reset các field liên quan khi đổi dự án
                    setGiftID({ value: "", label: "Chọn giải thưởng" });
                    handleChange("GiftID", 0);
                    handleChange("Quantity", 0);
                    handleChange("RemainingWeight", 0);
                  }}
                  includeAllOption={isAll}
                  width="100%"
                  isDisabled={!isAll} // nếu không có quyền chọn nhiều dự án thì khóa combobox
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Số lượng tồn kho</Form.Label>
                <Form.Control type="text" value={formData.Quantity} disabled />
              </Form.Group>
            </Col>

            {/* Cột phải: Giải thưởng + Tỷ trọng */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">Giải thưởng</Form.Label>
                <SearchableComboBox
                  options={prizesByProject}
                  value={GiftID}
                  onChange={(selected: any) => {
                    const newPrize =
                      selected || { value: "", label: "Chọn giải thưởng" };
                    setGiftID(newPrize);

                    handleChange("GiftID", newPrize.value);
                    handleChange("Quantity", newPrize.stockQuantity || 0);
                    handleChange(
                      "RemainingWeight",
                      newPrize.remainingWeight || 0
                    );
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="required fw-bold">
                  Tỷ trọng giải thưởng (%)
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tỷ trọng"
                  value={formData.Weight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                />
                {formData.GiftID > 0 && (
                  <p className="text-danger mb-0 mt-2 small">
                    * Tỷ trọng phải nhỏ hơn hoặc bằng{' '}
                    {isEdit
                      ? formData.RemainingWeight + (prizes?.Weight ?? 0)
                      : formData.RemainingWeight}
                    %
                  </p>
                )}
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
