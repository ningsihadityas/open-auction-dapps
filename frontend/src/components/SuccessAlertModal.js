import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function SuccessAlertModal({ show, handleClose, transaction }) {
  if (
    transaction === 'MetaMask Tx Signature: User denied transaction signature.'
  ) {
    return alert(transaction);
  } else {
    return (
      <>
        <Modal
          show={show}
          onHide={handleClose}
          size='auto'
          aria-labelledby='contained-modal-title-vcenter'
          centered>
          <Modal.Header closeButton>
            {
              <Modal.Title
                className='ms-auto'
                id='contained-modal-title-vcenter'>
                Transaction Success!
              </Modal.Title>
            }
          </Modal.Header>
          {/* <Modal.Body closeButton>
            <b>
              Transaction has been successfully created. Transaction detail:{' '}
            </b>{' '}
            <br />
            <ul>
              <li>Transaction Hash: {transaction.transactionHash}</li>
              <br />
              <li>Asset Owner: {transaction.from}</li>
            </ul>
          </Modal.Body> */}
          <Modal.Body closeButton>
            <b>Your Asset is on Listing!</b>
            <br />
          </Modal.Body>
          {/* 
          <Modal.Footer>
            <Button variant='success' onClick={handleClose}>
              Done
            </Button>
          </Modal.Footer> */}
        </Modal>
      </>
    );
  }
}
