import { Tree } from '@rln/tree';
import { RLN, RLNUtils } from '../src/rln';
import * as ethers from 'ethers';

import * as chai from 'chai';
import { newPoseidonHasher } from '@rln/tree';
const Scalar = require('ffjavascript').Scalar;
const ZqField = require('ffjavascript').ZqField;
const buildBn128 = require('ffjavascript').buildBn128;
const assert = chai.assert;



const DEPTH = 4;
const hasher = newPoseidonHasher();
const R = Scalar.fromString('21888242871839275222246405745257275088548364400416034343698204186575808495617');
const P = Scalar.fromString('21888242871839275222246405745257275088696311157297823662689037894645226208583');
export const FR = new ZqField(R);
export const FP = new ZqField(P);

function randAddress(): string {
	return ethers.utils.getAddress(ethers.utils.hexlify(ethers.utils.randomBytes(20)));
}

function createPrivateKey() {
	return '0x' + FR.random().toString(16);
}


function initRLN(depth) {
	var fs = require('fs');
	var path = require('path');
	const dir = path.join(__dirname, `../../test_parameters/circuit_${depth}.params`);
	const parameters = fs.readFileSync(dir);
	const rln = RLN.restore(depth, parameters);
	return rln;
}


function reconstructSecret(x1: string, y1: string, x2: string, y2: string) {
	/**
	 * Find slope from shares and calculate private key (the free coefficient a0).
	 */ 


	const x1Fr = FR.e(x1);
	const x2Fr = FR.e(x2);
	const y1Fr = FR.e(y1);
	const y2Fr = FR.e(y2);
	const slope = FR.div(FR.sub(y2Fr, y1Fr), FR.sub(x2Fr, x1Fr))
	const pkey = FR.sub(y1Fr, FR.mul(slope, x1Fr));
	return RLNUtils.frToHex(pkey)

}


describe('rln circuit bindings', function () {
	this.timeout(999999);

	let rln: RLN;
	let tree: Tree;
	const memberIndex = 2;
	const memberKey = createPrivateKey();
	before(async () => {
		rln = initRLN(4);
		tree = Tree.new(DEPTH, hasher);
		tree.insertSingle(memberIndex, memberKey);
	});
	it('generate and verify proof', () => {
		const epoch = 100;
		const signal = 'xxx';
		const rlnOut = rln.generate(tree, epoch, signal, memberKey, memberIndex);
		assert.isTrue(rln.verify(rlnOut.rawProof, rlnOut.rawPublicInputs));
	});


	it('simulate slashing', () => {
		const epoch = 100;
		const signal1 = 'xxx';
		const signal2 = 'yyy';

		const rlnOut1 = rln.generate(tree, epoch, signal1, memberKey, memberIndex);
		const rlnOut2 = rln.generate(tree, epoch, signal2, memberKey, memberIndex);

		assert.isTrue(rln.verify(rlnOut1.rawProof, rlnOut1.rawPublicInputs));
		assert.isTrue(rln.verify(rlnOut2.rawProof, rlnOut2.rawPublicInputs));

		const reconstructedKey = reconstructSecret(rlnOut1.x, rlnOut1.y, rlnOut2.x, rlnOut2.y);
		assert.equal(memberKey, reconstructedKey)

	});

});
