import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { useContext } from 'react';
import { CustomerContext } from 'context/Context';

const CustomerModal = ({ show, handleClose, setCliente }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    customersState: { customers },
    customersDispatch
  } = useContext(CustomerContext);

  const filteredCustomers = customers.filter(customer =>
    customer.ClienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerModalClose = customer => {
    handleClose();
    if (customer && customer.ClienteId) {
      customersDispatch({
        type: 'SET_CUSTOMER',
        payload: { selectedCustomer: customer }
      });
      setCliente(customer.ClienteNombre + ' ' + customer.ClienteApellido);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => handleCustomerModalClose()}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Seleccione un cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="searchCustomer">
          <Form.Label>Buscar cliente</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre del cliente"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Form.Group>
        <Table bordered>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Apellido</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr
                key={index}
                onClick={() => handleCustomerModalClose(customer)}
              >
                <td>{customer.ClienteId}</td>
                <td>{customer.ClienteNombre}</td>
                <td>{customer.ClienteApellido}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleCustomerModalClose()}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerModal;
