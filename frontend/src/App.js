import React, { useState } from 'react';
import { init } from './components/Web3Client';
import MainMenu from './components/MainMenu';
import Home from './components/home';
import { useEffect } from 'react';
import Web3 from 'web3';
import MainAuction from 'contracts/MainAuction.json';

function App() {
  let [AddressEth, setAddressEth] = useState('loading...');

  const web3Handler = async () => {
    let address = (await init()) ? await init() : 'No Account Selected';
    setAddressEth(address);
  };

  web3Handler();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className='App'>
      <Home addr={AddressEth} />
      <MainMenu addr={AddressEth} />
    </div>
  );
}

export default App;
