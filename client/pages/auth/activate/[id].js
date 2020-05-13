import { withRouter } from 'next/router';
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../components';
import Layout from '../../../components/Layout';

const ActivateAccount = ({ router }) => {
	const [ values, setValues ] = useState({
		name: '',
		token: '',
		buttonText: 'Activate Account',
		success: '',
		error: ''
	});

	const { name, token, buttonText, success, error } = values;

	useEffect(
		() => {
			let token = router.query.id;
			if (token) {
				const { name } = jwt.decode(token);
				setValues({ ...values, name, token });
			}
		},
		[ router ]
	);

	const clickSubmit = async (e) => {
		e.preventDefault();
		// console.log('activate account')

		setValues({ ...values, buttonText: 'Activating' });

		try {
			const response = await axios.post(`${API}/register/activate`, { token });
			// console.log('Account activate response', response)
			setValues({ ...values, name: '', token: '', buttonText: 'Activated', success: response.data.message });
		} catch (error) {
			setValues({ ...values, buttonText: 'Activate Account', error: error.response.data.error });
		}
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h1>Hello ${name}, Are you ready to activate your account?</h1>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					<button className="btn btn-outline-warning btn-block" onClick={clickSubmit}>
						{buttonText}
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default withRouter(ActivateAccount);
