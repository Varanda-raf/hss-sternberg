export const STIMULI = {
  digits: [..."0123456789"],
  letters: [..."BDGHKLMRST"],
};

const SET_SIZES = [1, 2, 3, 4, 5, 6];
const BLOCKS_PER_TYPE = 3;

function shuffled(values) {
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

function pilotBlocks(type) {
  const positions = SET_SIZES.map(size => shuffled(Array.from({ length: size }, (_, index) => index)));
  const practicePositions = shuffled([0, 1]);
  const practice = {
    type,
    phase: "practice",
    trials: shuffled([makeTrial(type, 2, practicePositions[0]), makeTrial(type, 4, null)]),
  };
  const testBlocks = Array.from({ length: BLOCKS_PER_TYPE }, (_, blockIndex) => {
    const trials = [];
    for (const [sizeIndex, size] of SET_SIZES.entries()) {
      const order = positions[sizeIndex];
      for (let repetition = 0; repetition < 2; repetition += 1) {
        const targetPosition = order[(blockIndex * 2 + repetition) % size];
        trials.push(makeTrial(type, size, targetPosition), makeTrial(type, size, null));
      }
    }
    return { type, phase: "test", trials: shuffled(trials) };
  });
  return [practice, ...testBlocks];
}

export function makeBlocks(sessionType) {
  const types = shuffled(Object.keys(STIMULI));
  if (sessionType === "pilot") return types.flatMap(pilotBlocks);

  return types.map(type => ({
    type,
    phase: "test",
    trials: shuffled(SET_SIZES).map((size, index) => {
      const targetPosition = index % 2 === 0 ? Math.floor(Math.random() * size) : null;
      return makeTrial(type, size, targetPosition);
    }),
  }));
}
