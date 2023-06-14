// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9;
import "./Token.sol";

contract FlashLoan {
    Token public token;

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function depositTokens(uint256 _amount) external {
        token.transferFrom(msg.sender, address(this), _amount);
    }
}
