import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers/components/KTIcon";
import Swal from "sweetalert2";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { RoleModal } from "./RoleModal/RoleModal";
import { deleteRole, updateRole } from "../../../../controllers/Role/RoleController";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";

const ActionsCell: FC<any> = ({ namespace, role }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const handleAction = async (message: string) => {
    const { value } = await Swal.fire({
      text: `Bạn có chắc chắn muốn ${message} quyền này không?`,
      icon: "question",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Không",
      customClass: {
        confirmButton: "btn fw-bold btn-danger",
        cancelButton: "btn fw-bold btn-active-light-primary",
      },
    });

    if (!value) return;

    try {
      let result = await deleteRole(role.RoleID);

      if (result.Status === "Success") {
        Swal.fire({
          text: `${message} thành công!`,
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Đóng",
          customClass: { confirmButton: "btn fw-bold btn-primary" },
        });
        refetch();
      } else {
        Swal.fire({
          text: result.Message,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Đóng",
          customClass: { confirmButton: "btn fw-bold btn-warning" },
        });
      }
    } catch (error) {
      Swal.fire({
        text: `Đã xảy ra lỗi khi ${message}. Vui lòng thử lại!`,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: { confirmButton: "btn fw-bold btn-danger" },
      });
    }
  };

  const handleUpdate = async (updatedData: {
    RoleName: string;
    Symbol: string;
    IsActive: boolean;
    MenuIds: number[];
    AllMenus: {
      MenuID: number;
      MenuName: string;
      ParentId: number | null;
      IsChecked: boolean;
    }[];
  }) => {
    const { RoleName, Symbol, IsActive, MenuIds, AllMenus } = updatedData;

    const roleMenuList = AllMenus.map(menu => ({
      RoleID: role.RoleID,
      MenuID: menu.MenuID,
      IsChecked: MenuIds.includes(menu.MenuID),
    }));

    const response = await updateRole({
      RoleID: role.RoleID,
      RoleName,
      Symbol,
      Status: IsActive ? 1 : 0,
      listRoleMenu: roleMenuList,
    });

    if (response.Status === "Success" || response === 1) {
      await Swal.fire({
        text: "Cập nhật thành công!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: { confirmButton: "btn fw-bold btn-primary" },
      });
      setShowModal(false);
      refetch();
    } else {
      Swal.fire({
        text: `${response.Message || "Không thể cập nhật dữ liệu!"}`,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: { confirmButton: "btn fw-bold btn-warning" },
      });
    }
  };

  const actionList = [
    { label: "Xem", action: () => setShowModal(true) },
    { label: "Xóa", action: () => handleAction("Xóa") },
  ];

  return (
    <>
      <div className="dropdown">
        <a
          className="btn btn-light btn-active-light-primary btn-sm"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          Thao tác
          <KTIcon iconName="down" className="fs-5 m-0" />
        </a>

        {/* Menu thả xuống */}
        <div
          className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
          data-kt-menu="true"
        >
          {actionList.map((item, index) => (
            <div className="menu-item px-3" key={index}>
              <a className="menu-link px-3" onClick={item.action}>
                {item.label}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <RoleModal
          show={showModal}
          onClose={() => setShowModal(false)}
          role={role}
          onSave={handleUpdate}
        />
      )}
    </>
  );
};

export { ActionsCell };
