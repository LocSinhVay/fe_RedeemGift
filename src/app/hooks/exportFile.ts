import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

export const exportFile = async (
  exportFunction: (params: any) => Promise<Blob>,
  queryParams: Record<string, string | number | undefined>,
  fileName: string = 'ExportedFile.xlsx'
) => {
  try {
    Swal.fire({
      title: 'Đang tải file...',
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
      }
    });

    const blob = await exportFunction(queryParams);

    // Đóng loading trước khi xử lý tiếp
    Swal.close();

    if (!blob || blob.size === 0 || blob.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      await Swal.fire({
        text: 'Không có dữ liệu để export!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn fw-bold btn-warning',
        },
      });
      return;
    }

    saveAs(blob, fileName);

    await Swal.fire({
      text: 'Xuất file thành công!',
      icon: 'success',
      buttonsStyling: false,
      confirmButtonText: 'Đóng',
      customClass: {
        confirmButton: 'btn fw-bold btn-primary',
      },
    });

  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);

    Swal.close();

    await Swal.fire({
      text: 'Có lỗi xảy ra khi xuất file!',
      icon: 'error',
      buttonsStyling: false,
      confirmButtonText: 'Đóng',
      customClass: {
        confirmButton: 'btn fw-bold btn-danger',
      },
    });
  }
};
