import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Card,
  Row,
  Col,
  Stack,
  Form,
} from 'react-bootstrap';
import SuccessAlertModal from './SuccessAlertModal';
import { getAuctionData } from './Web3Client';

import Bidding from 'contracts/Bidding.json';
import Web3 from 'web3';
// import getWeb3 from '../';

export default function MainMenu({ addr, bidding, addressEth }) {
  // var contractData = fs.readFileSync(
  //   '../../../backend/build/contracts/Bidding.json'
  // );
  // var thisContract = JSON.parse(contractData);
  // var abi = thisContract['abi'];
  // var bytecode = thisContract['bytecode'];

  // var biddingContract = eth3.eth.Contract(abi);

  // biddingContract.deploy({
  //   data: bytecode,
  //   arguments: []
  // })

  //   let [productData, setProductData] = useState([]);
  let [auctionData, setAuctionData] = useState([]);
  let [transactionData, setTransactionData] = useState({});
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  let [assetName, setAssetName] = useState();
  let [assetDetail, setAssetDetail] = useState();
  let [startPrice, setStartPrice] = useState();
  // const [bidder, setBidder] = useState(null);
  let [auctionDuration, setAuctionDuration] = useState();
  const [contract, setContract] = useState();
  const [accounts, setAccounts] = useState();

  const [web3, setWeb3] = useState();

  async function getListingData() {
    let auctions = await getAuctionData();
    let reversed = auctions.reverse();

    setAuctionData(reversed);
  }

  const init = async (bidding) => {
    try {
      let fund = bidding;
      let biddingContract;
      let provider = window.ethereum;
      const web3 = new Web3(provider);
      //const web3 = new getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Bidding.networks[networkId];

      //const accounts = await web3.eth.getAccounts();

      biddingContract = new web3.eth.Contract(
        Bidding.abi,
        Bidding.deployedNetwork.address
      );

      // setWeb3(web3);
      setContract(biddingContract);

      //  setAccounts(accounts);
      let name = await biddingContract.methods.assetName().call();
      // let name = await instance.methods.assetName().call();
      // let description = await instance.methods.assetDetail().call();
      // let price = await instance.methods.startPrice().call();
      // let duration = await instance.methods.auctionDuration().call();

      setAssetName(name);
      console.log(bidding);
      // setAssetDetail(description);

      // console.log(description);
      // setStartPrice(web3.utils.fromWei(price, 'ether'));
      // setStartPrice(price);
      // setAuctionDuration(duration);

      // var exchangeRate = 0;
      // await cc
      //   .price('ETH', ['USD'])
      //   .then((prices) => {
      //     exchangeRate = prices.USD;
      //     setExchangeRate(prices.USD);
      //   })
      //   .catch(console.error);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  useEffect(() => {
    getListingData(); // getTableData
    // console.log('test');
    init(bidding);
  }, [bidding]);

  console.log(auctionData);
  console.log('asset name1: ' + assetName);
  console.log('asset name1: ' + assetDetail);

  return (
    <Container
      className='mt-4'
      style={{
        backgroundColor: '#494978',
        borderRadius: '8px',
      }}>
      <SuccessAlertModal
        show={showAlertSuccess}
        handleClose={() => {
          setShowAlertSuccess(false);
          window.location.reload();
        }}
        transaction={transactionData}
      />

      <Row style={{ padding: '10px' }}>
        {auctionData.map((item) => {
          return (
            <Col style={{ padding: '10px' }}>
              <Card
                style={{ backgroundColor: '#F6F6FE', color: 'black' }}
                key={item.auctionId}>
                <Card.Header as='h5'>{item.assetName}</Card.Header>
                <Card.Body>
                  <Card.Text>Description: {item.assetDetail}</Card.Text>
                  <Card.Text>Asset Owner: {item.assetOwner}</Card.Text>
                  <Card.Text>Start Price: {item.startPrice}</Card.Text>
                  <Card.Text>
                    Auction Duration: {item.auctionDuration}
                  </Card.Text>
                  <Stack
                    direction='horizontal'
                    gap={3}
                    style={{
                      paddingTop: '5px',
                      paddingBottom: '30px',
                    }}>
                    <Form.Control
                      type='number'
                      className='me-auto'
                      placeholder='Place Your Bid'
                    />
                    <Button variant='warning'>Bid</Button>
                  </Stack>
                  <Stack direction='horizontal' gap={3}>
                    <Button variant='danger'>Finalize Auction</Button>
                    <div className='vr' />
                    <Button variant='outline-danger'>Withdraw</Button>
                  </Stack>

                  {/* <Button variant='primary'>Go somewhere</Button> */}
                  {/* <Button
                    variant='primary'
                    type='submit'
                    onClick={() => handleAddAuction(assetOwner)}>
                    Add Asset
                  </Button> */}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
