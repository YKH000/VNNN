const hre = require("hardhat");

async function main() {
  const VNNN = await hre.ethers.getContractFactory("VNNN");
  const vnnn = await VNNN.deploy();

  await vnnn.deployed();

  console.log(`VNNN Contract successfully deployed to ${vnnn.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
