import React, { useState, useEffect } from 'react';
import { init } from './components/Web3Client';
import MainMenu from './components/MainMenu';
import Home from './components/home';
import MainAuction from 'contracts/MainAuction.json';
import getWeb3 from './getWeb3';
import Header from './components/header';
import Web3 from 'web3';

function App() {
  // const useStyles = makeStyles({
  //   root: {
  //     flexGrow: 1,
  //   },
  // });
  // const classes = useStyles();

  let [AddressEth, setAddressEth] = useState('loading...');
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });
  const [storageValue, setStorageValue] = useState(0);

  const web3Handler = async () => {
    let address = (await init()) ? await init() : 'No Account Selected';
    setAddressEth(address);
  };

  web3Handler();

  useEffect(() => {
    const init = async () => {
      try {
        // const web3 = await getWeb3();
        let provider = window.ethereum;
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MainAuction.networks[networkId];
        const instance = new web3.eth.Contract(
          MainAuction.abi,
          deployedNetwork && deployedNetwork.address
        );
        setState({ web3, accounts, contract: instance });
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract.
             Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  const runExample = async () => {
    const { accounts, contract } = state;
  };

  return (
    <div className='App'>
      <Header addr={AddressEth} />
      <Home />
      <MainMenu addr={AddressEth} />
    </div>

    // <div>
    //   <AppBar position='static' color='default'>
    //     <Toolbar>
    //       <Typography variant='h6' color='inherit'>
    //         <NavLink className={classes.navLink} to='/'>
    //           Home
    //         </NavLink>
    //         <NavLink className={classes.navLink} to='/new'>
    //           New
    //         </NavLink>
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>
    //   <Routes>
    //     <Route path='/' exact element={<Home />} />
    //     <Route path='/new' element={<NewFundraiser />} />
    //     <Route path='/receipts' element={<Receipts />} />
    //   </Routes>
    // </div>
  );
}

export default App;
