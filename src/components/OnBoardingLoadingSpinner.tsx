type Props = {
	size?: number;
	dot?: number;
	gap?: number;
	overlay?: boolean;
};

export default function OnBoardingLoadingSpinner({size = 56, dot = 10, gap = 12,overlay = true }: Props) {
	return (
		<div
			className={`${overlay ? "fixed inset-0" : ""} flex flex-col items-center justify-center gap-6`}>
			<div
				className="relative"
				style={{
					width: size,
					height: size,
					animation: "spinSmooth 3s linear infinite",
				}}>
				<div
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
					style={{
						width: dot,
						height: dot,
						background: "transparent",
						boxShadow: `0 ${-gap}px 0 0 #FF9700, ${gap}px 0 0 0 #FFCA7E, 0 ${gap}px 0 0 #FF9700, ${-gap}px 0 0 0 #FFCA7E`,
						animation: "pulse 1.5s ease-in-out infinite",
				}}/>
			</div>
			<div className="text-center font-bold leading-relaxed">
				나의 동네 풍경, <br />
				순간을 기록하고 함께 나눠요
			</div>
			<style>
                {`@keyframes spinSmooth { from { transform: rotate(0deg); } to   { transform: rotate(360deg); }}
                    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); }}`}
            </style>
		</div>
	);
}
