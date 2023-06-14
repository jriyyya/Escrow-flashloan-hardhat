import { ethers } from "hardhat";
import { expect } from "chai";

const tokens = (n: any) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;
describe("RealEstate", () => {
  let realEstate: any, escrow: any;
  let deployer, seller: any, buyer: any;
  let inspector: any, lender: any;
  let accounts;
  let nftID = 1;
  let purchasePrice = ether(100);
  let escrowAmount = ether(20);

  beforeEach(async () => {
    // Setup accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];
    inspector = accounts[2];
    lender = accounts[3];

    // Load Contracts
    let transaction;
    const RealEstate = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    //Deploy Contract
    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      realEstate.address,
      nftID,
      purchasePrice,
      escrowAmount,
      seller.address,
      buyer.address,
      inspector.address,
      lender.address
    );
    transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, nftID);
    await transaction.wait();
  });

  describe("Deployment", async () => {
    it("sends an NFT to the seller / deployer", async () => {
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
    });
  });

  describe("Selling real estate", async () => {
    let transaction: any, balance: any;
    it("Executes a successful transaction", async () => {
      // expects seller to be NFT owner before the sale
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);

      escrowAmount;

      // Check escorw balance
      balance = await escrow.connect(buyer).getBalance();
      console.log("Escrow Balance: ", ethers.utils.formatEther(balance));

      //Buyer deposits earnest
      transaction = await escrow
        .connect(buyer)
        .depositEarnest({ value: escrowAmount });

      // Check escorw balance
      balance = await escrow.connect(buyer).getBalance();
      console.log("Escrow Balance: ", ethers.utils.formatEther(balance));

      // Inspector update status
      transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(true);

      // Buyer approves it
      transaction = await escrow.connect(buyer).approveSale();
      await transaction.wait();

      // Seller approves it
      transaction = await escrow.connect(seller).approveSale();
      await transaction.wait();

      // Lender funds sale
      transaction = await lender.sendTransaction({
        to: escrow.address,
        value: ether(80),
      });
      await transaction.wait();

      // Lender approves it
      transaction = await escrow.connect(lender).approveSale();
      await transaction.wait();

      // Finalize sale
      transaction = await escrow.connect(buyer).finalizeSale();
      await transaction.wait();
      console.log("Buyer finalizes the sale");

      // Expects buyer to be NFT owner before the sale
      expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);

      // Expect Seller to recieve Funds

      balance = await ethers.provider.getBalance(seller.address);
      console.log("Seller Balance: ", ethers.utils.formatEther(balance));
      expect(balance).to.be.above(ether(10099));
    });
  });
});
