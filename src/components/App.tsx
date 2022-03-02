import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import './App.css'
import Web3 from 'web3';
import * as DaiToken from '../abis/DaiToken.json';
import * as DappToken from '../abis/DappToken.json';
import * as TokenFarm from '../abis/TokenFarm.json';

function App(props: any) {

  const web3 = useRef<any>(null);

  const [account, setAccount] = useState('0x0');
  const [daiToken, setDaiToken] = useState<any>({});
  const [dappToken, setDappToken] = useState<any>({});
  const [tokenFarm, setTokenFarm] = useState<any>({});
  const [daiTokenBalance, setDaiTokenBalance] = useState('0');
  const [dappTokenBalance, setDappTokenBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  const loadBlockchainData = async () => {
    web3.current = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545");
    const accounts = await web3.current.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId: number = await web3.current.eth.net.getId(); // 5777

    // Load Dai Token Info
    const daiTokenData = DaiToken.networks[5777];
    if (daiTokenData) {
      const daiTokenContract = new web3.current.eth.Contract(DaiToken.abi, daiTokenData.address);
      setDaiToken(daiTokenContract);
      const daiTokenInitialBalance = await daiTokenContract.methods.balanceOf(accounts[0]).call();
      setDaiTokenBalance(daiTokenInitialBalance.toString());
    } else {
      window.alert("Dai Token smart contract is not deployed to the blockchain");
    }

    // Load Dapp Token Info
    const dappTokenData = DappToken.networks[5777];
    if (dappTokenData) {
      const daiTokenContract = new web3.current.eth.Contract(DappToken.abi, dappTokenData.address);
      setDappToken(daiTokenContract);
      const dappTokenInitialBalance = await daiTokenContract.methods.balanceOf(accounts[0]).call();
      setDappTokenBalance(dappTokenInitialBalance.toString());
    } else {
      window.alert("Dapp Token smart contract is not deployed to the blockchain");
    }

    // Load Token Farm Token Info 
    const tokenFarmData = TokenFarm.networks[5777];
    if (tokenFarmData) {
      const tokenFarmContract = new web3.current.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      setTokenFarm(tokenFarmContract);
      const initialStakingBalance = await tokenFarmContract.methods.stakingBalance(accounts[0]).call();
      setStakingBalance(initialStakingBalance);
    } else {
      window.alert("Token Farm smart contract is not deployed to the blockchain");
    }

    // setTimeout(() => setLoading(false), 2000);
    setLoading(false);
  }

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const stakeTokens = (amount: string) => {
    console.log(`Staking ${amount} tokens!`);
    setLoading(true);
    // Stake the tokens;
    console.log(tokenFarm);
    console.log(daiToken);
    daiToken.methods.approve(tokenFarm._address, amount).send({ from: account })
      .on('transactionHash', (txnHash: any) => {
        tokenFarm.methods.stakeTokens(amount).send({ from: account })
          .on('transactionHash', (txnHash: any) => {
            console.log("Tokens Staked!");
            setLoading(false);
          })
      })
      .on('error', (err: any) => console.log("Error : ", err))
      .on('receipt', (receipt: any) => console.log("Receipt: ", receipt))
      .on('confirmation', (confNum: any, receipt: any) => console.log("Confirmation Number, Receipt : ", confNum, receipt));
  }

  const unstakeTokens = () => {
    setLoading(true);
    tokenFarm.methods.unstakeTokens().send({ from: account })
      .on('transactionHash', (txnHash: any) => {
        console.log("Tokens Unstaked!");
        setLoading(false);
      })
      .on('error', (err: any) => console.log("Error : ", err))
      .on('receipt', (receipt: any) => console.log("Receipt: ", receipt))
      .on('confirmation', (confNum: any, receipt: any) => console.log("Confirmation Number, Receipt : ", confNum, receipt));
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="d-flex justify-content-center align-items-center mt-5">
        {loading ?
          <h1 className="text-center">Loading...</h1>
          :
          <Main
            web3={web3.current}
            daiTokenBalance={daiTokenBalance}
            dappTokenBalance={dappTokenBalance}
            stakingBalance={stakingBalance}
            stakeTokens={stakeTokens}
            unstakeTokens={unstakeTokens} />
        }
      </div>
    </div>
  );
}

export default App;

