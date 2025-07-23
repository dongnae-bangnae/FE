import IconInfo from "../../assets/top/icon-info.svg?react";

interface Props {
	message: string; 
	onClick: () => void;
}

function OptionMessage({message, onClick}: Props) {
    return (
<div className="absolute top-13 right-4 bg-[#FFFFFF] rounded-xl shadow-md px-3 py-2 flex items-center gap-3 z-50 hover:bg-[#EFEFEF80]" onClick={onClick}>
			<span className="text-sm font-medium mr-10">{message}</span>
			<IconInfo className="w-4 h-4" />
		</div>
    )
}

export default OptionMessage; 