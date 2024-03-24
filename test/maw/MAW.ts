// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
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

    //   describe("Validations", function () {
    //     it("Should revert with the right error if called too soon", async function () {
    //       await expect(this.lock.withdraw()).to.be.revertedWithCustomError(this.lock, "UnlockTimeNotReached");
    //     });

    //     it("Should revert with the right error if called from another account", async function () {
    //       // We can increase the time in Hardhat Network
    //       await time.increaseTo(this.unlockTime);

    //       // We use lock.connect() to send a transaction from another account
    //       await expect(this.lock.connect(this.otherAccount).withdraw()).to.be.revertedWithCustomError(
    //         this.lock,
    //         "NotOwner",
    //       );
    //     });

    //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //       // Transactions are sent using the first signer by default
    //       await time.increaseTo(this.unlockTime);

    //       await expect(this.lock.withdraw()).not.to.be.reverted;
    //     });
    //   });

    //   describe("Events", function () {
    //     it("Should emit an event on withdrawals", async function () {
    //       await time.increaseTo(this.unlockTime);

    //       await expect(this.lock.withdraw()).to.emit(this.lock, "Withdrawal").withArgs(this.lockedAmount, anyValue); // We accept any value as `when` arg
    //     });
    //   });

    describe("Transfers", function () {
      // it("Should transfer the funds to the owner", async function () {
      //   await time.increaseTo(this.unlockTime);

      //   await expect(this.lock.withdraw()).to.changeEtherBalances(
      //     [this.owner, this.lock],
      //     [this.lockedAmount, -this.lockedAmount],
      //   );
      // });

      it("Should be able to transfer tokens to another account", async function () {
        const amount = ethers.parseUnits("100", 18);
        await this.maw.transfer(this.otherAccount.address, amount);

        expect(await this.maw.balanceOf(this.otherAccount.address)).to.equal(amount);
      });
    });
  });
});
