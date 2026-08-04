import { defaultThreshold, isValidShardCount } from "../../src/util/shards";

describe("defaultThreshold", () => {
  // The bug fixed in F5 was Print.vue computing floor(total/2)+2 instead of
  // floor(total/2)+1 — e.g. total=5 showed "need 4" instead of the correct 3.
  test.each([
    [3, 2],
    [4, 3],
    [5, 3], // the exact case from finding F5
    [6, 4],
    [7, 4],
    [10, 6],
    [19, 10],
    [255, 128]
  ])("threshold for %i total shards is %i", (total, expected) => {
    expect(defaultThreshold(total)).toBe(expected);
  });

  // A lower bound alone is too weak to pin the policy: floor(8/2)+2 = 6 is also
  // "more than half of 8". Assert the threshold is the *smallest* strict
  // majority, which is the property that makes floor(n/2)+1 the only answer.
  test("is the smallest strict majority across the whole UI range", () => {
    for (let n = 3; n <= 255; n++) {
      const threshold = defaultThreshold(n);
      expect(threshold).toBeGreaterThan(n / 2);
      expect(threshold - 1).toBeLessThanOrEqual(n / 2);
    }
  });
});

describe("isValidShardCount", () => {
  test("accepts every whole number the UI offers", () => {
    for (let n = 3; n <= 255; n++) {
      expect(isValidShardCount(n)).toBe(true);
    }
  });

  // Annotated as unknown[][] on purpose: these are the values the input can
  // actually hand us, not just out-of-range numbers.
  const rejected: unknown[][] = [
    [2, "below the minimum"],
    [256, "above the maximum"],
    [0, "zero"],
    [-5, "negative"],
    [3.5, "fractional — type=number accepts it, step=1 only nudges the spinner"],
    [Number.NaN, "NaN"],
    [Number.POSITIVE_INFINITY, "infinite"],
    ["", "an emptied input, which v-model.number leaves as a string"],
    ["5", "a numeric string"],
    [undefined, "the initial data value"],
    [null, "null"]
  ];

  test.each(rejected)("rejects %p (%s)", value => {
    expect(isValidShardCount(value)).toBe(false);
  });
});
