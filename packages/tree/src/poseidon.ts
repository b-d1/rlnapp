import { Hasher } from './hasher';
const poseidon = require('@rln/poseidon').poseidon;


export function newPoseidonHasher(): Hasher {
	const { hasher } = poseidon.createHasher();
	return Hasher.new(hasher);
}
