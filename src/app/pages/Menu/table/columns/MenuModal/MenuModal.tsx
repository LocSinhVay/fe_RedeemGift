import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { SearchableComboBox } from "../../../../../components/searchableComboBox/SearchableComboBox";
import { useMenus } from "../../../../../hooks/useMenus";
import { OptionType } from "../../../../../components/models/CommonModels";

interface MenuModalProps {
  show: boolean;
  onClose: () => void;
  menu?: {
    MenuID: number;
    MenuName: string;
    MenuPath: string;
    Icon: string;
    ParentId: number;
    MenuParentName: string;
    Status: number;
    DisplayOrder: number;
  };
  onSave: (updatedMenu: any) => void;
}

const initialFormData = {
  MenuID: 0,
  MenuName: "",
  MenuPath: "",
  Icon: "",
  ParentId: 0,
  Status: 1,
  DisplayOrder: null as number | null,
};

export const MenuModal = ({ show, onClose, menu, onSave }: MenuModalProps) => {
  const menus = useMenus(show);
  const [formData, setFormData] = useState(initialFormData);
  const [parentId, setParentId] = useState<OptionType | null>({
    value: "",
    label: "Chọn menu cha",
  });

  const isEdit = !!menu;

  useEffect(() => {
    if (!show) return;

    if (menu) {
      setFormData({ ...menu });

      const selectedParent =
        menus.find(p => Number(p.value) === menu.ParentId) ||
        { value: "", label: "--" };
      setParentId(selectedParent);
    } else {
      setFormData(initialFormData);
    }
  }, [show, menu, menus]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredMenus = useMemo(() => {
    if (!menus) return [];
    return menu?.MenuID ? menus.filter(m => Number(m.value) !== menu.MenuID) : menus;
  }, [menus, menu]);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Cập nhật" : "Thêm"} Menu</Modal.Title>
      </Modal.Header>

      <Form>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="required fw-bold">Tên menu</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên menu"
              value={formData.MenuName}
              onChange={(e) => handleChange("MenuName", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Đường dẫn</Form.Label>
            <Form.Control
              type="text"
              placeholder="Đường dẫn"
              value={formData.MenuPath}
              onChange={(e) => handleChange("MenuPath", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Icon</Form.Label>
            <Form.Control
              type="text"
              placeholder="Icon"
              value={formData.Icon}
              onChange={(e) => handleChange("Icon", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Thuộc menu</Form.Label>
            <SearchableComboBox
              options={[
                { value: "", label: "--" },
                ...filteredMenus,
              ]}
              value={parentId}
              onChange={(selected) => {
                const newValue = selected?.value ?? null;
                setParentId(selected);
                handleChange("ParentId", newValue);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Thứ tự</Form.Label>
            <Form.Control
              type="number"
              placeholder="Thứ tự"
              min={1}
              step={1}
              value={formData.DisplayOrder ?? ""}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                handleChange("DisplayOrder", val > 0 ? val : null);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label className="fw-bold me-5">Kích hoạt</Form.Label>
            <Form.Check
              type="switch"
              checked={formData.Status === 1}
              onChange={(e) => handleChange("Status", e.target.checked ? 1 : 0)}
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
