import { FC, useMemo } from 'react';

type Props = {
  isActive?: 0 | 1;
};

const StatusCell: FC<Props> = ({ isActive }) => {
  // 🔹 Dùng useMemo để tối ưu hóa, tránh tính toán lại không cần thiết
  const { statusClass, statusText } = useMemo(() => {
    switch (isActive) {
      case 1:
        return { statusClass: 'badge badge-light-success', statusText: 'Đang sử dụng' };
      case 0:
        return { statusClass: 'badge badge-light-danger', statusText: 'Khóa' };
      default:
        return { statusClass: 'badge badge-light', statusText: 'Không xác định' };
    }
  }, [isActive]);

  return <span className={statusClass}>{statusText}</span>;
};

export { StatusCell };
