import { FC, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers/components/KTIcon";
import Swal from "sweetalert2";
import { updateProject, updateProjectStatus } from "../../../../controllers/Project/ProjectController";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { ProjectModal } from "./ProjectModal/ProjectModal";
import { submitFormData } from "../../../../hooks/submitFormData";

const ActionsCell: FC<any> = ({ namespace, project }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = async (newStatus: number, message: string) => {
    const { value } = await Swal.fire({
      text: `Bạn có chắc chắn muốn ${message} dự án này không?`,
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
      const result = await updateProjectStatus({
        id: project.ProjectID,
        status: newStatus,
      });

      if (result.Status === "Success") {
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
          text: `${result.Message || `Không thể ${message} dự án này!`}`,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Đóng",
          customClass: {
            confirmButton: "btn fw-bold btn-warning",
          },
        });
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

  const handleUpdate = async (updateData: Partial<any>) => {
    await submitFormData({
      formFields: {
        ProjectID: updateData.ProjectID,
        ProjectCode: updateData.ProjectCode,
        ProjectName: updateData.ProjectName,
      },
      apiFunction: updateProject,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <span className="text-center">
      {project.IsActive && (
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
          <a
            href="#"
            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
            onClick={(e) => {
              e.preventDefault();
              handleStatusChange(0, "Khóa");
            }}
          >
            <KTIcon iconName="trash" className="fs-3" />
          </a>
        </>
      )}
      {!project.IsActive && (
        <a
          href="#"
          className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
          onClick={(e) => {
            e.preventDefault();
            handleStatusChange(1, "Kích hoạt lại");
          }}
        >
          <KTIcon iconName="switch" className="fs-3" />
        </a>
      )}

      <ProjectModal
        show={showModal}
        onClose={() => setShowModal(false)}
        project={project}
        onSave={handleUpdate}
      />
    </span>
  );
};

export { ActionsCell };
