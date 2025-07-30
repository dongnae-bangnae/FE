interface ConfirmModalProps {
  title: string;
  content?: string;
  button1: string;
  button2: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  title,
  content,
  button1,
  button2,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-[15px] shadow-md w-[271px] h-[180px] p-[20px] text-center">
        <p className="text-[16px] font-semibold mb-[10px] pt-[5px] text-left">{title}</p>
        {content && (
          <p className="text-[13px] text-black mb-[20px] mt-[10px] whitespace-pre-wrap text-left">
            {content}
          </p>
        )}
        <div className="flex justify-between gap-[15px] pt-[12px]">
          <button
            className="flex-1 bg-[#F4F4F4] w-[104px] h-[45px] text-black py-[10px] rounded-[9px] text-[14px] font-regular"
            onClick={onCancel}
          >
            {button1}
          </button>
          <button
            className="flex-1 bg-[#FF9700] w-[104px] h-[45px] text-black py-[10px] rounded-[9px] text-[14px] font-regular"
            onClick={onConfirm}
          >
            {button2}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
