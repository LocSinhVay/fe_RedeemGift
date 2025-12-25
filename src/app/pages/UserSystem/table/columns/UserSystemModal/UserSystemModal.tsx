import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useRoles } from "../../../../../hooks/useRoles";
import { getNewUsername } from "../../../../../controllers/UserSystem/UserSystemController";
import { SearchableComboBox } from "../../../../../components/searchableComboBox/SearchableComboBox";
import { OptionType, RoleOption } from "../../../../../components/models/CommonModels";
import { useProjects } from "../../../../../hooks/useProjects";
import { allowPositiveNumbersOnly } from "../../../../../hooks/allowPositiveNumbersOnly";
import { SearchableMultiComboBox } from "../../../../../components/searchableMultiComboBox/SearchableMultiComboBox";

type UserSystemModalProps = {
  show: boolean;
  onClose: () => void;
  user?: {
    AvatarImage: string;
    UserAvatar: string;
    FullName: string;
    Username: string;
    Email: string;
    Phone: string;
    Status: number;
    RoleID: number;
    RoleName: string;
    UserID: number;
    ProjectCodes: string;
  };
  onSave: (updatedUser: any) => void;
};

const initialFormData = {
  UserID: 0,
  AvatarImage: "",
  UserAvatar: "",
  FullName: "",
  Username: "",
  Email: "",
  Phone: "",
  Status: 1,
  RoleID: 1,
  ProjectCodes: "",
};

export const UserSystemModal = ({ show, onClose, user, onSave }: UserSystemModalProps) => {
  const roles = useRoles(show);
  const { visibleProjects, defaultProject } = useProjects(show);

  const [roleID, setRoleID] = useState<RoleOption | null>(null);
  const [projectCodes, setProjectCodes] = useState<OptionType[]>([]); // ✅ nhiều dự án
  const [formData, setFormData] = useState(initialFormData);
  const [AvatarFile, setAvatarFile] = useState<File | null>(null);

  const isEdit = !!user;

  /** ✅ Load dữ liệu ban đầu */
  useEffect(() => {
    if (!show) return;
    if (!roles.length || !visibleProjects.length) return;

    const initData = async () => {
      if (isEdit && user) {
        setFormData({ ...initialFormData, ...user });

        const selectedRole = roles.find((p) => Number(p.value) === user.RoleID);
        if (selectedRole) setRoleID(selectedRole);

        // Tách nhiều dự án từ ProjectCode (ngăn cách bằng dấu phẩy)
        const userProjects = user.ProjectCodes
          ? user.ProjectCodes.split(",").map((code) => {
            const found = visibleProjects.find(
              (p) => String(p.value).trim() === String(code).trim()
            );
            return found || { value: code, label: code };
          })
          : [];
        setProjectCodes(userProjects);
      } else if (!isEdit && roles.length > 0) {
        const defaultRole = roles[0];
        setRoleID(defaultRole);

        const newForm = {
          ...initialFormData,
          RoleID: Number(defaultRole.value),
          ProjectCode: String(defaultProject?.value || ""),
        };

        try {
          const res = await getNewUsername(defaultRole.symbol as string);
          newForm.Username = res.Data;
        } catch (err) {
          console.error("getNewUsername error:", err);
        }

        setFormData(newForm);
        setProjectCodes(defaultProject ? [defaultProject] : []);
      }
    };

    initData();
  }, [show, user, roles, visibleProjects, defaultProject]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleChange("AvatarImage", imageUrl);
      handleChange("UserAvatar", file.name);
      setAvatarFile(file);
    }
  };

  useEffect(() => {
    const updateUsernameOnRoleChange = async () => {
      if (!roleID?.symbol || !show) return;

      if (!isEdit) {
        try {
          const res = await getNewUsername(roleID.symbol as string);
          setFormData((prev) => ({
            ...prev,
            Username: res.Data,
            RoleID: Number(roleID.value),
          }));
        } catch (err) {
          console.error("getNewUsername error:", err);
        }
      } else {
        setFormData((prev) => {
          const oldUsername = prev.Username || "";
          const parts = oldUsername.split("_");
          const suffix = parts.length > 1 ? parts[1] : "";
          const prefix = roleID?.symbol || parts[0] || "";
          return {
            ...prev,
            Username: `${prefix}_${suffix}`,
            RoleID: Number(roleID?.value || prev.RoleID),
          };
        });
      }
    };

    updateUsernameOnRoleChange();
  }, [roleID]);

  const showProject = Number(roleID?.value) !== 1;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Chỉnh sửa" : "Thêm mới"} User System</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          {/* Ảnh đại diện */}
          <div>
            <label className="d-block fw-semibold fs-6 mb-5">Ảnh đại diện</label>
            <div className="image-input image-input-outline" id="data-kt-image-input" data-kt-image-input="true">
              <div
                id="imgUserAvatar"
                className="image-input-wrapper"
                style={{
                  backgroundImage: `url(${formData.AvatarImage || "/media/avatars/blank.png"})`,
                  backgroundSize: "cover",
                }}
              ></div>

              <label
                className="btn btn-icon btn-circle btn-active-color-primary bg-body shadow"
                data-kt-image-input-action="change"
                title="Thay đổi avatar"
              >
                <i className="ki-outline ki-pencil fs-7"></i>
                <input type="file" accept=".png, .jpg, .jpeg" onChange={handleAvatarChange} />
              </label>

              {formData.AvatarImage && (
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  title="Xóa avatar"
                  onClick={() => handleChange("AvatarImage", "")}
                >
                  <i className="ki-outline ki-cross fs-2"></i>
                </span>
              )}
            </div>
            <div className="form-text">Allowed file types: png, jpg, jpeg.</div>
          </div>

          {/* Role */}
          <div>
            <label className="required d-block mb-2 fw-bold">Phân quyền</label>
            <SearchableComboBox
              options={roles}
              value={roleID}
              onChange={(selectedOption) => {
                const roleOpt = selectedOption as RoleOption | null;
                setRoleID(roleOpt);
                handleChange("RoleID", Number(roleOpt?.value || 0));
              }}
            />
          </div>

          {/* Project (multi-select) */}
          {showProject && (
            <div>
              <label className="d-block mb-2 fw-bold">Dự án</label>
              <SearchableMultiComboBox
                options={visibleProjects}
                value={projectCodes}
                onChange={setProjectCodes}
              />
            </div>
          )}

          {/* Username */}
          <div>
            <label className="required d-block mb-2 fw-bold">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="form-control form-control-lg form-control-solid"
              value={formData.Username}
              readOnly
            />
          </div>

          {/* Full name */}
          <div>
            <label className="required d-block mb-2 fw-bold">Họ và tên</label>
            <input
              type="text"
              placeholder="Họ và tên"
              className="form-control form-control-lg form-control-solid"
              value={formData.FullName}
              onChange={(e) => handleChange("FullName", e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="d-block mb-2 fw-bold">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="form-control form-control-lg form-control-solid"
              value={formData.Email}
              onChange={(e) => handleChange("Email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="d-block mb-2 fw-bold">Số điện thoại</label>
            <input
              type="text"
              placeholder="Phone"
              className="form-control form-control-lg form-control-solid"
              value={formData.Phone}
              onChange={(e) => handleChange("Phone", allowPositiveNumbersOnly(e.target.value, "phone"))}
            />
          </div>

          {/* Status */}
          <div>
            <label className="form-check form-switch form-check-custom form-check-solid mb-2">
              <span className="d-block fw-bold me-10">Kích hoạt</span>
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.Status === 1}
                onChange={(e) => handleChange("Status", e.target.checked ? 1 : 0)}
              />
            </label>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            onSave({
              ...formData,
              ProjectCodes: showProject
                ? projectCodes.map((p) => p.value).join(",")
                : "",
              AvatarFile,
            })
          }
        >
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
