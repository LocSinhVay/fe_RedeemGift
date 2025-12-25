import { FC, useMemo } from 'react';

type Props = {
  status?: 0 | 1;
};

const StatusCell: FC<Props> = ({ status }) => {
  // 🔹 Dùng useMemo để tối ưu hóa, tránh tính toán lại không cần thiết
  const { statusClass, statusText } = useMemo(() => {
    switch (status) {
      case 1:
        return { statusClass: 'badge badge-light-success', statusText: 'Đang hoạt động' };
      case 0:
        return { statusClass: 'badge badge-light-danger', statusText: 'Khóa' };
      default:
        return { statusClass: 'badge badge-light', statusText: 'Không xác định' };
    }
  }, [status]);

  return <span className={statusClass}>{statusText}</span>;
};

export { StatusCell };
