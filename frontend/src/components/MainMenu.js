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
import { getAuctionData, getBidData } from './Web3Client';
import BiddingContract from 'contracts/Bidding.json';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { placeBid } from './Web3Client';

export default function MainMenu({ addr, bidder }) {
  //   let [productData, setProductData] = useState([]);
  let [auctionData, setAuctionData] = useState([]);
  let [bidData, setBidData] = useState([]);
  let [transactionData, setTransactionData] = useState({});
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  const [bidAmounts, setBidAmounts] = useState(null); //userDonations
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [assetName, setAssetName] = useState(null);
  const [assetDetail, setAssetDetail] = useState(null);
  const [startPrice, setStartPrice] = useState(null);
  // const [bidder, setBidder] = useState(null);
  const [auctionDuration, setAuctionDuration] = useState(null);
  const [bidCount, setBidCount] = useState(null);
  const [biddingAmount, setBiddingAmount] = useState(null); //donationAmount

  async function getListingData() {
    let auctions = await getAuctionData();
    let reversed = auctions.reverse();
    let bids = await getBidData();

    setAuctionData(reversed);
    setBidData();
  }

  useEffect(() => {
    getListingData(); // getTableData
  }, []);

  // const placeBid = async () => {
  //   let provider = window.ethereum;
  //   let biddingContract;

  //   const networkId = await web3.eth.net.getId();
  //   const web3 = new Web3(provider);

  //   biddingContract = new web3.eth.Contract(
  //     BiddingContract.abi,
  //     BiddingContract.networks[networkId].address
  //   );

  //   const highestBid = await biddingContract.methods.highestBidder().call();
  //   const highestBidder = await biddingContract.methods.highestBid().call();

  //   const bid = Web3.utils.toWei(highestBid, 'ether');
  //   // await BiddingContract.methods.placeBid().send({
  //   //   from: bidder,
  //   //   value: bid,
  //   //   gas: 650000,
  //   // });
  //   //setOpen(false);

  //   return BiddingContract.methods
  //     .bid()
  //     .send({ from: highestBidder, value: bid })
  //     .then((bidData) => {
  //       return bidData;
  //     })
  //     .catch((err) => {
  //       return err.message;
  //     });
  // };
  let bidAmount = useRef();

  async function handleSubmit(bidder) {
    const amountBid = bidAmount.current.value;
    //const amountBid2 = Web3.utils.toWei(amountBid.toString(), 'ether');

    let bidData = await placeBid()
      .then({
        from: bidder,
        value: amountBid,
        to: auctionData.bidding,
      })
      .catch((err) => {
        if (err) {
          // alert(err);
          console.log(err);
          // window.location.reload();
        }
      });
    return bidData;
  }
  // const AuctionCard = ({ bidding }) => {
  //   const [web3, setWeb3] = useState(null);
  //   const [contract, setContract] = useState(null);
  //   const [accounts, setAccounts] = useState(null);
  //   const [assetName, setAssetName] = useState(null);
  //   const [assetDetail, setAssetDetail] = useState(null);
  //   const [startPrice, setStartPrice] = useState(null);
  //   const [bidder, setBidder] = useState(null);
  //   const [auctionDuration, setAuctionDuration] = useState(null);
  //   const [bidCount, setBidCount] = useState(null);

  //setContract(instance);
  //const instance = new web3.eth.Contract(BiddingContract.abi, fund);

  //   useEffect(() => {
  //     // getListingData(); // getTableData

  //     if (bidding) {
  //       init(bidding);
  //     }
  //   }, [bidding]);

  const init = async (bidding) => {
    try {
      const fund = bidding;
      const provider = window.ethereum;
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BiddingContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(BiddingContract.abi, fund);
      setWeb3(web3);
      setContract(instance);
      setAccounts(accounts);

      const name = await instance.methods.assetName().call();
      const description = await instance.methods.assetDetail().call();
      const price = await instance.methods.startPrice().call();
      const duration = await instance.methods.auctionDuration().call();

      setAssetName(name);
      setAssetDetail(description);
      setStartPrice(web3.utils.fromWei(price, 'ether'));
      setAuctionDuration(duration);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  // };

  const renderBidsList = () => {
    var bids = bidAmounts;
    if (bids === null) {
      return null;
    }

    const totalBids = bids.length;
    let bidList = [];
    var i;
    for (i = 0; i < totalBids; i++) {
      const ethAmount = web3.utils.fromWei(bids.values[i], 'ether');
      //const bidAmount = ethAmount; //*exchangeRate
      const bidDate = bids.dates[i];
      bidList.push({ biddingAmount: bidAmount.toFixed(2), date: bidDate });
    }

    return bidList.map((bid) => {
      return (
        <div className='donation-list'>
          <p>${bid.biddingAmount}</p>
          <Button variant='contained' color='primary'>
            <Link
              className='donation-receipt-link'
              to={{
                pathname: '/receipts',
                state: {
                  fund: assetName,
                  bid: bid.biddingAmount,
                  date: bid.date,
                },
              }}>
              Request Receipt
            </Link>
          </Button>
        </div>
      );
    });
  };

  console.log(auctionData);
  console.log(biddingAmount);
  console.log(bidData);
  console.log(bidAmount);

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
                      ref={bidAmount}
                    />
                    <Button
                      onClick={() => handleSubmit(bidder)}
                      variant='warning'>
                      Bid
                    </Button>
                  </Stack>
                  <Stack direction='horizontal' gap={3}>
                    <Button variant='danger'>Finalize Auction</Button>
                    <div className='vr' />
                    <Button variant='outline-danger'>Withdraw</Button>
                  </Stack>
                  {/* {bidData.map((index) => {
                    return (
                      <col>
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
                            ref={bidAmount}
                          />
                          <Button
                            onClick={() => handleSubmit(bidder)}
                            variant='warning'>
                            Bid
                          </Button>
                        </Stack>
                        <Stack direction='horizontal' gap={3}>
                          <Button variant='danger'>Finalize Auction</Button>
                          <div className='vr' />
                          <Button variant='outline-danger'>Withdraw</Button>
                        </Stack>
                      </col>
                    );
                  })} */}

                  {/* <Button variant='primary'>Go somewhere</Button> */}
                  {/* <Button
                    variant='primary'
                    type='submit'
                    onClick={() => handleAddAuction(assetOwner)}>
                    Add Asset
                  </Button> */}
                </Card.Body>
              </Card>

              <div>
                <h3>My donations</h3>
                {renderBidsList()}
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
