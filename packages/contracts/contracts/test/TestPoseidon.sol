pragma solidity 0.7.4;

import "../crypto/IPoseidonHasher.sol";

contract TestPoseidon {

	IPoseidonHasher public poseidonHasher;

	constructor(
		address _poseidonHasher
	) public {
		poseidonHasher = IPoseidonHasher(_poseidonHasher);
	}

	function test(uint256[1] calldata input) external view returns (uint256) {
		return poseidonHasher.poseidon(input);
	}

	function poseidonGasCost() external returns (uint256) {
		uint256 g = gasleft();
		poseidonHasher.poseidon([uint256(1)]);
		return g - gasleft();
	}
}