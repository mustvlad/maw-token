import { ethers, upgrades } from "hardhat";

import type { MAW } from "../../types/contracts";
import type { MAW__factory } from "../../types/factories/contracts";

export async function deployMAWFixture() {
  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();

  const mawFactory = (await ethers.getContractFactory("MAW")) as MAW__factory;
  const maw = (await upgrades.deployProxy(mawFactory, [owner.address], {
    initializer: "initialize",
  })) as unknown as MAW;

  const mawAddress = await maw.getAddress();

  return { maw, mawAddress, owner, otherAccount };
}
