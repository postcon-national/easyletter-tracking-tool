import IconDownload from "@/components/svg/IconDownload";

interface DownloadDialogProps {
    onCancel: () => void;
    onConfirm: () => void;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="relative p-2.5 bg-gradient-to-br from-[var(--dvs-orange)]/15 to-[var(--dvs-orange)]/5 rounded-full">
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-full bg-[var(--dvs-orange)]/20 animate-ping" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                     className="w-6 h-6 text-[var(--dvs-orange)] relative">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--dvs-gray-dark)]">Übertragung fehlgeschlagen</h3>
                <p className="mt-2 text-sm text-[var(--dvs-gray)] leading-relaxed">
                  Möchten Sie die Datei stattdessen herunterladen?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onCancel}
                className="px-4 py-2.5 text-sm font-medium text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] bg-white hover:bg-gray-50/80 rounded-lg shadow-sm transition-all duration-200 border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--dvs-orange)]/20 focus:ring-offset-1 hover:shadow"
              >
                Zurück
              </button>
              <button
                onClick={onConfirm}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--dvs-orange)] bg-white hover:bg-gray-50/80 bg-gradient-to-br from-[var(--dvs-orange)]/10 via-[var(--dvs-orange)]/5 to-transparent rounded-lg hover:from-[var(--dvs-orange)]/15 hover:via-[var(--dvs-orange)]/10 hover:to-transparent transition-all duration-200 shadow-sm hover:shadow border border-[var(--dvs-orange)]/10 hover:border-[var(--dvs-orange)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--dvs-orange)]/20 focus:ring-offset-1"
              >
                <IconDownload />
                Herunterladen
              </button>
            </div>
          </div>
        </div>
    );
};

export default DownloadDialog;