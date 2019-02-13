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
        [parsed[0].data, parsed[1].data],
        [parsed[0].data, parsed[2].data],
        [parsed[1].data, parsed[2].data]
    ].forEach(twoShards => {
        expect(crypto.reconstruct(twoShards, 'Secret title', 'correct-horse-battery-staple', parsed[0].nonce)).toBe('Secret message')
    });
})

test('fails with incorrect password', () => {
    var shards = crypto.share('Secret message', 'Secret title', 'correct-horse-battery-staple', 5, 3);
    var parsed = shards.map(s => crypto.parse(s));
    var reconstructed = crypto.reconstruct(parsed.map(p => p.data), parsed[0].title, '', parsed[0].nonce);
    expect(reconstructed).not.toBe('Secret message');
    expect(reconstructed).toBe('');
})

test('works with unicode strings', () => {
    var shards = crypto.share('Текст сообщения', 'Это секрет', 'correct-horse-battery-staple', 5, 3);
    var parsed = shards.map(s => crypto.parse(s));
    parsed.forEach(message => {
        expect(message.title).toBe('Это секрет')
    });

    var reconstructed = crypto.reconstruct(parsed.map(p => p.data), parsed[0].title, 'correct-horse-battery-staple', parsed[0].nonce);
    expect(reconstructed).toBe('Текст сообщения');
})

test('reconstructs the reference example', () => {
    var shards = [
        {"t":"Very secret info","r":2,"d":"803c12929ba469d720a63fc8ca6f6ef1cc441f8f0b830ea04f8a484169ec800e4a7","n":"29abbb2c509adedb470f6d3fd3d083362b8c1a9283adf987"},
        {"t":"Very secret info","r":2,"d":"801b4196813bb664141169f939414fec30c7f343326d8df45e557b25b0249fd43e2","n":"29abbb2c509adedb470f6d3fd3d083362b8c1a9283adf987"},
        {"t":"Very secret info","r":2,"d":"80275318760b66ee5a1d7430dbf8769fda05e9e1ff7447eaa78539fbed006f0390b","n":"29abbb2c509adedb470f6d3fd3d083362b8c1a9283adf987"}
    ];

    [
        [0, 1], [0, 2], [1, 2],
        [1, 0], [2, 0], [2, 1]
    ].forEach(([i,j]) => {
        expect(crypto.reconstruct([shards[i].d, shards[j].d], 'Very secret info', 'amazing-daring-panda-horror', shards[i].n)).toBe('Any questions?')
    });
})
