import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Tab, Row, Col, Nav, Button } from 'react-bootstrap';
import FalconCardBody from './FalconCardBody';
import classNames from 'classnames';
import { HashLink } from 'react-router-hash-link';
import Flex from './Flex';
import { useLocation } from 'react-router-dom';
import { camelize } from '../../helpers/utils';
import { useAppContext } from 'Main';
import axios from 'axios';

const PreviewCode = () => {
  return (
    <Row className="d-inline-block">
      <Col>
        <Nav variant="pills" className="nav-pills-falcon m-0">
          <Nav.Item>
            <Nav.Link as={Button} size="sm" eventKey="preview">
              Preview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Button} size="sm" eventKey="code">
              Code
            </Nav.Link>
          </Nav.Item>
          {/* <Button variant="" type="button" size="sm">
            Preview
          </Button>
          <Button variant="" type="button" size="sm">
            Code
          </Button> */}
        </Nav>
      </Col>
    </Row>
  );
};

const FalconComponentCardHeader = ({
  light,
  className,
  title,
  children,
  noPreview
}) => {
  const location = useLocation();
  const {
    config: { isRTL }
  } = useAppContext();
  // console.log('log: 🚀  isRTL:', isRTL);
  // console.log('log: 🚀  process.env:', process.env);

  // useEffect(() => {
  //   axios
  //     .get(process.env.REACT_APP_API_URL + '/api/productos')
  //     .then(function (response) {
  //       // handle success
  //       console.log('log: 🚀  response.data:', response.data);
  //     })
  //     .catch(function (error) {
  //       // handle error
  //       console.log(error);
  //     })
  //     .finally(function () {
  //       // always executed
  //     });
  // }, []);

  return (
    <Card.Header
      className={classNames({ 'bg-body-tertiary': light }, className)}
    >
      <Row
        className={classNames('g-2', {
          'align-items-center': !children,
          'align-items-end ': children
        })}
      >
        <Col>
          {title && (
            <Flex>
              <h5
                className="mb-0 hover-actions-trigger text-truncate text-nowrap"
                id={camelize(title)}
              >
                {isRTL ? (
                  <>
                    <HashLink
                      to={`${location.pathname}#${camelize(title)}`}
                      className="hover-actions ps-2"
                      style={{ top: 0, left: '-25px' }}
                    >
                      #
                    </HashLink>
                    {title}
                  </>
                ) : (
                  <>
                    {title}
                    <HashLink
                      to={`${location.pathname}#${camelize(title)}`}
                      className="hover-actions ps-2"
                      style={{ top: 0, right: '-25px' }}
                    >
                      #
                    </HashLink>
                  </>
                )}
              </h5>
            </Flex>
          )}
          {children}
        </Col>
        {!noPreview && (
          <Col
            className={classNames({
              'col-auto': !children,
              'col-md-auto col-12': children
            })}
          >
            <PreviewCode />
          </Col>
        )}
      </Row>
    </Card.Header>
  );
};

const FalconComponentCard = ({
  children,
  multiSections,
  noGuttersBottom,
  ...rest
}) => {
  return (
    <Card className={classNames({ 'mb-3': !noGuttersBottom })} {...rest}>
      {multiSections ? (
        <>{children}</>
      ) : (
        <Tab.Container defaultActiveKey="preview">{children}</Tab.Container>
      )}
    </Card>
  );
};

FalconComponentCard.Header = FalconComponentCardHeader;
FalconComponentCard.Body = FalconCardBody;

FalconComponentCard.propTypes = {
  children: PropTypes.node,
  multiSections: PropTypes.bool,
  noGuttersBottom: PropTypes.bool
};

FalconComponentCardHeader.propTypes = {
  light: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  noPreview: PropTypes.bool
};

export default FalconComponentCard;
