import React from 'react';

const DeleteButton: React.FC<{ onDelete: () => void; disabled: boolean }> = ({ onDelete, disabled }) => {
  return (
    <button
      onClick={onDelete}
      className={`btn-primary secondary ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      Auswahl entfernen
    </button>
  );
};

export default DeleteButton;