import React, { useContext, useState } from 'react';
import {
  CloseButton,
  Modal,
  Button,
  Card,
  Col,
  Form,
  Row
} from 'react-bootstrap';
import CustomerTableWrapper from './CustomerTableWrapper';
import CustomerTable from './CustomerTable';
import CustomerTableFooter from './CustomerTableFooter';
import TextSearchFilter from 'components/common/advance-table/TextSearchFilter';
import { CustomerContext } from 'context/Context';
import Swal from 'sweetalert2';

// import { Modal, Button, Form, Table } from 'react-bootstrap';
// import { useContext } from 'react';
// import { CustomerContext } from 'context/Context';

const CustomerModal = ({ show, handleClose, setCliente }) => {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [personasEncontradas, setPersonasEncontradas] = useState([]);
  const [errorFetch, setErrorFetch] = useState(false);

  const {
    customersState: { customers },
    customersDispatch
  } = useContext(CustomerContext);

  // const filteredCustomers = customers.filter(customer =>
  //   customer.ClienteNombre.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

  const columns = [
    {
      accessor: 'ClienteRUC',
      Header: 'RUC',
      headerProps: { className: 'text-900' },
      Filter: TextSearchFilter
    },
    {
      accessor: 'ClienteNombre',
      Header: 'Nombre',
      headerProps: { className: 'text-900' },
      Filter: TextSearchFilter
    },
    {
      accessor: 'ClienteApellido',
      Header: 'Apellido',
      headerProps: { className: 'text-900' },
      Filter: TextSearchFilter
    },
    {
      accessor: 'ClienteTelefono',
      Header: 'Teléfono',
      headerProps: { className: 'text-900' },
      Filter: TextSearchFilter
    }
  ];

  const handleClick = row => {
    // setPersonas([row]);
    handleCustomerModalClose();
    // setModalNuevo(true);
  };

  return (
    <Modal
      show={show}
      //   fullscreen="xl-down"
      size="xl"
      onHide={() => handleCustomerModalClose()}
    >
      <Modal.Header>
        <Modal.Title>Buscar Cliente</Modal.Title>
        <CloseButton
          className="btn btn-circle btn-sm transition-base p-0"
          onClick={() => handleCustomerModalClose()}
        />
      </Modal.Header>
      <Modal.Body>
        {/* <form onSubmit={buscarPersona()}> */}
        <Card className="mb-3">
          {/* <Card.Header as="h5">Event Details</Card.Header> */}
          <Card.Body className="bg-body-tertiary">
            <Row className="gx-2 gy-3">
              <Col md="12">
                {customers.length == 0 ? (
                  errorFetch ? (
                    <Card className="text-center">
                      <Card.Body className="p-5">
                        <p className="lead mt-4 text-800 font-sans-serif fw-semibold">
                          Error al cargar los datos.
                        </p>
                        <hr />
                        <p>
                          Comuníquese con el administrador,
                          <a href="mailto:info@exmaple.com" className="ms-1">
                            contáctenos
                          </a>
                          .
                        </p>
                      </Card.Body>
                    </Card>
                  ) : (
                    <div class="d-flex justify-content-center">
                      <div
                        //   class="spinner-border text-primary"
                        //   role="status"
                        style={{ marginTop: '15px' }}
                      >
                        <span>No hay registros</span>
                      </div>
                    </div>
                  )
                ) : (
                  <CustomerTableWrapper
                    columns={columns}
                    data={customers}
                    sortable
                    pagination
                    perPage={10}
                    // selection
                    selectionColumnWidth={30}
                    actions
                    handleCustomerModalClose={handleCustomerModalClose}
                  >
                    {/* <Row className="flex-end-center mb-3">
                    <Col xs="auto" sm={6} lg={4}>
                      <AdvanceTableSearchBox table />
                    </Col>
                  </Row> */}
                    {/* <BulAction table /> */}
                    <CustomerTable
                      table
                      headerClassName="bg-200 text-nowrap align-middle"
                      rowClassName="align-middle white-space-nowrap"
                      tableProps={{
                        // striped: true,
                        className: 'fs-10 mb-0 overflow-hidden'
                      }}
                      handleCustomerModalClose={handleCustomerModalClose}
                    />
                    <div className="mt-3">
                      <CustomerTableFooter
                        rowCount={customers.length}
                        table
                        rowInfo
                        navButtons
                        rowsPerPageSelection
                      />
                    </div>
                  </CustomerTableWrapper>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* </form> */}
      </Modal.Body>
    </Modal>
  );
};

export default CustomerModal;
