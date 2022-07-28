const { expect } = require("chai");
const { constants, BN } = require("@openzeppelin/test-helpers");
// const { ethers } = require("hardhat");

describe("Test Allowances", function () {
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

    this.value = new BN(constants.MAX_UINT256);
  });

  describe("Allowance", function () {
    it("Should report zero allowance when contract is first deployed", async function () {
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(0);
    });
  });

  describe("Approve", function () {
    it("Should give the correct allowance on successful Approval", async function () {
      await vnnn.approve(addr1.address, 1000);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(1000);
    });

    it("Should emit Approval event on successful Approve", async function () {
      await expect(vnnn.approve(addr1.address, 1000))
        .to.emit(vnnn, "Approval")
        .withArgs(owner.address, addr1.address, 1000);
    });

    it("Should revert attempts to approve zero address", async function () {
      await expect(
        vnnn.approve(constants.ZERO_ADDRESS, 1000)
      ).to.be.revertedWith("ERC20: approve to the zero address");
    });

    it("Should overwrite existing allowance", async function () {
      await vnnn.approve(addr1.address, 1000);
      await vnnn.approve(addr1.address, 5555);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(5555);
    });
  });

  describe("Increase Allowance", function () {
    it("Should increase allowance from zero", async function () {
      await vnnn.increaseAllowance(addr1.address, 1000);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(1000);
    });

    it("Should increase allowance from positive amount", async function () {
      await vnnn.increaseAllowance(addr1.address, 1000);
      await vnnn.increaseAllowance(addr1.address, 5555);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(6555);
    });

    it("Should revert attempts to overflow allowance", async function () {
      await vnnn.increaseAllowance(addr1.address, 1);
      await expect(
        vnnn.increaseAllowance(addr1.address, Number(constants.MAX_UINT256))
      ).to.be.reverted;
    });

    it("Should emit Approval event on successful increase", async function () {
      await expect(vnnn.increaseAllowance(addr1.address, 1))
        .to.emit(vnnn, "Approval")
        .withArgs(owner.address, addr1.address, 1);
    });
  });

  describe("Decrease Allowance", function () {
    it("Should revert attempts to underflow allowance", async function () {
      await expect(
        vnnn.decreaseAllowance(addr1.address, 1000)
      ).to.be.revertedWith("ERC20: decreased allowance below zero");
    });

    it("Should report new allowance after successfully decreasing", async function () {
      await vnnn.approve(addr1.address, 1000);
      await vnnn.decreaseAllowance(addr1.address, 343);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(657);
    });

    it("Should allow decrease of allowance to zero", async function () {
      await vnnn.approve(addr1.address, 1000);
      await expect(vnnn.decreaseAllowance(addr1.address, 1000)).to.not.be
        .reverted;
    });

    it("Should report zero allowance on decrease to zero", async function () {
      await vnnn.approve(addr1.address, 1000);
      await vnnn.decreaseAllowance(addr1.address, 1000);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(0);
    });

    it("Should emit an approval event on successful decrease", async function () {
      await vnnn.approve(addr1.address, 1000);
      await expect(vnnn.decreaseAllowance(addr1.address, 555))
        .to.emit(vnnn, "Approval")
        .withArgs(owner.address, addr1.address, 445);
    });
  });
});
