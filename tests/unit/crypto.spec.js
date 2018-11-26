require('fast-text-encoding'); // NodeJS requires this polyfill

import crypto from "../../src/util/crypto";

test('encodes-decodes empty values', () => {
    var shards = crypto.share('', '', '', 3, 2);
    var parsed = shards.map(s => crypto.parse(s));
    var reconstructed = crypto.reconstruct(parsed.map(p => p.data), parsed[0].title, '', parsed[0].nonce);
    expect(reconstructed).toBe('');
})

test('properly deserializes metadata', () => {
    var shards = crypto.share('Secret message', 'Secret title', 'correct-horse-battery-staple', 5, 3);
    var parsed = shards.map(s => crypto.parse(s));
    parsed.forEach(message => {
        expect(message.title).toBe('Secret title');
        expect(message.requiredShards).toBe(3);
        expect(message.nonce).toBe(parsed[0].nonce);
    });
})

test('works with any 2 shards out of 3', () => {
    var shards = crypto.share('Secret message', 'Secret title', 'correct-horse-battery-staple', 3, 2);
    var parsed = shards.map(s => crypto.parse(s));
    [
        [ parsed[0].data, parsed[1].data],
        [ parsed[0].data, parsed[2].data],
        [ parsed[1].data, parsed[2].data]
    ].forEach(twoShards => {
        expect(crypto.reconstruct(twoShards, 'Secret title', 'correct-horse-battery-staple', parsed[0].nonce)).toBe('Secret message')
    });
})

test('fails with incorrect password', () => {
    var shards = crypto.share('Secret message', 'Secret title', 'correct-horse-battery-staple', 5, 3);
    var parsed = shards.map(s => crypto.parse(s));
    var reconstructed = crypto.reconstruct(parsed.map(p => p.data), parsed[0].title, '', parsed[0].nonce);
    expect(reconstructed).not.toBe('Secret message')
    expect(reconstructed).toBe('')
})