import React, { useState } from "react";
import { UserSystemModal } from "./UserSystemModal/UserSystemModal";
import { updateUserSystem } from "../../../../controllers/UserSystem/UserSystemController";
import { useQueryResponse } from "../../../../services/QueryResponseProvider";
import { submitFormData } from "../../../../hooks/submitFormData";

const UserAvatarCell: React.FC<any> = ({ namespace, user }) => {
  const { refetch } = useQueryResponse(namespace);
  const [showModal, setShowModal] = useState(false);

  const handleUpdate = async (updatedUser: Partial<any>) => {
    await submitFormData({
      formFields: {
        UserID: updatedUser.UserID,
        FullName: updatedUser.FullName,
        UserAvatar: updatedUser.UserAvatar,
        Email: updatedUser.Email,
        Phone: updatedUser.Phone,
        Status: updatedUser.Status,
        RoleID: updatedUser.RoleID,
        ProjectCodes: updatedUser.ProjectCodes,
        Username: updatedUser.Username,
      },
      fileField: updatedUser.AvatarFile
        ? { name: "File", file: updatedUser.AvatarFile }
        : undefined,
      apiFunction: updateUserSystem,
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
    });
  };

  return (
    <div className="d-flex align-items-center">
      {/* Avatar */}
      <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
        <img
          src={user.AvatarImage}
          alt={user.FullName}
        />
      </div>

      {/* User Details */}
      <div className="d-flex flex-column">
        {/* Full Name - Click mở Modal */}
        <span className="text-gray-800 text-hover-primary" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
          {user.FullName}
        </span>
        {/* Username */}
        <span className="text-muted">{user.Username}</span>
      </div>

      {/* Modal chỉnh sửa User */}
      {showModal && (
        <UserSystemModal
          show={showModal}
          onClose={() => setShowModal(false)}
          user={user}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export { UserAvatarCell };
