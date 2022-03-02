// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import "./DappToken.sol";
import "./DaiToken.sol";

// Purpose of this contract is to take Dai Tokens and issue back to the user Dapp Tokens.
contract TokenFarm {
    address public owner;
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers; // keep track of that to know who to issue tokens to later
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked; // keep track of people who has ever staked
    mapping(address => bool) public isStaking; // keep track of people who are staking

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // Staking tokens (Deposit)
    // Summary: Send dai tokens from the investor's wallet to the contract address
    function stakeTokens(uint256 _amount) public {
        // require(daiToken.balanceOf(msg.sender) >= _amount);
        require(_amount > 0, "Amount cannot be 0");

        // Transfer Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] += _amount;

        // Add user to stakers array *only* if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender); // add staker to the list of stakers
        }

        // Update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstaking (Withdraw)
    function unstakeTokens() public {
        require(stakingBalance[msg.sender] > 0, "You haven't staked any money!");
        daiToken.transfer(msg.sender, stakingBalance[msg.sender]);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    //Issuing Tokens (Earning interest)
    function issueTokens() public {
        // only the owner of the contract can issue tokens
        require(msg.sender == owner, "Only the owner can issueTokens");

        // go over all stakers, and issue them dapp tokens, same amount they stakes in Dai.
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(stakers[i], stakingBalance[stakers[i]]);
            }
        }
    }
}
