const { expect } = require("chai");
const { constants, BN } = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");

const { fromRpcSig } = require("ethereumjs-util");
const ethSigUtil = require("@metamask/eth-sig-util");
const Wallet = require("ethereumjs-wallet").default;

const {
  EIP712Domain,
  Permit,
  domainSeparator,
} = require("./helpers/oz_eip712");

describe("ERC20 Permit", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let VNNN;
  let vnnn;
  let network;
  let name;
  let version;

  beforeEach(async function () {
    VNNN = await ethers.getContractFactory("VNNN");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    vnnn = await VNNN.deploy();
    await vnnn.deployed();

    network = await ethers.getDefaultProvider().getNetwork();

    name = await vnnn.name();
    version = "1";
    chainID = 31337;
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

  describe("Deployment", function () {
    it("Should set initial nonces to zero", async function () {
      expect(await vnnn.nonces(owner.address)).to.equal(0);
    });

    it("Should set the correct name", async function () {
      expect(await vnnn.name()).to.equal("VNNN");
    });

    it("Should set the correct symbol", async function () {
      expect(await vnnn.symbol()).to.equal("VNNN");
    });

    it("Should set the domain separator correctly", async function () {
      expect(await vnnn.DOMAIN_SEPARATOR()).to.equal(
        await domainSeparator(name, version, chainID, vnnn.address)
      );
    });
  });

  describe("Permit", function () {
    const wallet = Wallet.generate();
    const walletOwner = wallet.getAddressString();
    const wallet2 = Wallet.generate();
    const walletSpender = wallet2.getAddressString();
    const value = new BN(42);
    const nonce = 0;
    const maxDeadline = constants.MAX_UINT256;

    const buildData = (chainId, verifyingContract, deadline = maxDeadline) => ({
      primaryType: "Permit",
      types: { EIP712Domain, Permit },
      domain: { name, version, chainId, verifyingContract },
      message: { owner, owner, value, nonce, deadline },
    });

    it("Accepts owner signature", async function () {
      const mydata = buildData(chainID, vnnn.address);
      const signature = ethSigUtil.signTypedData({
        privateKey: wallet.getPrivateKey(),
        data: mydata,
        version: ethSigUtil.SignTypedDataVersion.V4,
      });
      const { v, r, s } = fromRpcSig(signature);

      const receipt = await vnnn.permit(
        owner.address,
        owner.address,
        value,
        maxDeadline,
        v,
        r,
        s
      );

      expect(await vnnn.nonces(walletOwner)).to.equal(1);
      expect(
        await vnnn.allowance(walletOwner, addr1.address)
      ).to.be.bignumber.equal(value);
    });

    it("Should revert if Permit is currently disabled", async function () {
      const mydata = buildData(chainID, vnnn.address);
      const signature = ethSigUtil.signTypedData({
        privateKey: wallet.getPrivateKey(),
        data: mydata,
        version: ethSigUtil.SignTypedDataVersion.V4,
      });
      const { v, r, s } = fromRpcSig(signature);
      await vnnn.disablePermit();
      await expect(
        vnnn
          .connect(addr1)
          .permit(owner.address, owner.address, 1000, maxDeadline, v, r, s)
      ).to.be.revertedWith(
        "VNNN: Use of the Permit function is currently not allowed."
      );
    });

    it("Should not revert if Permit is successfully called while allowed", async function () {
      const mydata = buildData(chainID, vnnn.address);
      const signature = ethSigUtil.signTypedData({
        privateKey: wallet.getPrivateKey(),
        data: mydata,
        version: ethSigUtil.SignTypedDataVersion.V4,
      });
      const { v, r, s } = fromRpcSig(signature);
      await expect(
        vnnn
          .connect(addr1)
          .permit(owner.address, owner.address, 1000, maxDeadline, v, r, s)
      ).to.not.be.reverted;
    });

    it("Should run when Permit is enabled", async function () {
      expect(await vnnn.permitAllowed()).to.equal(true);
    });

    it("Should allow Permit to be disabled", async function () {
      await vnnn.disablePermit();
      expect(await vnnn.permitAllowed()).to.equal(false);
    });

    it("Should allow disabled Permit to be re-enabled", async function () {
      await vnnn.disablePermit();
      expect(await vnnn.permitAllowed()).to.equal(false);
      await vnnn.allowPermit();
      expect(await vnnn.permitAllowed()).to.equal(true);
    });
  });
});
