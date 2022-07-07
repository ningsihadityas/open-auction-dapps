import React, { useState, useEffect } from 'react';
import { Navbar, Button, Container, Row, Col } from 'react-bootstrap';
import AddAuctionModal from './AddAuctionModal';
import auction from '../assets/auction.png';
import '../auction.css';
import MainMenu from './MainMenu';
import MainAuction from 'contracts/MainAuction.json';
import Web3 from 'web3';

// export default function Home({ addr }) {
//   const [showAddAuctionModal, setShowAddAuctionModal] = useState(false);

//   return (
//     <>
//       <section>
//         <div
//           style={{
//             backgroundColor: '#F6F6FE',
//             backgroundRepeat: 'no-repeat',
//             backgroundPosition: 'center',
//             backgroundSize: 'cover',
//             height: '400px',
//           }}>
//           <div className='container' style={{ height: '550px' }}>
//             <div className='text-center justify-content-center align-self-center'>
//               <Row
//                 style={{
//                   paddingTop: '100px',
//                 }}>
//                 <Col sm={4}>
//                   <img src={auction} style={{ maxHeight: '170px' }} />
//                   <div
//                     style={{
//                       fontSize: '3px',
//                     }}>
//                     {' '}
//                     Icons made by{' '}
//                     <a
//                       href='https://www.flaticon.com/authors/mynamepong'
//                       title='mynamepong'>
//                       {' '}
//                       mynamepong{' '}
//                     </a>{' '}
//                     from{' '}
//                     <a href='https://www.flaticon.com/' title='Flaticon'>
//                       www.flaticon.com'
//                     </a>
//                   </div>
//                 </Col>
//                 <Col sm={8}>
//                   <h2
//                     style={{
//                       fontFamily: 'Lobster Two',
//                       color: '#201D2F',
//                     }}>
//                     Welcome To
//                   </h2>
//                   <h1
//                     style={{
//                       fontFamily: 'Aleo',
//                       color: '#201D2F',
//                       paddingTop: '10px',
//                       paddingBottom: '10px',
//                     }}>
//                     E-Auction Decentralized Website
//                   </h1>
//                   <Button
//                     variant='dark'
//                     size='md'
//                     onClick={() => setShowAddAuctionModal(true)}>
//                     Create Auction
//                   </Button>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* <Container
//         className='rounded'
//         style={{ backgroundColor: 'red', width: '500px', height: '50px' }}>
//         <p style={{ paddingTop: '10px', flex: 1, textAlign: 'center' }}>
//           Here Are Our Listing!
//         </p>
//       </Container> */}

//       <AddAuctionModal
//         show={showAddAuctionModal}
//         handleClose={() => setShowAddAuctionModal(false)}
//         assetOwner={addr}
//       />
//     </>
//   );
// }

const Home = () => {
  useEffect(() => {}, []);
  const [funds, setFunds] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);

  const init = async () => {
    try {
      const provider = window.ethereum;
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MainAuction.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        MainAuction.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(instance);
      setAccounts(accounts);
      const funds = await instance.methods.biddings(10, 0).call();
      setFunds(funds);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  const displayAuction = () => {
    return funds.map((bidding) => {
      return <MainMenu bidding={bidding} key={bidding} />;
    });
  };

  return <div className='main-container'>{displayAuction()}</div>;
};

export default Home;
