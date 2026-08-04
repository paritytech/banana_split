// Banana Split's fixed threshold policy: reconstruction requires a majority of
// the shards, i.e. floor(total / 2) + 1. This lives in one place so the
// generator (Share.vue) and the reprint view (Print.vue) can never disagree —
// they did once: Print.vue re-implemented the formula as floor(total/2)+2 and
// displayed the wrong "you need N more" count on reprints (finding F5).
export function defaultThreshold(totalShards: number): number {
  return Math.floor(totalShards / 2) + 1;
}

// Mirrors the min/max on the shard-count inputs. `v-model.number` on an
// `<input type="number">` hands us whatever the field holds, which includes ""
// for an empty box and fractions like 3.5 — neither is a shard count, so the
// range check alone is not enough.
export function isValidShardCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 3 && value <= 255;
}
