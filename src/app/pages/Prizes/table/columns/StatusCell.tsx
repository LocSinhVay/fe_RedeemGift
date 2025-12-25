import { FC, useMemo } from 'react';

type Props = {
  isActive?: boolean | 0 | 1;
};

const StatusCell: FC<Props> = ({ isActive }) => {
  const { statusClass, statusText } = useMemo(() => {
    if (isActive === true || isActive === 1) {
      return { statusClass: 'badge badge-light-success', statusText: 'Hoạt động' };
    }
    if (isActive === false || isActive === 0) {
      return { statusClass: 'badge badge-light-danger', statusText: 'Đã khóa' };
    }
    return { statusClass: 'badge badge-light', statusText: '' };
  }, [isActive]);

  return <span className={statusClass}>{statusText}</span>;
};

export { StatusCell };
