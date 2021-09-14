const Scalar = require('ffjavascript').Scalar;
const chai = require('chai');
const poseidon = require('../src/poseidon.js');
const assert = chai.assert;

describe('Poseidon Hasher', function () {
	it('should return correct hashes', async () => {
		const { hasher } = poseidon.createHasher();
		let expected = Scalar.fromString('0x115cc0f5e7d690413df64c6b9662e9cf2a3617f2743245519e19607a4417189a');
		assert(poseidon.field.eq(expected, hasher([1, 2])));

		expected = Scalar.fromString('0x2a09a9fd93c590c26b91effbb2499f07e8f7aa12e2b4940a3aed2411cb65e11c');
		assert(poseidon.field.eq(expected, hasher([0])));
	});
});
