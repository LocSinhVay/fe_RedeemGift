import { FC, useState } from "react";
import Swal from "sweetalert2";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { deleteRedeemSpin, updateRedeemSpin } from "../../../../controllers/RedeemSpin/RedeemSpinController";
import { submitFormData } from "../../../../hooks/submitFormData";
import { KTIcon } from "../../../../../_metronic/helpers";
import { RedeemSpinModal } from "./RedeemSpinModal/RedeemSpinModal";

export const ActionsCell: FC<any> = ({ namespace, redeemSpin }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = async (message: string) => {
    const { value } = await Swal.fire({
      text: `Bạn có chắc chắn muốn ${message} Tỷ lệ quy đổi này không?`,
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
    try {
      if (value) {
        const result = await deleteRedeemSpin(redeemSpin.RuleID)

        if (result.Status === 'Success') {
          await Swal.fire({
            text: `${message} thành công!`,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Đóng",
            customClass: {
              confirmButton: "btn fw-bold btn-primary",
            },
          });
          refetch();
        } else {
          Swal.fire({
            text: `${result.Message || `Không thể ${message} Tỷ lệ quy đổi này!`}`,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Đóng",
            customClass: {
              confirmButton: "btn fw-bold btn-warning",
            },
          });
        }
      }
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái:`, error);
      Swal.fire({
        text: `Đã xảy ra lỗi khi ${message}. Vui lòng thử lại!`,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: {
          confirmButton: "btn fw-bold btn-danger",
        },
      });
    }
  };

  const handleUpdate = async (updatedRedeemSpin: Partial<any>) => {
    await submitFormData({
      formFields: {
        RuleID: updatedRedeemSpin.RuleID,
        ProjectCode: updatedRedeemSpin.ProjectCode,
        BillValuePerSpin: updatedRedeemSpin.BillValuePerSpin,
        MaxSpinsPerBill: updatedRedeemSpin.MaxSpinsPerBill,
        StartDate: updatedRedeemSpin.StartDate,
        EndDate: updatedRedeemSpin.EndDate,
      },
      apiFunction: updateRedeemSpin,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <span className="text-center">
      {redeemSpin.IsActive && (
        <>
          <a
            href="#"
            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
          >
            <KTIcon iconName="pencil" className="fs-3" />
          </a>
          <a href="#" className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm" onClick={() => handleStatusChange("Khóa")}>
            <KTIcon iconName="trash" className="fs-3" />
          </a>
        </>
      )}
      <RedeemSpinModal
        show={showModal}
        onClose={() => setShowModal(false)}
        redeemSpin={redeemSpin}
        onSave={handleUpdate}
      />
    </span>
  );
};
