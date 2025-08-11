interface CommentActionModalProps {
  onClose: () => void;
  onReport: () => void;
}

const CommentSpamModal = ({
  onClose,
  onReport,
}: CommentActionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-[375px] bg-white rounded-t-[15px] h-[209px] flex flex-col items-center">
        <div className="bg-[#F5F5F5] w-[350px] h-[64px] rounded-[15px] mt-[30px] flex flex-col items-center justify-center">
          <button
            className="w-full py-4 text-[20px] font-semibold"
            style={{
                width: "300px",
                color: "red",
            }}
            onClick={onReport}
            >
            신고
            </button>
        </div>
        <div className="bg-[#F5F5F5] w-[350px] h-[64px] rounded-[15px] mt-[10px]">
            <button
          className="w-full py-4 text-[20px] font-semibold text-center"
          onClick={onClose}
        >
          취소
        </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSpamModal;
