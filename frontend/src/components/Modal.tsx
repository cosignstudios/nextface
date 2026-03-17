interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info";
}

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "info" 
}: ModalProps) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-none">
      <div className="card-brutal bg-white w-full max-w-md animate-in fade-in zoom-in duration-200">
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tight italic border-b-4 border-black pb-4">
          {title}
        </h2>
        
        <p className="text-lg font-bold uppercase mb-10 leading-tight">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={onConfirm}
            className={`flex-1 btn-brutal ${type === 'danger' ? 'bg-brutal-pink' : 'bg-brutal-blue'}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 btn-brutal bg-white"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};


export default Modal;
