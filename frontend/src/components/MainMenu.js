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

export default function MainMenu({ addr }) {
  //   let [productData, setProductData] = useState([]);
  let [auctionData, setAuctionData] = useState([]);

  let [transactionData, setTransactionData] = useState({});
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  async function getListingData() {
    let auctions = await getAuctionData();
    let reversed = auctions.reverse();

    setAuctionData(reversed);
  }

  useEffect(() => {
    getListingData(); // getTableData
  }, []);

  console.log(auctionData);

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
