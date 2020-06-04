import Router, { withRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../../helpers/alerts';
import { API } from '../../../../config';
import Layout from '../../../../components/Layout';
import jwt from 'jsonwebtoken';

const ResetPassword = ({ router }) => {
	const [ state, setState ] = useState({
		name: '',
		token: '',
		newPassword: '',
		buttonText: 'Reset Password',
		success: '',
		error: ''
	});

    const { name, token, newPassword, buttonText, success, error } = state;
    
    useEffect(() => {
        const decoded = jwt.decode(router.query.id) 
        if (decoded) {
            setState({...state, name: decoded.name, token: router.query.id})
        }
    }, [router])

    const handleChange = (e) => {
		setState({ ...state, newPassword: e.target.value, success: '', error: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        setState({...state, buttonText: 'Sending...'})
		try {
            const response = await axios.put(`${API}/reset-password`, { resetPasswordLink: token, newPassword });
			// console.log('Forgot Password Response', response)
			setState({ ...state, newPassword: '', buttonText: 'Done', success: response.data.message });
		} catch (err) {
			//
			setState({ ...state, buttonText: 'Reset Password', error: err.response.data.error });
		}
	};

	const passwordResetForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						type="password"
						className="form-control"
						onChange={handleChange}
						value={newPassword}
						placeholder="Type in the new password"
						required
					/>
				</div>
				<div>
					<button className="btn btn-outline-warning float-right">{buttonText}</button>
				</div>
			</form>
		);
    };
    
    return (
		<Layout>
            <div className='row'>
                <div className='col-md-8 offset-md-3'>
                    <h1>Hi {name}, Ready to Reset Password?</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                </div>
            </div>
            
			{passwordResetForm()}
		</Layout>
	);
};

export default withRouter(ResetPassword);
