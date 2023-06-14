import { ethers } from "hardhat";
import { expect } from "chai";
const tokens = (n: any) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;
describe("FlashLoan", () => {
  let accounts;
  let deployer;
  let token;
  let flashLoan;
  beforeEach(async () => {
    //Setup accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    //Load Accounts
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const FlashLoanReceiver = await ethers.getContractFactory(
      "FlashLoanReceiver"
    );
    const Token = await ethers.getContractFactory("Token");

    // Deploy Token
    token = await Token.deploy("Riya Jain", "jriyyya", "1000000");

    // Deploy Flash Loan Pool
    flashLoan = await FlashLoan.deploy(token.address);
  });
  describe("Deployment", () => {
    it("works", () => {
      expect(1 + 1).to.equal(2);
    });
  });
});
