import { defaultThreshold } from "../../src/util/shards";

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

  test("always requires a strict majority across the whole UI range", () => {
    for (let n = 3; n <= 255; n++) {
      expect(defaultThreshold(n)).toBeGreaterThan(n / 2);
    }
  });
});
