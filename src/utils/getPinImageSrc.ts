import pinFood from "../assets/pin/pin_food.svg";
import pinCafe from "../assets/pin/pin_cafe.svg";
import pinPub from "../assets/pin/pin_pub.svg";
import pinWalk from "../assets/pin/pin_walk.svg";
import pinExercise from "../assets/pin/pin_sports.svg";
import pinBookstore from "../assets/pin/pin_bookstore.svg";
import pinArts from "../assets/pin/pin_culture_art.svg";
import pinETC from "../assets/pin/pin_etc.svg";

export const getPinImageSrc = (category: string): string => {
	const map: Record<string, string> = {
		FOOD: pinFood,
		CAFE: pinCafe,
		PUB: pinPub,
		WALK: pinWalk,
		EXERCISE: pinExercise,
		BOOKSTORE: pinBookstore,
		CULTURE_ART: pinArts,
		ETC: pinETC,
	};
	return map[category] ?? map["ETC"];
};
