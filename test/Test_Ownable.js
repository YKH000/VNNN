const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");
// const { ethers } = require("hardhat");

describe("Ownership", function () {
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

  describe("Transfer", function () {
    it("Should revert attempts to transfer ownership by non-owners", async function () {
      await expect(
        vnnn.connect(addr1).transferOwnership(addr1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should report the new owner after transferring ownership", async function () {
      await vnnn.transferOwnership(addr1.address);
      expect(await vnnn.owner()).to.equal(addr1.address);
    });

    it("Should emit an OwnershipTransferred event on successful transfer of ownership", async function () {
      await expect(vnnn.transferOwnership(addr1.address))
        .to.emit(vnnn, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);
    });

    it("Should revert ownership transfer to the zero address", async function () {
      await expect(
        vnnn.transferOwnership(constants.ZERO_ADDRESS)
      ).to.be.revertedWith("Ownable: new owner is the zero address");
    });
  });

  describe("Renounce", function () {
    it("Should revert attempts to transfer ownership by non-owners", async function () {
      await expect(
        vnnn.connect(addr1).transferOwnership(addr1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should report zero address as the new owner after renouncing ownership", async function () {
      await vnnn.renounceOwnership();
      expect(await vnnn.owner()).to.equal(constants.ZERO_ADDRESS);
    });

    it("Should emit an OwnershipTransferred even on successful renounciation of ownership", async function () {
      await expect(vnnn.renounceOwnership())
        .to.emit(vnnn, "OwnershipTransferred")
        .withArgs(owner.address, constants.ZERO_ADDRESS);
    });
  });
});
