import React from 'react';
import PropTypes from 'prop-types';

const Form = ({
  handleSubmit, handleOptionsChange, handleQuestionChange
}) => {
  return (
      
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-8 offset-lg-3 col-lg-6">

          <form id="newPollForm" method="post" onSubmit={(e) => {handleSubmit(e)} }>
            <div className="form-group">
              <label htmlFor="question">Question: </label>
              <input type="text" id="question" name="question" className="form-control" onChange={(e) => {handleQuestionChange(e)}} required />
            </div>
            <div className="form-group">
              <label htmlFor="options">Options: </label>
              <p>Separate options by comma.</p>
              <input type="text" id="options" name="options" className="form-control" onChange={(e) => {handleOptionsChange(e)}} required />
            </div>
            <div className="form-group">
              <input type="submit" value="Create Poll" id="createPoll" className="btn btn-primary" />
            </div>
          </form>

        </div>
      </div>
    </div>
  )
};

Form.propTypes = {
  handleSubmit: PropTypes.func,
  handleOptionsChange: PropTypes.func,
  handleQuestionChange: PropTypes.func
};

export default Form;
