import React from 'react';

const ExportButton: React.FC<{ onExport: () => void; disabled: boolean  }> = ({ onExport, disabled }) => {
  return (
    <button
      onClick={onExport}
      className={"bg-orange-500 text-white p-2 rounded " + (disabled ? "opacity-50 cursor-not-allowed" : "")}
      disabled={disabled}
    >
      Übertragen
    </button>
  );
};

export default ExportButton;