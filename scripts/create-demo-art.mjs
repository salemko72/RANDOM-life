import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const art = {
  eat: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720"><rect width="960" height="720" fill="#f3ddcd"/><ellipse cx="485" cy="555" rx="315" ry="45" fill="#c69b85" opacity=".2"/><circle cx="480" cy="345" r="244" fill="#fff8ed"/><circle cx="480" cy="345" r="205" fill="#edddd0"/><circle cx="480" cy="345" r="173" fill="#f2b87c"/><g fill="none" stroke="#f9d193" stroke-width="18" stroke-linecap="round"><path d="M350 310q60-100 130 5t130-35M340 360q70-80 150 0t130-10M350 400q65-50 130 10t90-20M400 250q35-35 100 0"/></g><g fill="#c65d4d"><circle cx="390" cy="330" r="22"/><circle cx="525" cy="260" r="20"/><circle cx="555" cy="380" r="27"/><circle cx="450" cy="445" r="20"/></g><g fill="#678067"><ellipse cx="465" cy="315" rx="16" ry="32" transform="rotate(40 465 315)"/><ellipse cx="565" cy="325" rx="15" ry="30" transform="rotate(-40 565 325)"/><ellipse cx="410" cy="405" rx="15" ry="29" transform="rotate(30 410 405)"/></g><path d="M120 165v360M100 170v80m40-80v80" stroke="#9a7e71" stroke-width="9" stroke-linecap="round"/><path d="M823 160v365" stroke="#9a7e71" stroke-width="10" stroke-linecap="round"/></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720"><rect width="960" height="720" fill="#ded6ef"/><circle cx="700" cy="170" r="100" fill="#f6e5cd"/><path d="M50 570q280-110 480-35t430-70v255H0" fill="#c4b6db"/><ellipse cx="480" cy="565" rx="320" ry="40" fill="#9380b0" opacity=".25"/><path d="M185 260q160-75 295-5q155-70 295 5v280q-165-50-295 8q-135-58-295-8Z" fill="#776088"/><path d="M200 245q150-70 280 0v270q-135-55-280-5Z" fill="#fff8eb"/><path d="M480 245q140-70 280 0v265q-145-50-280 5Z" fill="#f6eddc"/><path d="M480 245v270" stroke="#cbbba2" stroke-width="4"/><g stroke="#d5c9b4" stroke-width="6" stroke-linecap="round"><path d="M250 300q85-25 170 0M250 335q85-25 170 0M250 370q85-25 170 0M250 405q85-25 170 0M540 300q80-25 160 0M540 335q80-25 160 0M540 370q80-25 160 0M540 405q80-25 160 0"/></g><path d="M565 245v130l23-18l23 18V235" fill="#c38d7d"/><g fill="#fff6df"><path d="m200 110 6 16 17 6-17 6-6 17-6-17-17-6 17-6Z"/><path d="m460 100 6 16 17 6-17 6-6 17-6-17-17-6 17-6Z"/><circle cx="340" cy="140" r="5"/><circle cx="815" cy="310" r="5"/></g></svg>`,
};
for (const [name, svg] of Object.entries(art)) {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  for (const directory of ["apps/client/assets", "services/api/public/media"]) {
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/demo-${name}.png`, png);
  }
}
console.log(
  "Original demo illustrations generated locally; no external image service.",
);
