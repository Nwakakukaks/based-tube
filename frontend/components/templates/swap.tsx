import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const destinationToken = {
  name: 'USDC',
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  decimals: 6,
  image: 'https://cdn3d.iconscout.com/3d/premium/thumb/usdc-10229270-8263869.png?f=webp',
};

const sourceTokens: { [key: string]: { address: string; decimals: number } } = {
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
  },
  WETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  WBTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
  },
};

const Swap: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [expectedOutput, setExpectedOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>('DAI');

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    await getExpectedOutput(value);
  };

  const getExpectedOutput = async (amount: string) => {
    if (!amount) {
      setExpectedOutput('');
      return;
    }
    
    const uniswapV2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const uniswapV2RouterAbi = [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    ];

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, uniswapV2RouterAbi, signer);

      const fromToken = sourceTokens[selectedToken].address;
      const amountInWei = ethers.parseUnits(amount, sourceTokens[selectedToken].decimals);
      const path = [fromToken, destinationToken.address];

      const amountsOut = await uniswapV2Router.getAmountsOut(amountInWei, path);
      const expectedAmount = ethers.formatUnits(amountsOut[1], destinationToken.decimals);
      setExpectedOutput(`~${expectedAmount} USDC`);
    } catch (error) {
      console.error('Error fetching expected output:', error);
      setExpectedOutput('Error fetching expected output amount');
    }
  };

  const doSwap = async () => {
    if (!amount) return;

    const uniswapV2RouterAddress = '0x83eafF3C19083B03A8E0708F7637D0c4638E9FC9';
    const swapExactTokensForTokensAbi = [
      'function swapWithReferral(address referrer, uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline)',
    ];

    setLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const fromToken = sourceTokens[selectedToken].address;
      const amountInWei = ethers.parseUnits(amount, sourceTokens[selectedToken].decimals);
      const path = [fromToken, destinationToken.address];
      const deadline = Math.floor(Date.now() / 1000) + 1200;

      const uniswapV2Router = new ethers.Contract(uniswapV2RouterAddress, swapExactTokensForTokensAbi, signer);

      const swapTx = await uniswapV2Router.swapWithReferral(
        '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        amountInWei,
        0,
        path,
        '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        deadline
      );
      await swapTx.wait();
      alert('Swap Successful');
    } catch (error) {
      console.error('Swap error:', error);
      alert('Error during swap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swap-card bg-white rounded-lg p-4 w-11/12 max-w-lg shadow-md mx-auto mt-4">
      <p className="text-center text-xl font-bold mb-4">Buy USDC on UniswapV2</p>
      <p className="text-center text-red-500 mb-2">Note: Referrer gets a cut.</p>
      <div className="flex justify-around mb-4">
        <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="Coin logo" className="w-24 h-24" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/2051px-Uniswap_Logo.svg.png" alt="Uniswap logo" className="w-24 h-24" />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-sm text-gray-600 mb-1">From Token</label>
        <div className="flex items-center border border-gray-300 rounded-lg mb-4">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="From Token" className="w-6 h-6 mx-2" />
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="flex-1 bg-transparent p-2 border-none outline-none"
          >
            {Object.keys(sourceTokens).map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center border border-gray-300 rounded-lg mb-4">
        <img src={destinationToken.image} alt="USDC" className="w-6 h-6 mx-2" />
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Input token amount"
          className="flex-1 bg-transparent p-2 border-none outline-none"
        />
      </div>
      <p className="text-center mb-4">{expectedOutput}</p>
      <button
        onClick={doSwap}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-bold transition duration-300 ${loading ? 'bg-gradient-to-r from-blue-400 to-pink-400 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Executing swap...' : 'Buy USDC'}
      </button>
    </div>
  );
};

export default Swap;
