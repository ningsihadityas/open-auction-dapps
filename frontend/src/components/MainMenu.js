import React, { useState, useEffect, useRef } from 'react';
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
import { bidOnAuction, getAuctionData } from './Web3Client';
import Web3 from 'web3';

// function bidOnAuction() {
//   let provider = window.ethereum;
//   // let mainAuctionContract;
//   let auctionContract;
//   const web3 = new Web3(provider);

//   var bid = document.getElementById('bid_value').value;
//   bid = web3.toWei(bid, 'ether');

//   // var gas = 1400000;

//   auctionContract = new web3.eth.Contract(
//     AuctionContract.abi,
//     AuctionContract.networks[networkId].address
//   );

//   auctionContract.bidOnAuction(auction['auctionId'], {
//     from: account,
//     value: bid,
//   });
// }

export default function MainMenu({ addr, highestBidder, highestBid }) {
  //let highestBid2 = useRef();
  //   let [productData, setProductData] = useState([]);
  let [auctionData, setAuctionData] = useState([]);
  let [bidData, setBidData] = useState([]);
  // let [biddingListData, setBiddingList] = useState();
  let [transactionData, setTransactionData] = useState({});
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  let auctionAmount = useRef();

  async function getListingData() {
    let auctions = await getAuctionData();
    let reversed = auctions.reverse();

    setAuctionData(reversed);
  }

  async function handleAddBid(bidder) {
    let auctions = [];
    let amountAuction = auctionAmount.current.value;
    let bidToEth = Number(amountAuction).toFixed(18);
    let bidToWei = Web3.utils.toWei(bidToEth.toString(), 'ether');

    let bidData = await bidOnAuction(auctions['auctionId'])
      .then({ value: bidToWei })
      .catch((err) => {
        if (err) {
          // alert(err);
          console.log(err);
          // window.location.reload();
        }
      });
    return bidData;
  }
  // async function getBiddingListData() {
  //   let biddingList = await biddingList();

  //   setBiddingList(biddingList);
  // }

  useEffect(() => {
    getListingData(); // getTableData
    // getBiddingListData();
  }, []);

  console.log(auctionData);
  console.log('bid data:' + bidData);
  // console.log('bidding id :' + biddingListData);

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
                    <Form onSubmit={handleAddBid}>
                      <Form.Group className='mb-3' controlId='auction_amount'>
                        <Form.Control
                          type='number'
                          className='me-auto'
                          placeholder='Place Your Bid'
                          ref={auctionAmount}
                        />
                      </Form.Group>
                    </Form>

                    {/* <Form.Control
                      type='number'
                      className='me-auto'
                      placeholder='Place Your Bid'
                    /> */}
                    <Button
                      variant='warning'
                      onClick={() => handleAddBid(highestBidder)}>
                      Bid
                    </Button>
                    <p>{bidData}</p>
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
