pragma solidity 0.7.4;

interface IPoseidonHasher {
  function poseidon(uint256[1] memory) external pure returns(uint256);
}