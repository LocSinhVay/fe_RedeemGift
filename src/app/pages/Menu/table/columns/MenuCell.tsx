import { useState } from 'react'
import { MenuModal } from './MenuModal/MenuModal'
import { useQueryResponse } from '../../../../services/QueryResponseProvider';
import { updateMenu } from '../../../../controllers/Menu/MenuController';
import { submitFormData } from '../../../../hooks/submitFormData';

export const MenuCell: React.FC<any> = ({ namespace, menu }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = async (updatedMenu: Partial<any>) => {
    await submitFormData({
      formFields: {
        MenuID: updatedMenu.MenuID,
        MenuName: updatedMenu.MenuName,
        MenuPath: updatedMenu.MenuPath,
        Icon: updatedMenu.Icon,
        ParentId: updatedMenu.ParentId,
        Status: updatedMenu.Status,
        DisplayOrder: updatedMenu.DisplayOrder,
      },
      apiFunction: updateMenu,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer text-primary hover:underline"
      >
        {menu.MenuName}
      </span>

      {showModal && (
        <MenuModal
          show={showModal}
          onClose={() => setShowModal(false)}
          menu={menu}
          onSave={handleUpdate}
        />
      )}
    </>
  )
}
