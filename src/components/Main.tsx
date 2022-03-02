import React, { useRef } from 'react';
import dai from '../assets/dai.png';

function Main({ web3, daiTokenBalance, dappTokenBalance, stakingBalance, stakeTokens, unstakeTokens }: any) {

    const inputRef = useRef(null);

    const handleStake = (e: any) => {
        e.preventDefault();
        //@ts-ignore
        let amount = inputRef.current.value;
        amount = web3.utils.toWei(amount, 'ether');
        stakeTokens(amount);
    }

    const handleUnstake = (e: any) => {
        e.preventDefault();
        unstakeTokens();
    }

    return (
        <div className='mt-3 text-center'>
            <table className='table table-borderless text-muted'>
                <thead>
                    <tr>
                        <th scope='col'>Staking Balance</th>
                        <th scope='col'>Reward Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{web3.utils.fromWei(stakingBalance, 'ether')} mDAI</td>
                        <td>{web3.utils.fromWei(dappTokenBalance, 'ether')} DAPP</td>
                    </tr>
                </tbody>
            </table>
            <div className="card mb-4">
                <div className="card-body">
                    <form className="mb-2" onSubmit={handleStake}>
                        <div>
                            <label className="float-start"><b>Stake Tokens</b></label>
                            <span className="float-end text-muted">Balance: {web3.utils.fromWei(daiTokenBalance, 'ether')}</span>
                        </div>
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                ref={inputRef}
                                className="form-control form-control-lg" 
                                placeholder='0' 
                                aria-describedby="addon" 
                                required />
                            <div className="input-group-text" id="addon">
                                <img src={dai} height='32'></img>
                                &nbsp; mDAI
                            </div>
                        </div>
                        <button type='submit' className='w-100 btn btn-primary btn-block btn-lg'>STAKE!</button>
                    </form>
                    <button onClick={handleUnstake} className='w-100 btn btn-primary btn-block btn-lg'>UNSTAKE!</button>
                </div>
            </div>
        </div>
    );
}

export default Main;
