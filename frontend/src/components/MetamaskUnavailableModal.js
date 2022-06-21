import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function MetamaskUnavailableModal({ show, handleClose }) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}>
        <Modal.Header>
          <Modal.Title>Metamask Unavailable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          There is no Metamask Extension detected on web browser. Metamask is
          required to provide third party cryptocurrency digital wallet.
        </Modal.Body>
        <Modal.Footer>
          <a href='https://metamask.io' target='_blank' rel='noreferrer'>
            <Button variant='primary'>Install Metamask</Button>
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}
