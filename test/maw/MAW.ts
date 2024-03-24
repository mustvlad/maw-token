import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { deployMAWFixture } from "./MAW.fixture";

describe("MAW", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("Deployment", function () {
    beforeEach(async function () {
      const { maw, mawAddress, owner } = await this.loadFixture(deployMAWFixture);
      this.maw = maw;
      this.mawAddress = mawAddress;
      this.owner = owner;
    });

    it("Should set the right owner", async function () {
      expect(await this.maw.owner()).to.equal(this.owner.address);
    });

    it("Should premint 1,000,000,000 tokens to the owner", async function () {
      const expectedBalance = ethers.parseUnits("1000000000", 18);
      expect(await this.maw.balanceOf(this.owner.address)).to.equal(expectedBalance);
    });
  });

  describe("Usage", function () {
    beforeEach(async function () {
      const { maw, mawAddress, owner, otherAccount } = await this.loadFixture(deployMAWFixture);
      this.maw = maw;
      this.mawAddress = mawAddress;
      this.owner = owner;
      this.otherAccount = otherAccount;
    });

    describe("Transfers", function () {
      it("Should be able to transfer tokens to another account", async function () {
        const amount = ethers.parseUnits("100", 18);
        await this.maw.transfer(this.otherAccount.address, amount);

        expect(await this.maw.balanceOf(this.otherAccount.address)).to.equal(amount);
      });

      it("Should be able to burn tokens", async function () {
        const amount = ethers.parseUnits("100", 18);
        await this.maw.burn(amount);

        expect(await this.maw.totalSupply()).to.equal(ethers.parseUnits("999999900", 18));
      });
    });
  });
});
