const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");
// const { ethers } = require("hardhat");

describe("Test Authorizable and Mint/Burn", function () {
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

  describe("Authorizable", function () {
    // Placeholder for tests of the Authorizable functions
    it("Should not make the owner Authorized on deployment", async function () {
      expect(await vnnn.isAuthorized(owner.address)).to.equal(false);
    });

    it("Should allow the owner to Authorize themselves", async function () {
      await vnnn.addAuthorized(owner.address);
      expect(await vnnn.isAuthorized(owner.address)).to.equal(true);
    });

    it("Should emit authorized on successful addAuthorized", async function () {
      await expect(vnnn.addAuthorized(owner.address))
        .to.emit(vnnn, "authorized")
        .withArgs(owner.address);
    });

    it("Should revert attempts to addAuthorized by non-owners", async function () {
      await expect(
        vnnn.connect(addr1).addAuthorized(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to Authorize non-owners", async function () {
      expect(vnnn.addAuthorized(addr1)).to.not.be.reverted;
    });

    it("Should revert attempts to revokeAuthorized by non-owners", async function () {
      await vnnn.addAuthorized(addr2.address);
      await expect(
        vnnn.connect(addr1).revokeAuthorized(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to revokeAuthorized authorized accounts", async function () {
      await vnnn.addAuthorized(addr2.address);
      await vnnn.revokeAuthorized(addr2.address);
      expect(await vnnn.isAuthorized(addr2.address)).to.equal(false);
    });

    it("Should emit revoked on successful revokeAuthorized attempt", async function () {
      await vnnn.addAuthorized(addr2.address);
      await expect(vnnn.revokeAuthorized(addr2.address))
        .to.emit(vnnn, "revoked")
        .withArgs(addr2.address);
    });
  });

  describe("Mint/Burn", function () {
    it("Should revoke attempts to mint by non-Authorized", async function () {
      await expect(vnnn.mint(owner.address, 100)).to.be.revertedWith(
        "VNNN: Caller not authorized to mint tokens"
      );
    });

    it("Should allow Authorized accounts to mint tokens", async function () {
      await vnnn.addAuthorized(owner.address);
      await expect(vnnn.mint(owner.address, 100)).to.not.be.reverted;
    });

    it("Should show the correct balance after minting", async function () {
      await vnnn.addAuthorized(owner.address);
      await vnnn.mint(addr1.address, 100);
      expect(await vnnn.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should update totalSupply after minting", async function () {
      await vnnn.addAuthorized(owner.address);
      await vnnn.mint(addr1.address, 100);
      expect(await vnnn.totalSupply()).to.equal(10000000100);
    });

    it("Should emit a Transfer event after minting", async function () {
      await vnnn.addAuthorized(owner.address);
      await expect(vnnn.mint(addr1.address, 100))
        .to.emit(vnnn, "Transfer")
        .withArgs(constants.ZERO_ADDRESS, addr1.address, 100);
    });

    //Should not allow mint to overflow totalSupply
  });
});
