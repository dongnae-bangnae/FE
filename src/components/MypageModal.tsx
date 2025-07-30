import React from "react";

interface MypageModalProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const MypageModal = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText
}: MypageModalProps) => {
  return (
    <div className="fixed inset-0 bg-[#00000066]/50 flex items-center justify-center z-50">
      <div className="bg-[#FFFFFF] px-6 py-8 rounded-xl w-[260px]">
        <p className="text-md font-semibold text-black mb-1">{title}</p>
        {description && (
          <p className="text-xs text-black mb-6">{description}</p>
        )}
        <div className="flex justify-between gap-3">
          <button
            onClick={onCancel}
            className="w-[105px] h-[40px] px-4 py-[10px] bg-[#ECECEC] hover:bg-[#FFB54D] text-black text-[14px] font-normal rounded-[9px] outline outline-[2px] outline-[#ECECEC] hover:outline-[#FFB54D] outline-offset-[-2px] shadow-[2px_2px_4px_rgba(245,245,245,0.75)] hover:shadow-[2px_2px_4px_rgba(255,170,51,0.25)] transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-[105px] h-[40px] px-4 py-[10px] bg-[#ECECEC] hover:bg-[#FFB54D] text-black text-[14px] font-normal rounded-[9px] outline outline-[2px] outline-[#ECECEC] hover:outline-[#FFB54D] outline-offset-[-2px] shadow-[2px_2px_4px_rgba(245,245,245,0.75)] hover:shadow-[2px_2px_4px_rgba(255,170,51,0.25)] transition-all duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MypageModal;
