import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import classNames from 'classnames';

const QuantityController = forwardRef(
  (
    { quantity, handleChange, handleIncrease, handleDecrease, btnClassName },
    ref
  ) => {
    return (
      <InputGroup size="sm">
        <Button
          variant="outline-secondary"
          size="sm"
          className={classNames(btnClassName, 'border-300')}
          onClick={handleDecrease}
        >
          -
        </Button>
        <Form.Control
          ref={ref}
          className="text-center px-2 input-spin-none"
          type="number"
          min="1"
          value={quantity}
          onChange={handleChange}
          style={{ width: '50px' }}
        />
        <Button
          variant="outline-secondary"
          size="sm"
          className={classNames(btnClassName, 'border-300')}
          onClick={handleIncrease}
        >
          +
        </Button>
      </InputGroup>
    );
  }
);

QuantityController.propTypes = {
  quantity: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleIncrease: PropTypes.func.isRequired,
  handleDecrease: PropTypes.func.isRequired,
  btnClassName: PropTypes.string
};

export default QuantityController;
