import React, { useRef, useState } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { createAuction } from './Web3Client';
import SuccessAlertModal from './SuccessAlertModal';
import Web3 from 'web3';

export default function AddAuctionModal({ show, handleClose, assetOwner }) {
  let auctionName = useRef();
  let auctionDesc = useRef();
  let auctionStartPrice = useRef();
  let auctionDuration = useRef();
  //let ownerDeposite = useRef();
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [convertETH, setConvertETH] = useState(0);
  let [responseTransaction, setResponseTransaction] = useState({});

  async function handleAddAuction(assetOwner) {
    const startPriceAuction = auctionStartPrice.current.value;
    const nameAuction = auctionName.current.value;
    const detailAuction = auctionDesc.current.value;
    const durationAuction = auctionDuration.current.value;

    let auctionData = await createAuction(
      nameAuction,
      detailAuction,
      startPriceAuction,
      assetOwner,
      //  depositePrice,
      durationAuction
    ).catch((err) => {
      if (err) {
        // alert(err);
        console.log(err);
        // window.location.reload();
      }
    });
    handleClose();
    setShowAlertSuccess(true);
    setResponseTransaction(auctionData);
    return auctionData;
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Asset detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAuction}>
            <Form.Group className='mb-3' controlId='auction_name'>
              <Form.Label>Asset Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='e.g Women Shoes'
                autoFocus
                ref={auctionName}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='auction_desc'>
              <Form.Label>Auction Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='e.g Size, Colour, Material'
                autoFocus
                ref={auctionDesc}
              />
            </Form.Group>
            {/* <Form.Group className='mb-3' controlId='auction_desc'>
              <Form.Label>Submit Deposite</Form.Label>
              <Form.Control
                type='number'
                placeholder='The auction deposite amount must be equal to the start price'
                autoFocus
                ref={ownerDeposite}
              />
            </Form.Group> */}
            <Form.Group className='mb-3' controlId='auction_desc'>
              <Form.Label>Auction Duration</Form.Label>
              <Form.Control
                type='number'
                placeholder='in minute'
                autoFocus
                ref={auctionDuration}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='auction_start_price'>
              <Form.Label>Auction Start Price</Form.Label>
              <div className='input-group'>
                <div className='input-group-append'>
                  <span className='input-group-text'>ETH</span>
                </div>
                <input
                  className='form-control'
                  type='number'
                  placeholder='Amount in ETH'
                  min={0}
                  ref={auctionStartPrice}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='primary'
            type='submit'
            onClick={() => handleAddAuction(assetOwner)}>
            Add Asset
          </Button>
        </Modal.Footer>
      </Modal>
      <SuccessAlertModal
        show={showAlertSuccess}
        handleClose={() => {
          setShowAlertSuccess(false);
          window.location.reload();
        }}
        transaction={responseTransaction}
      />
    </>
  );
}
