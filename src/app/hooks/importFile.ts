import Swal from 'sweetalert2';

export const importFile = async (
  importFunction: (params: any) => Promise<any>,
  file: File | undefined,
  onSuccess?: () => void,
) => {
  try {
    // Kiểm tra nếu không có file
    if (!file) {
      await Swal.fire({
        text: 'Vui lòng chọn một tệp để nhập liệu!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn fw-bold btn-warning',
        },
      });
      return;
    }

    // Kiểm tra định dạng file
    const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validFileTypes.includes(file.type)) {
      await Swal.fire({
        text: 'Chỉ hỗ trợ các file Excel (.xlsx, .xls)!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn fw-bold btn-warning',
        },
      });
      return;
    }

    // Xác nhận nhập dữ liệu với tên file
    let result = await Swal.fire({
      title: 'Xác nhận nhập liệu',
      text: `Bạn có chắc chắn muốn nhập dữ liệu từ file: ${file.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'btn fw-bold btn-success',
        cancelButton: 'btn fw-bold btn-danger',
      },
    });

    // Nếu người dùng xác nhận
    if (result.isConfirmed) {
      // ✅ Loading khi đang xử lý file
      Swal.fire({
        title: 'Đang xử lý nhập liệu...',
        html: `
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoRr_v87kNzJloDm6No0UCF6G5zw_Ogva38v63vdjpEKTKsURyGlqEda8zzwdBrvNTIx04Y-aJrajP_FR4XOJ44rGhStvcZKVaSTNUeM2jja9PTwqAsVpNQ5XbEa45LMT9Ki8IM9QD0Eg/s1600/39.gif" width="100" />
          <p style="margin-top: 1rem;">Vui lòng đợi trong giây lát...</p>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        background: '#f0f0f0',
        customClass: {
          popup: 'shadow-lg rounded-xl p-4',
          title: 'text-primary fw-bold',
        },
      });

      // Gọi hàm nhập dữ liệu
      let response = await importFunction(file);
      // Thông báo thành công
      if (response.Status === "Success") {
        Swal.fire({
          text: 'Dữ liệu đã được nhập thành công!',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Đóng',
          customClass: {
            confirmButton: 'btn fw-bold btn-success',
          },
        });
        if (onSuccess) onSuccess();
      } else {
        Swal.fire({
          text: response.Message,
          icon: 'warning',
          buttonsStyling: false,
          confirmButtonText: 'Đóng',
          customClass: {
            confirmButton: 'btn fw-bold btn-warning',
          },
        })
      };
    } else {
      // Nếu người dùng hủy, hiển thị thông báo hủy
      await Swal.fire({
        text: 'Bạn đã hủy nhập liệu.',
        icon: 'info',
        buttonsStyling: false,
        confirmButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn fw-bold btn-info',
        },
      });
    }
  } catch (error) {
    console.error('Lỗi khi nhập dữ liệu:', error);
  }
};