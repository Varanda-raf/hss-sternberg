export const SYMBOL_PATHS = {
  s01: "M5 18L10 8L23 8L27 15 M14 8V15L21 22L28 22 M21 22V27",
  s02: "M5 9H13L20 19L28 19 M13 9V21L7 27 M20 19L22 26",
  s03: "M4 20H12L21 7L28 7 M12 20L19 27H26 M21 7V15",
  s04: "M6 6V12L15 21H27 M15 21V27 M15 21L23 11H28",
  s05: "M5 16L13 7L25 9V17 M13 7V19L21 25 M8 23L13 19",
  s06: "M5 25L9 15L20 15L27 7 M9 15V6 M20 15L24 25H28",
  s07: "M5 8L11 16H23L28 23 M11 16L5 24 M23 16V6",
  s08: "M7 7H20L28 15 M11 7V18L18 26H26 M18 26V18",
  s09: "M5 13L11 6L20 15H28 M20 15L12 26H6 M20 15V25",
  s10: "M4 21H15L23 11V5 M15 21L21 27H28 M10 21V12L16 7",
};

export const STIMULI = {
  digits: [..."0123456789"],
  symbols: Object.keys(SYMBOL_PATHS),
};

const SET_SIZES = [1, 2, 3, 4, 5, 6];
const TEST_BLOCKS = 3;

export function shuffled(values) {
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [items[index], items[other]] = [items[other], items[index]];
  }
  return items;
}

function makeTrial(type, size, targetPosition) {
  const deck = shuffled(STIMULI[type]);
  const targetPresent = targetPosition !== null;
  return {
    sequence: deck.slice(0, size),
    probe: deck[targetPresent ? targetPosition : size],
    targetPresent,
  };
}

export function makeBlocks(type) {
  const positions = SET_SIZES.map(size => shuffled(Array.from({ length: size }, (_, index) => index)));
  const practice = {
    phase: "practice",
    number: 0,
    trials: shuffled([makeTrial(type, 2, Math.floor(Math.random() * 2)), makeTrial(type, 4, null)]),
  };
  const testBlocks = Array.from({ length: TEST_BLOCKS }, (_, blockIndex) => {
    const trials = [];
    for (const [sizeIndex, size] of SET_SIZES.entries()) {
      const targetPosition = positions[sizeIndex][blockIndex % size];
      trials.push(makeTrial(type, size, targetPosition), makeTrial(type, size, null));
    }
    return { phase: "test", number: blockIndex + 1, trials: shuffled(trials) };
  });
  return [practice, ...testBlocks];
}
