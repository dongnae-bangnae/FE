import IconInfo from "../../assets/top/icon-info.svg?react";

function OptionMessage() {
    return (
<div className="absolute top-13 right-4 bg-[#FFFFFF] rounded-xl shadow-md px-3 py-2 flex items-center gap-3 z-50 hover:bg-[#EFEFEF80]">
			<span className="text-sm font-medium mr-10">기존 카테고리 편집하기</span>
			<IconInfo className="w-4 h-4" />
		</div>
    )
}

export default OptionMessage; 