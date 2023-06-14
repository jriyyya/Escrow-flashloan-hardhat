import { ethers } from "hardhat";
import { expect } from "chai";
const tokens = (n: any) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;
describe("FlashLoan", () => {
  let accounts;
  let deployer;
  let token: any;
  let flashLoan: any;

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

    // Approve the token
    let transaction = await token
      .connect(deployer)
      .approve(flashLoan.address, tokens(1000000));
    await transaction.wait();

    // DXeposit tokens into the pool
    transaction = await flashLoan
      .connect(deployer)
      .depositTokens(tokens(1000000));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("works", async () => {
      expect(await token.balanceOf(flashLoan.address)).to.equal(
        tokens(1000000)
      );
    });
  });
});
