// Adapted from
// https://github.com/iden3/circomlib/blob/master/src/poseidon.js
const poseidon = require('circomlib/src/poseidon');

const Scalar = require('ffjavascript').Scalar;
const ZqField = require('ffjavascript').ZqField;

FIELD_ORDER = Scalar.fromString('21888242871839275222246405745257275088548364400416034343698204186575808495617');
F = new ZqField(FIELD_ORDER);
exports.field = F;

function frToHex(e) {
	const buf = Buffer.alloc(32);
	F.toRprBE(buf, 0, e);
	return '0x' + buf.toString('hex');
}


exports.createHasher = () => {
	return {
		hasher: function (inputs) {
			let result = poseidon(inputs);
			return frToHex(result);
		}
	};
};
