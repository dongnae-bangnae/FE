interface EditActionModalProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EditModal = ({
  onClose,
  onEdit,
  onDelete,
}: EditActionModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-[375px] max-w bg-white rounded-t-[15px] h-[262px] flex flex-col items-center">
        <div className="bg-[#F5F5F5] w-[330px] h-[128px] rounded-[15px] mt-[30px] flex flex-col items-center justify-center">
          <button
            className="w-full py-4 text-[20px] font-semibold"
            style={{
                width: "300px",
                borderBottom: "1px solid #999999"
            }}
            onClick={onEdit}
            >
            수정
            </button>
            <button
            className="w-full py-4 text-[20px] font-semibold text-center"
            onClick={onDelete}
            >
            삭제
            </button>
        </div>
        <div className="bg-[#F5F5F5] w-[330px] h-[64px] rounded-[15px] mt-[10px]">
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

export default EditModal;
