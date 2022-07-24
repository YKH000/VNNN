const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");
// const { ethers } = require("hardhat");

describe("Test ownership transfer and renounciation", function () {
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

  describe("Add / Revoke VNNN Contracts", function () {
    it("Should revert attempts to add VNNN Contract by non-owners", async function () {
      await expect(
        vnnn.connect(addr1).addVNNNContract(addr1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow the owner to add VNNN Contracts", async function () {
      await expect(vnnn.addVNNNContract(addr1.address)).to.not.be.reverted;
    });

    it("Should allow the owner to revoke VNNN Contracts", async function () {
      await expect(vnnn.revokeVNNNContract(addr1.address)).to.not.be.reverted;
    });

    it("Should revert attempts to revoke VNNN Contract by non-owners", async function () {
      await expect(
        vnnn.connect(addr1).revokeVNNNContract(addr1.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Add / Revoke VNNN Permit", function () {
    it("Should show the current VNNN Permit status for an address", async function () {
      expect(await vnnn.isVNNNPermitted(owner.address, addr1.address)).to.equal(
        false
      );
    });

    it("Should allow user to allow VNNN Contract permit", async function () {
      await vnnn.vnnnPermit(addr1.address);
      expect(await vnnn.isVNNNPermitted(owner.address, addr1.address)).to.equal(
        true
      );
    });

    it("Should allow user to revoke VNNN Contract permit", async function () {
      await vnnn.vnnnPermit(addr1.address);
      await vnnn.vnnnPermitRevoke(addr1.address);
      expect(await vnnn.isVNNNPermitted(owner.address, addr1.address)).to.equal(
        false
      );
    });
  });

  describe("vnnnBurnFrom", function () {
    it("Should revert attempts by non-VNNN Contracts to use this function", async function () {
      await vnnn.vnnnPermit(addr1.address);
      await expect(
        vnnn.connect(addr1).vnnnBurnFrom(owner.address, 1000)
      ).to.be.revertedWith(
        "VNNN: Caller is not a VNNN Contract and cannot use this function"
      );
    });

    it("Should revert attempts by VNNN Contracts without VNNN Permit to use this function", async function () {
      await vnnn.addVNNNContract(addr1.address);
      await expect(
        vnnn.connect(addr1).vnnnBurnFrom(owner.address, 1000)
      ).to.be.revertedWith(
        "VNNN: User has not allowed VNNN Contract to call this function"
      );
    });

    it("Should revert attempts to burn by non-Contracts with Permit", async function () {
      await vnnn.addVNNNContract(addr1.address);
      await vnnn.vnnnPermit(addr1.address);
      await expect(
        vnnn.connect(addr1).vnnnBurnFrom(owner.address, 1000)
      ).to.be.revertedWith("VNNN: Caller must be a contract");
    });
  });

  describe("vnnnTransferFrom", function () {
    it("Should revert attempts by non-VNNN Contracts to use this function", async function () {
      await vnnn.vnnnPermit(addr1.address);
      await expect(
        vnnn.connect(addr1).vnnnTransferFrom(owner.address, addr1.address, 1000)
      ).to.be.revertedWith(
        "VNNN: Caller is not a VNNN Contract and cannot use this function"
      );
    });

    it("Should revert attempts by VNNN Contracts without VNNN Permit to use this function", async function () {
      await vnnn.addVNNNContract(addr1.address);
      await expect(
        vnnn.connect(addr1).vnnnTransferFrom(owner.address, addr1.address, 1000)
      ).to.be.revertedWith(
        "VNNN: User has not allowed VNNN Contract to call this function"
      );
    });

    it("Should revert attempts to burn by non-Contracts with Permit", async function () {
      await vnnn.addVNNNContract(addr1.address);
      await vnnn.vnnnPermit(addr1.address);
      await expect(
        vnnn.connect(addr1).vnnnTransferFrom(owner.address, addr1.address, 1000)
      ).to.be.revertedWith("VNNN: Caller must be a contract");
    });
  });
});
