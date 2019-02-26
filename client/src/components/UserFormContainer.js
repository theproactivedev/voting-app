import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import UserFormModal from '../containers/UserForm';

const UserFormContainer = () => {
	return(
		<Switch>
			<Route exact path="/signup" key={'/signup'} render={(props) => (
			  <UserFormModal {...props} data={'/signup'} />
			)} />
			<Route exact path="/login" key={"/login"} render={(props) => (
			  <UserFormModal {...props} data={'/login'} />
			)} />
		</Switch>
	);
};

export default UserFormContainer;