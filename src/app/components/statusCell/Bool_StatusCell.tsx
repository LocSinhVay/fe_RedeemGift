import { FC, useMemo } from 'react';

type Props = {
  isActive?: 0 | 1 | true | false;
};

export const Bool_StatusCell: FC<Props> = ({ isActive }) => {
  const { statusClass, statusText } = useMemo(() => {
    if (isActive === 1 || isActive === true) {
      return {
        statusClass: 'badge badge-light-success',
        statusText: 'Activated'
      };
    }

    if (isActive === 0 || isActive === false) {
      return {
        statusClass: 'badge badge-light-danger',
        statusText: 'Blocked'
      };
    }

    return {
      statusClass: 'badge badge-light',
      statusText: ''
    };
  }, [isActive]);

  return <span className={statusClass}>{statusText}</span>;
};
