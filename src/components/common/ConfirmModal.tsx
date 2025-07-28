import React, { useEffect, useState } from "react";

interface ConfirmModalProps {
  message: React.ReactNode;
  onConfirm: (placeName: string) => void;
  onCancel: () => void;
  defaultValue?: string; 
  requiredInput?: boolean;
}

const ConfirmModal = ({ message, onConfirm, onCancel, defaultValue="", requiredInput=false }: ConfirmModalProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
		setInputValue(defaultValue);
	}, [defaultValue]);

  const handleConfirmClick = () => {
		if (requiredInput && inputValue.trim() === "") {
			alert("장소명을 입력해 주세요!");
			return;
		}
		onConfirm(inputValue.trim());
	};

  return (
    <div className="fixed inset-0 bg-[#D9D9D9]/50 flex items-center justify-center z-50">
      <div className="bg-[#D9D9D9] px-6 py-6 rounded-xl text-center w-[260px]">
        <p className="text-sm  mb-4 text-black">{message}</p>
        <input type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
                className="bg-white mb-3 h-10 w-50 focus:outline-none pl-3
                            placeholder-[#FF6A00] placeholder:text-sm placeholder:p-12
                            text-sm" placeholder="장소명 입력"/>
        <div className="flex justify-between gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white text-black py-2 rounded-md text-sm font-medium hover:bg-[#FF9700]"
          >
            취소
          </button>
          <button
            onClick={handleConfirmClick}
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
