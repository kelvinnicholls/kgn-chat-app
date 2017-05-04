let expect = require('expect');

let {
    generateMessage
} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        let res = generateMessage("John", "Hello");
        expect(res).toInclude({
            from: "John",
            text: "Hello"
        });
        expect(res.createdAt).toBeA('number');
    });
});