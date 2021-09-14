import { assert } from "chai";
import { TestPoseidon, TestPoseidon__factory } from "../wrappers";

import { ethers } from "hardhat";
const poseidonUnit = require("circomlib/src/poseidon_gencontract");


const BigNumber = ethers.BigNumber;

describe("Poseidon Hasher", () => {
  let poseidonHasher: TestPoseidon;
  before(async () => {
    const accounts = await ethers.getSigners();
    
    const poseidonOneInputABI = poseidonUnit.generateABI(1);
    const poseidonOneInputCode = poseidonUnit.createCode(1);

    const poseidonOneInputFactory = new ethers.ContractFactory(poseidonOneInputABI, poseidonOneInputCode, accounts[0]);
    const poseidonHasherOneInput = await poseidonOneInputFactory.deploy();

    const testPoseidonFactory = new TestPoseidon__factory(accounts[0]);
    poseidonHasher = await testPoseidonFactory.deploy(poseidonHasherOneInput.address);



  });

  it("Expected result", async () => {
    const expected = BigNumber.from(
      "0x2a09a9fd93c590c26b91effbb2499f07e8f7aa12e2b4940a3aed2411cb65e11c"
    );
    const result = await poseidonHasher.test([0]);
    assert.isTrue(expected.eq(result));
  });

  it("Gas cost", async () => {
    const gasCost = await poseidonHasher.callStatic.poseidonGasCost();
    console.log("poseidon hash gas costs:", gasCost.toNumber());
  });
});
