import React, { useState } from 'react';
import { init } from './components/Web3Client';
import NavbarHome from './components/NavbarHome';
import MainMenu from './components/MainMenu';
import Home from './components/home';

function App() {
  let [AddressEth, setAddressEth] = useState('loading...');

  const web3Handler = async () => {
    let address = (await init()) ? await init() : 'No Account Selected';
    setAddressEth(address);
  };

  web3Handler();

  return (
    <div className='App'>
      {/* <NavbarHome addr={AddressEth} />*/}
      <Home addr={AddressEth} />
      <MainMenu addr={AddressEth} />
    </div>
  );
}

export default App;
