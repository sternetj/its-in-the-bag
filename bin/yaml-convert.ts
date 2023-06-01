import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const cardsPath = path.join(__dirname, "../cards.yaml");
const outPath = path.join(__dirname, "../src/services/game/cardsData.json");

function convert() {
  try {
    const json = yaml.load(fs.readFileSync(cardsPath, "utf8"));
    fs.writeFileSync(outPath, JSON.stringify(json));
  } catch (e) {
    console.log(e);
  }
}

try {
  convert();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
