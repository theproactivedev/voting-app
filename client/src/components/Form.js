import React from 'react';

const Form = ({
  hasCreatedPoll, handleSubmit,
  handleOptionsChange, handleQuestionChange
}) =>{
  return (
    <div className="container">
      <h2>Create Poll</h2>
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
  )
};

export default Form;
