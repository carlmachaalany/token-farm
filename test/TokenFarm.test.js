const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  // before running test, call this
  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to the Token Farm contract.
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));

    // Transfer 100 Mock Dai tokens to investor. Third argument is required in tests to state who is actually calling the transfer function
    await daiToken.transfer(investor, tokens('100'), { from: owner });
  });
  
  describe("Mock Dai deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens('1000000'));
    })
  });

  describe('Farming tokens', async () => {
      it("rewards investors for staking mDai tokens", async () => {
          let result;
          // Check investor balance before staking
          result = await daiToken.balanceOf(investor);
          assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking');
          
          // Stake Dai tokens
          await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor});
          await tokenFarm.stakeTokens(tokens('100'), {from: investor});

          // Check staking result
          result = await daiToken.balanceOf(investor);
          assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking');

          result = await daiToken.balanceOf(tokenFarm.address);
          assert.equal(result.toString(), tokens('100'), 'Token Farm Mock Dai wallet balance correct after staking');
          
          result = await tokenFarm.stakingBalance(investor);
          assert.equal(result.toString(), tokens('100'), 'Investor staking balance correct after staking');

          result = await tokenFarm.isStaking(investor);
          assert.equal(result.toString(), "true", "Investor is recorded staking correctly after staking");

          // Issuing tokens
          await tokenFarm.issueTokens({from: owner});
          result = await dappToken.balanceOf(investor);
          assert.equal(result.toString(), tokens('100'), "Investor was issued the right amount of Dapp Tokens");
          
          // Ensure that only owner can issue tokens
          await tokenFarm.issueTokens({from: investor}).should.be.rejected;
          
          // Unstaking tokens
          await tokenFarm.unstakeTokens({from: investor});
          result = await daiToken.balanceOf(investor);
          assert.equal(result.toString(), tokens('100'), "Unstaking tokens to investor works correctly");

          result = await daiToken.balanceOf(tokenFarm.address);
          assert.equal(result.toString(), tokens('0'), 'Dai balance of contract after unstaking is correct');
        })
  })

});
