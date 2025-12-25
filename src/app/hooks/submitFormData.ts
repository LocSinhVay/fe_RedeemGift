import Swal from "sweetalert2";

type SubmitFormOptions = {
  formFields: Record<string, any>;
  fileField?: { name: string; file: File };
  apiFunction: (formData: FormData) => Promise<any>;
  onSuccess?: () => void;
};

export const submitFormData = async ({
  formFields,
  fileField,
  apiFunction,
  onSuccess,
}: SubmitFormOptions) => {
  try {
    const formData = new FormData();

    // Add all fields
    Object.entries(formFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Add file if exists
    if (fileField?.file) {
      formData.append(fileField.name, fileField.file);
    }

    const result = await apiFunction(formData);

    if (result.Status === "Success" || result === 1) {
      await Swal.fire({
        text: "Cập nhật thành công!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: { confirmButton: "btn fw-bold btn-primary" },
      });

      if (onSuccess) onSuccess();
    } else {
      Swal.fire({
        text: `${result.Message || "Không thể cập nhật dữ liệu!"}`,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Đóng",
        customClass: { confirmButton: "btn fw-bold btn-warning" },
      });
    }
  } catch (error) {
    Swal.fire({
      text: "Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Đóng",
      customClass: { confirmButton: "btn fw-bold btn-danger" },
    });
  }
};
