import { FC, useState } from "react";
import Swal from "sweetalert2";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { updatePrize, deletePrize } from "../../../../controllers/Prizes/PrizesController";
import { submitFormData } from "../../../../hooks/submitFormData";
import { KTIcon } from "../../../../../_metronic/helpers";
import { PrizesModal } from "./PrizesModal/PrizesModal";

export const ActionsCell: FC<any> = ({ namespace, prizes }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = async (message: string) => {
    const { value } = await Swal.fire({
      text: `Bạn có chắc chắn muốn ${message} giải thưởng trong dự án này không?`,
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
        const result = await deletePrize(prizes.PrizeID)

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
            text: `${result.Message || `Không thể ${message} giải thưởng này!`}`,
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

  const handleUpdate = async (updatedPrizes: Partial<any>) => {
    await submitFormData({
      formFields: {
        PrizeID: updatedPrizes.PrizeID,
        ProjectCode: updatedPrizes.ProjectCode,
        GiftID: updatedPrizes.GiftID,
        Weight: updatedPrizes.Weight,
      },
      apiFunction: updatePrize,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <span className="text-center">
      {prizes.IsActive && (
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
      <PrizesModal
        show={showModal}
        onClose={() => setShowModal(false)}
        prizes={prizes}
        onSave={handleUpdate}
      />
    </span>
  );
};
