import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers/components/KTIcon";
import Swal from "sweetalert2";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { MenuModal } from "./MenuModal/MenuModal";
import { deleteMenu, updateMenu } from "../../../../controllers/Menu/MenuController";
import { submitFormData } from "../../../../hooks/submitFormData";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";

const ActionsCell: FC<any> = ({ namespace, menu }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const handleAction = async (message: string) => {
    const { value } = await Swal.fire({
      text: `Bạn có chắc chắn muốn ${message} menu này không?`,
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
      let result = await deleteMenu(menu.MenuID);

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
        throw new Error(result.Message || `Không thể ${message} quyền này!`);
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

  const handleUpdate = async (updatedMenu: Partial<any>) => {
    await submitFormData({
      formFields: {
        MenuID: updatedMenu.MenuID,
        MenuName: updatedMenu.MenuName,
        MenuPath: updatedMenu.MenuPath,
        Icon: updatedMenu.Icon,
        ParentId: updatedMenu.ParentId,
        Status: updatedMenu.Status,
        DisplayOrder: updatedMenu.DisplayOrder,
      },
      apiFunction: updateMenu,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
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
        <MenuModal
          show={showModal}
          onClose={() => setShowModal(false)}
          menu={menu}
          onSave={handleUpdate}
        />
      )}
    </>
  );
};

export { ActionsCell };
