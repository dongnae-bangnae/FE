interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-[#D9D9D9]/50 flex items-center justify-center z-50">
      <div className="bg-[#FFC064] px-6 py-10 rounded-xl text-center w-[260px]">
        <p className="text-sm font-semibold mb-4 text-black">{message}</p>
        <div className="flex justify-between gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white text-black py-2 rounded-md text-sm font-medium hover:bg-[#FF9700]"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-white text-black py-2 rounded-md text-sm font-medium hover:bg-[#FF9700]"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
