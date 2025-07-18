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
            className="flex-1 bg-[#f0f0f0] text-black py-2 rounded-md text-sm font-medium hover:bg-[#FF9700]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#f0f0f0] text-black py-2 rounded-md text-sm font-medium hover:bg-[#FF9700]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MypageModal;
