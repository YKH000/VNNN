const { expect } = require("chai");
// const { ethers } = require("hardhat");

describe("Test Authorizable", function () {
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
  });
});
