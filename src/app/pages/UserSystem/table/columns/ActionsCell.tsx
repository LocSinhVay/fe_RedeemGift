import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers/components/KTIcon";
import Swal from "sweetalert2";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { UserSystemModal } from "./UserSystemModal/UserSystemModal";
import { deleteUserSystem, resetPassword, updateUserSystem } from "../../../../controllers/UserSystem/UserSystemController";
import { submitFormData } from "../../../../hooks/submitFormData";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";

const ActionsCell: FC<any> = ({ namespace, user }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const handleAction = async (action: 'Deleted' | 'Reset', message: string) => {
    const { value } = await Swal.fire({
      text: `Bạn có chắc chắn muốn ${message} nhân viên này không?`,
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
      let result;
      if (action === 'Deleted') {
        result = await deleteUserSystem(user.UserID);
      } else if (action === 'Reset') {
        result = await resetPassword(user.UserID);
      }

      if (result.Status === "Success") {
        await Swal.fire({
          text: `${message} thành công!`,
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Đóng",
          customClass: { confirmButton: "btn fw-bold btn-primary" },
        });
        refetch();
      } else {
        throw new Error(result.Message || `Không thể ${message} nhân viên này!`);
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

  const handleUpdate = async (updatedUser: Partial<any>) => {
    await submitFormData({
      formFields: {
        UserID: updatedUser.UserID,
        FullName: updatedUser.FullName,
        UserAvatar: updatedUser.UserAvatar,
        Email: updatedUser.Email,
        Phone: updatedUser.Phone,
        Status: updatedUser.Status,
        RoleID: updatedUser.RoleID,
        ProjectCodes: updatedUser.ProjectCodes,
        Username: updatedUser.Username,
      },
      fileField: updatedUser.AvatarFile
        ? { name: "File", file: updatedUser.AvatarFile }
        : undefined,
      apiFunction: updateUserSystem,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  const actionList = [
    { label: "Xem", action: () => setShowModal(true) },
    { label: "Xóa", action: () => handleAction("Deleted", "Xóa") },
    { label: "Reset mật khẩu", action: () => handleAction("Reset", "Reset mật khẩu") },
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
        <UserSystemModal
          show={showModal}
          onClose={() => setShowModal(false)}
          user={user}
          onSave={handleUpdate}
        />
      )}
    </>
  );
};

export { ActionsCell };
