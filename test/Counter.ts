import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", () => {
  let counter: any;

  beforeEach(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy("My Counter", 1);
  });

  describe("Deployment", () => {
    it("stores the initial count", async () => {
      // Fetch the count
      // Check the count to make sure it's what we expect
      expect(await counter.count()).to.equal(1);
    });
    it("stores the initial name", async () => {
      const name = await counter.name();
      expect(name).to.equal("My Counter");
    });
  });

  describe("Counting", () => {
    let transaction;

    it('reads the count from the "count" public variable', async () => {
      expect(await counter.count()).to.equal(1);
    });

    it('reads the count from the "getCount()" variable', async () => {
      expect(await counter.getCount()).to.equal(1);
    });

    it('reads the count from the "name" public variable', async () => {
      expect(await counter.name()).to.equal("My Counter");
    });

    it('reads the count from the "getName()" variable', async () => {
      expect(await counter.getName()).to.equal("My Counter");
    });

    it("updates the name", async () => {
      transaction = await counter.setName("New Name");
      await transaction.wait();
      expect(await counter.name()).to.equal("New Name");
    });

    it("increments the count", async () => {
      transaction = await counter.increment();
      await transaction.wait();

      expect(await counter.count()).to.equal(2);
    });

    it("Decrements the count", async () => {
      transaction = await counter.decrement();
      await transaction.wait();

      expect(await counter.count()).to.equal(0);

      //cannot decrement count below 0
      await expect(counter.decrement()).to.be.reverted;
    });
  });
});
