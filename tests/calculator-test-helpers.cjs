const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repositoryRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(repositoryRoot, "public", "script.js");
const scriptText = fs.readFileSync(scriptPath, "utf8").replace(/\r\n/g, "\n");
const coreText = fs
  .readFileSync(path.join(repositoryRoot, "public", "calculator-core.js"), "utf8")
  .replace(/\r\n/g, "\n");

function extractConstLiteral(name, openingCharacter = "[") {
  const declaration = `const ${name} = `;
  const declarationIndex = scriptText.indexOf(declaration);

  if (declarationIndex < 0) {
    throw new Error(`Missing ${declaration}`);
  }

  const startIndex = scriptText.indexOf(openingCharacter, declarationIndex);
  const closingCharacter = openingCharacter === "[" ? "]" : "}";
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = startIndex; index < scriptText.length; index += 1) {
    const character = scriptText[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
    } else if (character === openingCharacter) {
      depth += 1;
    } else if (character === closingCharacter) {
      depth -= 1;
      if (depth === 0) {
        return scriptText.slice(startIndex, index + 1);
      }
    }
  }

  throw new Error(`Unterminated literal for ${name}`);
}

function evaluateArray(name) {
  return vm.runInNewContext(`(${extractConstLiteral(name)})`, {
    Infinity,
    METHADONE_IV_REFERENCE_DOSE: 5,
    METHADONE_ORAL_REFERENCE_DOSE: 10,
    METHADONE_ORAL_REFERENCE_OME: 47,
  });
}

function getClinicalContentDigest() {
  const constantNames = [
    "METHADONE_ORAL_REFERENCE_DOSE",
    "METHADONE_ORAL_MORPHINE_FACTOR",
    "METHADONE_IV_REFERENCE_DOSE",
    "METHADONE_CONSERVATIVE_ORAL_MORPHINE_FACTOR",
  ];
  const constantLines = constantNames.map((name) => {
    const match = scriptText.match(new RegExp(`const ${name} = [^;]+;`));
    if (!match) throw new Error(`Missing clinical constant ${name}`);
    return match[0];
  });
  const arrayNames = [
    "methadoneRatioTable",
    "benzoConversionOptions",
    "conversionOptions",
    "hepaticGuidanceRows",
    "pharmacokineticsRows",
    "buprenorphineSchedules",
  ];
  const material = [
    ...constantLines,
    ...arrayNames.map((name) => `${name}:${extractConstLiteral(name)}`),
    `calculator-core:${coreText}`,
  ].join("\n");

  return `sha256-${crypto.createHash("sha256").update(material).digest("hex")}`;
}

function clinicalDataSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

module.exports = {
  clinicalDataSlug,
  evaluateArray,
  extractConstLiteral,
  getClinicalContentDigest,
  repositoryRoot,
  scriptText,
};
