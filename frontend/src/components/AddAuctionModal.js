import React, { useRef, useState, useEffect } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { createAuction } from './Web3Client';
import SuccessAlertModal from './SuccessAlertModal';
import Web3 from 'web3';
import MainAuction from 'contracts/AuctionContract.json';

export default function AddAuctionModal({ show, handleClose, assetOwner }) {
  let auctionName = useRef();
  let auctionDesc = useRef();
  let auctionStartPrice = useRef();
  let auctionDuration = useRef();
  let ownerDeposite = useRef();
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [convertETH, setConvertETH] = useState(0);
  let [responseTransaction, setResponseTransaction] = useState({});
  const [assetName, setAssetName] = useState(0);
  const [assetDetail, setAssetDetail] = useState(0);
  const [startPrice, setStartPrice] = useState(0);
  //const [auctionDuration, setAuctionDuration] = useState(0);
  const [web3, setWeb3] = useState(0);
  const [contract, setContract] = useState(0);
  const [accounts, setAccounts] = useState(0);

  useEffect(() => {
    init();
  }, []);

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
      setWeb3(web3);
      setContract(instance);
      setAccounts(accounts);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  // //new handle
  // const handleAddAuction = async () => {
  //   let provider = window.ethereum;
  //   let mainAuctionContract;

  //   const web3 = new Web3(provider);
  //   // const networkId = await web3.eth.net.getId();
  //   const accounts = await web3.eth.getAccounts();
  //   const networkId = await web3.eth.net.getId();
  //   const deployedNetwork = MainAuction.networks[networkId];
  //   const instance = new web3.eth.Contract(
  //     MainAuction.abi,
  //     deployedNetwork && deployedNetwork.address
  //   );

  //   let depositePrice = Web3.utils.toWei(startPrice, 'ether');

  //   await contract.methods
  //     .createAuction(assetName, assetDetail, startPrice, auctionDuration)
  //     .send({ from: accounts[0], value: depositePrice });
  //   alert('Successfully created auction');
  //   alert(assetName, startPrice, auctionDuration);
  //   console.log(assetOwner);

  //   setShowAlertSuccess(true);
  //   // setResponseTransaction(assetOwner);

  //   // window.location.reload();

  //   // mainAuctionContract = new web3.eth.Contract(
  //   //   MainAuction.abi,
  //   //   MainAuction.networks[networkId].address
  //   // );
  //   // return mainAuctionContract.methods
  //   //   .createAuction(assetName, assetDetail, startPrice, auctionDuration)
  //   //   .send({ from: assetOwner, value: depositePrice })
  //   //   .then((auctionData) => {
  //   //     return auctionData;
  //   //   })
  //   //   .catch((err) => {
  //   //     return err.message;
  //   //   });
  // };

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
                //onChange={(e) => setAssetName(e.target.value)}
                ref={auctionName}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='auction_desc'>
              <Form.Label>Auction Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='e.g Size, Colour, Material'
                autoFocus
                // onChange={(e) => setAssetDetail(e.target.value)}
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
                // onChange={(e) => setAuctionDuration(e.target.value)}
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
                  // onChange={(e) => setStartPrice(e.target.value)}
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
