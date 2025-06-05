import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BiTrash, BiX } from 'react-icons/bi';

function DeleteConfirmation({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="text-danger">
          <BiTrash className="me-2" />
          {title || 'Confirm Deletion'}
        </Modal.Title>
        <Button
          variant="link"
          className="text-muted p-0 ms-auto"
          onClick={onClose}
        >
          <BiX size={24} />
        </Button>
      </Modal.Header>

      <Modal.Body className="pt-3">
        <p className="text-muted mb-0">
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="light"
          onClick={onClose}
          className="px-4"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          className="px-4"
          style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmation; 