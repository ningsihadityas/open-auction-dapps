import React, { useState } from 'react';
import { init } from './components/Web3Client';
import NavbarHome from './components/NavbarHome';
import MainMenu from './components/MainMenu';

function App() {
  let [AddressEth, setAddressEth] = useState('loading...');

  const web3Handler = async () => {
    let address = (await init()) ? await init() : 'No Account Selected';
    setAddressEth(address);
  };

  web3Handler();

  return (
    <div className='App'>
      <NavbarHome addr={AddressEth} />
      <MainMenu addr={AddressEth} />
    </div>
  );
}

export default App;
