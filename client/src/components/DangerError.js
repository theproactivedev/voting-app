import React from 'react';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';

const DangerError = ({ msg }) => {
  return (
    <Alert dismissible variant="danger">
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      <p className="mb-0">{msg}</p>
    </Alert>
  );
};

DangerError.propTypes = {
  msg: PropTypes.string.isRequired
}

export default DangerError;
