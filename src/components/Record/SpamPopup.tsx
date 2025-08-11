import React, { useState } from "react";

interface SpamModalProps {
  title: string;
  onConfirm: (reason: string, customReason?: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const SpamPopup = ({
  title,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}: SpamModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasons = [
    { label: "1. 홍보/도배입니다", value: "AD" },
    { label: "2. 개인정보가 노출되었습니다", value: "PRIVACY" },
    { label: "3. 불쾌한 표현이 있습니다", value: "ABUSE" },
    { label: "4. 기타", value: "ETC" },
  ];

  const confirmDisabled =
    !selectedReason || (selectedReason === "ETC" && !customReason.trim());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-6 rounded-[15px] w-[299px] h--[300px] shadow-lg">
        <p className="text-[18px] font-semibold text-black mb-3 ml-[15px]">{title}</p>

        <div className="flex-1 flex flex-col items-center justify-center gap-3">
            {/* 라디오 버튼 영역 */}
            <div className="space-y-2">
            {reasons.map((r) => (
                <label
                key={r.value}
                className="flex items-center gap-2 text-[14px] text-black"
                >
                <input
                    type="radio"
                    name="report-reason"
                    value={r.value}
                    checked={selectedReason === r.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-[#FFB54D]"
                />
                <span>{r.label}</span>
                </label>
            ))}
            </div>

            {/* 기타 사유 */}
            <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="사유를 입력하세요"
                disabled={selectedReason !== "ETC"}
                className={`w-[164px] h-[23px] rounded-[3px] border px-2 text-[14px] placeholder-gray-400 ${
                selectedReason !== "ETC" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                style={{ borderColor: "#E3E3E3" }}
            />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-6 pt-7">
          <button
            onClick={onCancel}
            className="w-[104px] h-[45px] rounded-[9px] bg-[#ECECEC] text-black text-[16px]"
          >
            {cancelText}
          </button>
          <button
            onClick={() =>
              onConfirm(selectedReason, customReason || undefined)
            }
            disabled={confirmDisabled}
            className={`w-[104px] h-[45px] rounded-[9px] text-[16px] text-black
              ${
                confirmDisabled
                  ? "bg-[#FFAC33] opacity-60 cursor-not-allowed"
                  : "bg-[#FFAC33] active:scale-[0.98]"
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpamPopup;
