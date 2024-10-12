const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    
    it('generats a SHA-256 hashed output', () => {
        expect(cryptoHash('randy')).toEqual('6aac1e2f1838b854ba9d1abf94f018fdf70cf4aedfb8e46f513f49854df3be4e')
    });

    it('produces the same has with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'one', 'two'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });


});