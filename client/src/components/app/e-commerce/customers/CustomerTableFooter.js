/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Flex from 'components/common/Flex';

export const CustomerTableFooter = ({
  page,
  pageSize,
  pageIndex,
  rowCount,
  setPageSize,
  canPreviousPage,
  canNextPage,
  viewAllBtn,
  nextPage,
  previousPage,
  rowInfo,
  perPage,
  rowsPerPageSelection,
  navButtons,
  rowsPerPageOptions = [5, 10, 15, 30, 50],
  className
}) => {
  const [isAllVisible, setIsAllVisible] = useState(false);
  return (
    <Flex
      className={classNames(
        className,
        'align-items-center justify-content-between'
      )}
    >
      <Flex alignItems="center" className="fs-10">
        {rowInfo && (
          <p className="mb-0">
            <span className="d-none d-sm-inline-block me-2">
              {pageSize * pageIndex + 1} to {pageSize * pageIndex + page.length}{' '}
              of {rowCount}
            </span>
            {viewAllBtn && (
              <>
                <span className="d-none d-sm-inline-block me-2">&mdash;</span>
                <Button
                  variant="link"
                  size="sm"
                  className="py-2 px-0 fw-semibold"
                  onClick={() => {
                    setIsAllVisible(!isAllVisible);
                    setPageSize(isAllVisible ? perPage : rowCount);
                  }}
                >
                  View {isAllVisible ? 'less' : 'all'}
                  <FontAwesomeIcon
                    icon="chevron-right"
                    className="ms-1 fs-11"
                  />
                </Button>
              </>
            )}
          </p>
        )}
        {rowsPerPageSelection && (
          <>
            <p className="mb-0 mx-2">Rows per page:</p>
            <Form.Select
              size="sm"
              className="w-auto"
              onChange={e => setPageSize(Number(e.target.value))}
              defaultValue={pageSize}
            >
              {rowsPerPageOptions.map(value => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </>
        )}
      </Flex>
      {navButtons && (
        <Flex>
          <Button
            size="sm"
            variant={canPreviousPage ? 'primary' : 'tertiary'}
            onClick={() => previousPage()}
            className={classNames({ disabled: !canPreviousPage })}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant={canNextPage ? 'primary' : 'tertiary'}
            className={classNames('px-4 ms-2', {
              disabled: !canNextPage
            })}
            onClick={() => nextPage()}
          >
            Siguiente
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default CustomerTableFooter;
