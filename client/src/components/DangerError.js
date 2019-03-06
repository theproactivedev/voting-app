import React from 'react';
import PropTypes from 'prop-types';

const DangerError = ({ msg }) => {
  return (
    <div className="alert alert-danger mb-0 mt-3">
    <p className="mb-0">{msg}</p>
    </div>
  );
};

DangerError.propTypes = {
  msg: PropTypes.string.isRequired
}

export default DangerError;
