const fs = require("fs");
const fonts = fs.readdirSync("./public/fonts").map((f) => ({
	name: f.replace(".woff", ""),
	path: `/fonts/${f}`,
	weight: 700,
	style: "normal",
}));
fs.writeFileSync("./fonts.json", JSON.stringify(fonts));
