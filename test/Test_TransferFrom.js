const { expect } = require("chai");
const { constants, BN } = require("@openzeppelin/test-helpers");
// const { ethers } = require("hardhat");

describe("Test TransferFrom", function () {
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
    await vnnn.approve(addr1.address, 10000);
    await vnnn.connect(addr1).approve(owner.address, 1000);
    await vnnn.connect(addr1).approve(addr2.address, 5000);
  });

  describe("TransferFrom", function () {
    it("Should allow user to transfer all of allowance", async function () {
      await expect(
        vnnn.connect(addr1).transferFrom(owner.address, addr1.address, 10000)
      ).to.not.be.reverted;
    });

    it("Should emit a Transfer event on successful transfer", async function () {
      await expect(
        vnnn.connect(addr1).transferFrom(owner.address, addr1.address, 1000)
      )
        .to.emit(vnnn, "Transfer")
        .withArgs(owner.address, addr1.address, 1000);
    });

    it("Should emit an Approval even on successful transfer", async function () {
      await expect(
        vnnn.connect(addr1).transferFrom(owner.address, addr1.address, 1000)
      )
        .to.emit(vnnn, "Approval")
        .withArgs(owner.address, addr1.address, 9000);
    });

    it("Should revert attempts to transfer greater than the allowance", async function () {
      await expect(
        vnnn.connect(addr1).transferFrom(owner.address, addr1.address, 12000)
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Should revert attempts to transfer greater than the balance", async function () {
      await expect(
        vnnn.connect(addr2).transferFrom(addr1.address, addr2.address, 1000)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should update the balance of the owner after successful transfer", async function () {
      await vnnn
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, 1000);
      expect(await vnnn.balanceOf(owner.address)).to.equal(9999999000);
    });

    it("Should update the balance of the recipient after successful transfer", async function () {
      await vnnn
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, 1000);
      expect(await vnnn.balanceOf(addr1.address)).to.equal(1000);
    });

    it("Should update the remaining allowance for the owner/recipient pair after successful transfer", async function () {
      await vnnn
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, 1000);
      expect(await vnnn.allowance(owner.address, addr1.address)).to.equal(9000);
    });

    it("Should allow transfer to third parties", async function () {
      await expect(
        vnnn.connect(addr1).transferFrom(owner.address, addr2.address, 1000)
      ).to.not.be.reverted;
    });

    it("Should update the balance of the third party correctly", async function () {
      await vnnn
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 1000);
      expect(await vnnn.balanceOf(addr2.address)).to.equal(1000);
    });

    it("Should revert negative amount transfer", async function () {
      await expect(vnnn.transferFrom(owner.address, addr1.address, -1000)).to.be
        .reverted;
    });
  });
});
