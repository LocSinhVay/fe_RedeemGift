import { useState } from 'react'
import { RoleModal } from './RoleModal/RoleModal'
import { useQueryResponse } from '../../../../services/QueryResponseProvider';
import { updateRole } from '../../../../controllers/Role/RoleController';
import Swal from 'sweetalert2';

export const RoleCell: React.FC<any> = ({ namespace, role }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer text-primary hover:underline"
      >
        {role.RoleName}
      </span>

      {showModal && (
        <RoleModal
          show={showModal}
          onClose={() => setShowModal(false)}
          role={role}
          onSave={handleUpdate}
        />
      )}
    </>
  )
}
