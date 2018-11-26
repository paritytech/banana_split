require('fast-text-encoding'); // NodeJS requires this polyfill

import crypto from "../../src/util/crypto";

test('encodes-decodes empty values', () => {
    var shards = crypto.share('', '', '', 3, 2);
    var parsed = shards.map(s => crypto.parse(s));
    var reconstructed = crypto.reconstruct(parsed.map(p => p.data), parsed[0].title, '', parsed[0].nonce);
    expect(reconstructed).toBe('');
})