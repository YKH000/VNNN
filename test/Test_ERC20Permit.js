const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");
// const { ethers } = require("hardhat");

describe("ERC20 Permit", function () {
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

  describe("Allow/Disallow Permit", function () {
    it("Should allow Permit to be used on deployment", async function () {
      expect(await vnnn.permitAllowed()).to.equal(true);
    });

    it("Should allow owner to disable Permit", async function () {
      await expect(vnnn.disablePermit()).to.not.be.reverted;
    });

    it("Should disable Permit after disablePermit is successfully called", async function () {
      await vnnn.disablePermit();
      expect(await vnnn.permitAllowed()).to.equal(false);
    });

    it("Should revert attempts to disable Permit by non-owners", async function () {
      await expect(vnnn.connect(addr1).disablePermit()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should allow owner to enable Permit using allowPermit", async function () {
      await vnnn.disablePermit();
      await expect(vnnn.allowPermit()).to.not.be.reverted;
    });

    it("Should revert attempts to enable Permit by non-owners", async function () {
      await vnnn.disablePermit();
      await expect(vnnn.connect(addr1).allowPermit()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should enable Permit after allowPermit is successfully called", async function () {
      await vnnn.disablePermit();
      await vnnn.allowPermit();
      expect(await vnnn.permitAllowed()).to.equal(true);
    });
  });

  describe("ERC20 Permit", function () {
    it("Should revert if Permit is currently disabled", async function () {
      await vnnn.disablePermit();
      await expect(
        vnnn.connect(addr1).permit(owner.address, addr1.address, 1000)
      ).to.be.revertedWith(
        "VNNN: Use of the Permit function is currently not allowed."
      );
    });

    it("Should not revert if Permit is successfully called while allowed", async function () {
      await expect(
        vnnn.connect(addr1).permit(owner.address, addr1.address, 1000)
      ).to.not.be.reverted;
    });
  });
});
