export const categoryColors = [
	{ name: "red", code: "#E94E77" },
	{ name: "orange", code: "#FFA94D" },
	{ name: "yellow", code: "#FFE174" },
	{ name: "green", code: "#498C6D" },
	{ name: "sky", code: "#419DCE" },
	{ name: "blue", code: "#005B9D" },
	{ name: "purple", code: "#7B61FF" },
	{ name: "black", code: "#444444"}
] as const;

export type CategoryColorName = (typeof categoryColors)[number]["name"];
