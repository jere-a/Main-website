import { fetchData } from "./cloudflare-trace";

function randomEncodeDecode(input: string, seed: number, isEncoding = true) {
  // Helper function to generate a shuffled dictionary using the seed
  function shuffleDict(seed: number) {
    const dictionary =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const arr = dictionary.split("");
    const random = seededRandom(seed);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  }

  // Helper function to generate a seeded random function based on the seed
  function seededRandom(seed: number) {
    const m = 2 ** 32,
      a = 1664525,
      c = 1013904223;
    let state = seed;
    return () => {
      state = (a * state + c) % m;
      return state / m;
    };
  }

  // Encode a number into a string using the shuffled dictionary
  function encodeNumber(number: number, shuffledDict: string) {
    const base = BigInt(shuffledDict.length);
    let encoded = "";
    let bigNumber = BigInt(number);
    while (bigNumber > 0n) {
      encoded = shuffledDict[Number(bigNumber % base)] + encoded;
      bigNumber = bigNumber / base;
    }
    return encoded || shuffledDict[0];
  }

  // Decode an encoded string back into a number using the shuffled dictionary
  function decodeNumber(encoded: string, shuffledDict: string) {
    const base = BigInt(shuffledDict.length);
    let decoded = 0n;
    for (const char of encoded) {
      decoded = decoded * base + BigInt(shuffledDict.indexOf(char));
    }
    return decoded;
  }

  // Encoding the input text
  if (isEncoding) {
    const shuffledDict = shuffleDict(seed);
    let bigNumber = 0n;
    for (let i = 0; i < input.length; i++) {
      bigNumber = (bigNumber << 8n) | BigInt(input.charCodeAt(i));
    }
    return encodeNumber(Number(bigNumber), shuffledDict);
  } // Decoding the encoded text
  else {
    const shuffledDict = shuffleDict(seed);
    let bigNumber = decodeNumber(input, shuffledDict);
    let decoded = "";
    while (bigNumber > 0n) {
      const charCode = Number(bigNumber & 0xffn);
      decoded = String.fromCharCode(charCode) + decoded;
      bigNumber >>= 8n;
    }
    return decoded;
  }
}

function leetspeakTransform(
  text: string,
  probability: number = 0.5,
  seed: number = 123,
): string {
  const leetDict: Record<string, string> = {
    a: "4",
    b: "8",
    e: "3",
    g: "9",
    i: "1",
    l: "1",
    o: "0",
    s: "5",
    t: "7",
    z: "2",
  };
  const seededRandom = (seed: number) => () => (Math.sin(seed++) * 10000) % 1;
  const randomGen = seededRandom(seed);

  return text
    .toLowerCase()
    .split("")
    .map((c) => (leetDict[c] && randomGen() < probability ? leetDict[c] : c))
    .map((c) => c.replace(" ", "_"))
    .join("");
}

async function generateFlag(
  baseString: string,
  prefix: string = "HTB",
  extraLength: number = 5,
  leetProbability: number = 0.5,
): Promise<string> {
  const seed = Math.floor(Math.random() * 10000);

  const transformed = leetspeakTransform(baseString, leetProbability, seed);
  const extraChars = randomEncodeDecode((await fetchData()).ip, seed, true);
  const _randomChars = Array.from(
    { length: extraLength },
    () => Math.random().toString(36).charAt(2), // Generates a random alphanumeric character
  ).join("");

  return `${prefix}{${transformed}_${extraChars}}`;
}

export default async function main(): Promise<void> {
  console.log(await generateFlag("capturetheflag"));
}
