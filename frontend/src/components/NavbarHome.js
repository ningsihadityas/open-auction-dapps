import React, { useState } from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
//import AddAuctionModal from './AddAuctionModal';

import AddAuctionModal from './AddAuctionModal';

export default function NavbarHome({ addr }) {
  const [showAddAuctionModal, setShowAddAuctionModal] = useState(false);

  return (
    <>
      <Navbar bg='secondary' variant='dark'>
        <Container>
          <Navbar.Brand href='#home'>
            E-Auction Decentralized Website
          </Navbar.Brand>
          <Navbar.Collapse className='justify-content-end'>
            {/* <Navbar.Text className='text-white'>
              Wallet address: <i>{addr}</i>
            </Navbar.Text> */}
            {/* <Navbar.Text className='text-white'>Auction House</Navbar.Text> */}
            <div className='mx-3'>
              <Button
                variant='primary'
                size='lg'
                onClick={() => setShowAddAuctionModal(true)}>
                Create Auction
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AddAuctionModal
        show={showAddAuctionModal}
        handleClose={() => setShowAddAuctionModal(false)}
        assetOwner={addr}
      />
    </>
  );
}
