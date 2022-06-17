const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VNNN Test 1", function () {
  it("Should return the total supply of tokens once deployed as 1 million times 10^4", async function () {
    const VNNN = await ethers.getContractFactory("VNNN");
    const vnnn = await VNNN.deploy();
    await vnnn.deployed();

    expect(await vnnn.totalSupply()).to.equal(10000000000);
  });

  it("Should return the Decimals as 4 once deployed", async function () {
    const VNNN = await ethers.getContractFactory("VNNN");
    const vnnn = await VNNN.deploy();
    await vnnn.deployed();

    expect(await vnnn.decimals()).to.equal(4);
  });

  it("Should return 50000 as the output of intAmount(5) once deployed", async function () {
    const VNNN = await ethers.getContractFactory("VNNN");
    const vnnn = await VNNN.deploy();
    await vnnn.deployed();

    expect(await vnnn.intAmount(5)).to.equal(50000);
  });
});
