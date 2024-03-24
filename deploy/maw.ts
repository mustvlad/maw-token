import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const mawFactory = await hre.ethers.getContractFactory("MAW");

  const maw = await hre.upgrades.deployProxy(mawFactory, [deployer], { initializer: "initialize" });
  await maw.waitForDeployment();

  console.log("MAW deployed to:", await maw.getAddress());
};
export default func;
func.id = "deploy_maw"; // id required to prevent reexecution
func.tags = ["MAW"];
