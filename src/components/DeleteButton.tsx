import React from 'react';

const DeleteButton: React.FC<{ onDelete: () => void; disabled: boolean }> = ({ onDelete, disabled }) => {
  return (
    <button
      onClick={onDelete}
      className={"bg-red-500 text-white p-2 rounded" + (disabled ? " opacity-50 cursor-not-allowed" : "")}
      disabled={disabled}
    >
        Auswahl entfernen    
    </button>
  );
};

export default DeleteButton;