const { expect } = require("chai");
// const { ethers } = require("hardhat");

describe("VNNN Test 1", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let VNNN;
  let vnnn;

  beforeEach(async function () {
    VNNN = await ethers.getContractFactory("VNNN");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    vnnn = await VNNN.deploy();
    await vnnn.deployed();
  });

  describe("Owner Details", function () {
    it("Should set the correct owner", async function () {
      expect(await vnnn.owner()).to.equal(owner.address);
    });

    it("Should assign initial token supply to owner", async function () {
      expect(await vnnn.totalSupply()).to.equal(
        await vnnn.balanceOf(owner.address)
      );
    });
  });

  describe("Total Supply and Decimals", function () {
    it("Should return the total supply of tokens once deployed as 1 million times 10^4", async function () {
      expect(await vnnn.totalSupply()).to.equal(10000000000);
    });

    it("Should return the Decimals as 4 once deployed", async function () {
      expect(await vnnn.decimals()).to.equal(4);
    });

    it("Should return 50000 as the output of intAmount(5) once deployed", async function () {
      expect(await vnnn.intAmount(5)).to.equal(50000);
    });
  });

  describe("Transactions", function () {
    //Placeholder for tests relating to transactions
    it("Should transfer integer amounts less than an address's balance correctly", async function () {
      await vnnn.transfer(addr1.address, 1000000);
      expect(await vnnn.balanceOf(addr1.address)).to.equal(1000000);
      expect(await vnnn.balanceOf(owner.address)).to.equal(9999000000);
    });

    it("Should revert an attempt to transfer more than an address's balance", async function () {
      await vnnn.transfer(addr1.address, 1000000);
      await expect(
        vnnn.connect(addr1).transfer(addr2.address, 2000000)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should revert transfers of decimal amounts", async function () {
      await expect(vnnn.transfer(addr1.address, 16.5)).to.be.reverted;
    });

    it("Should revert transfers of negative amounts", async function () {
      await expect(vnnn.transfer(addr1.address, -100)).to.be.reverted;
    });
  });
});
