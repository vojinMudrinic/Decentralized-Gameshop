const hre = require("hardhat");
let fs = require("fs");
const path = require("path");

async function main() {
  const GameShop = await hre.ethers.deployContract("GameShop");
  await GameShop.waitForDeployment();

  const addressPath = path.join(
    __dirname,
    "../../frontend/gameshop/src/address"
  );

  if (!fs.existsSync(addressPath)) {
    fs.mkdirSync(addressPath, { recursive: true });
  }

  const contractAddress = GameShop.target;

  const address = {
    contract_address: contractAddress,
  };

  const json = JSON.stringify(address);
  const filePath = path.join(
    __dirname,
    "../../frontend/gameshop/src/address/address.json"
  );
  fs.writeFileSync(filePath, json);

  console.log(`Contract deployed to ${GameShop.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
