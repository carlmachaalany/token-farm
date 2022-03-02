const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

// truffle migrate to run migration
// deployer is the address that deploys the contracts to the network
// network is the network
// accounts is an array of accounts on the network
module.exports = async function (deployer, network, accounts) {
  // Deploy DaiToken
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  
  // Deploy DappToken
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  // Deploy Token Farm. deployer.deploy(contract, ...args, ...options)
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all Dapp tokens to the Token Farm contract.
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer 100 Mock Dai tokens to investor.
  await daiToken.transfer(accounts[1], '100000000000000000000');
};
