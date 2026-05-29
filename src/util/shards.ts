// Banana Split's fixed threshold policy: reconstruction requires a majority of
// the shards, i.e. floor(total / 2) + 1. This lives in one place so the
// generator (Share.vue) and the reprint view (Print.vue) can never disagree —
// they did once: Print.vue re-implemented the formula as floor(total/2)+2 and
// displayed the wrong "you need N more" count on reprints (finding F5).
export function defaultThreshold(totalShards: number): number {
  return Math.floor(totalShards / 2) + 1;
}
