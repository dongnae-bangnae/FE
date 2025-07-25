export const categoryColors = [
	{ name: "RED", code: "#E94E77" },
	{ name: "ORANGE", code: "#FFA94D" },
	{ name: "YELLOW", code: "#FFE174" },
	{ name: "GREEN", code: "#498C6D" },
	{ name: "SKYBLUE", code: "#419DCE" },
	{ name: "INDIGO", code: "#005B9D" },
	{ name: "PURPLE", code: "#7B61FF" },
	{ name: "BLACK", code: "#444444"}
] as const;

export type CategoryColorName = (typeof categoryColors)[number]["name"];
