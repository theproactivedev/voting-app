import React from 'react';
import PropTypes from 'prop-types';

const Form = ({
  hasCreatedPoll, handleSubmit,
  handleOptionsChange, handleQuestionChange
}) =>{
  return (
    <div>
      <div className="header mb-5">
        <div>
        <h2>Create Poll</h2>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-lg-offset-2 col-lg-8">
          {!hasCreatedPoll &&
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="alert alert-danger">
                <p>Please fill out the needed information.</p>
                </div>
              </div>
            </div>
          }

          <div className="row">
            <div className="col-sm-12 col-md-8 col-lg-6">
            <form id="newPollForm" method="post" onSubmit={(e) => {handleSubmit(e)} }>
                <div className="form-group">
                    <label htmlFor="question">Question: </label>
                    <input type="text" id="question" name="question" className="form-control" onChange={(e) => {handleQuestionChange(e)}} />
                </div>
                <div className="form-group">
                    <label htmlFor="options">Options: </label>
                    <p>Separate options by comma.</p>
                    <input type="text" id="options" name="options" className="form-control" onChange={(e) => {handleOptionsChange(e)}} />
                </div>
                <div className="form-group">
                    <input type="submit" value="Create Poll" id="createPoll" className="btn btn-primary" />
                </div>
            </form>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Form.propTypes = {
  hasCreatedPoll: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleOptionsChange: PropTypes.func.isRequired,
  handleQuestionChange: PropTypes.func.isRequired
}

export default Form;
