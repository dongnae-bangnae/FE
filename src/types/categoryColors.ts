export const categoryColors = [
	{ name: "orange", code: "#FB8A1F" },
	{ name: "yellow", code: "#FFDC5D" },
	{ name: "green", code: "#77B255" },
	{ name: "blue", code: "#4289C1" },
	{ name: "purple", code: "#BB66CF" },
	{ name: "rose", code: "#E0A1A1" },
	{ name: "pink", code: "#DF87C7" },
] as const;

export type CategoryColorName = (typeof categoryColors)[number]["name"];
