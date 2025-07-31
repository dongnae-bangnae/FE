export const getPinImageSrc = (category: string): string => {
	const map: Record<string, string> = {
		FOOD: "/src/assets/pin/pin_food.svg",
		CAFE: "/src/assets/pin/pin_cafe.svg",
		PUB: "/src/assets/pin/pin_pub.svg",
		WALK: "/src/assets/pin/pin_walk.svg",
		EXERCISE: "/src/assets/pin/pin_sports.svg",
		BOOKSTORE: "/src/assets/pin/pin_bookstore.svg",
		CULTURE_ART: "/src/assets/pin/pin_culture_art.svg",
		ETC: "/src/assets/pin/pin_etc.svg",
	};
	return map[category] ?? map["ETC"];
};
