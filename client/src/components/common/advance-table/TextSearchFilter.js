import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

function TextSearchFilter({ column: { filterValue, setFilter } }) {
  return (
    <Form.Control
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      type="text"
      placeholder="Search"
    />
  );
}
TextSearchFilter.propTypes = {
  column: PropTypes.object
};

export default TextSearchFilter;
