import React from 'react';

const ExportButton: React.FC<{ onExport: () => void; disabled: boolean }> = ({ onExport, disabled }) => {
  return (
    <button
      onClick={onExport}
      className={`btn-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      Übertragen
    </button>
  );
};

export default ExportButton;