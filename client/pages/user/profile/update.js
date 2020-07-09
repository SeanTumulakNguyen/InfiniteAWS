import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { isAuth, updateUser } from '../../../helpers/auth';
import withUser from '../../withUser';

const Profile = ({ user, token }) => {
	const [ values, setValues ] = useState({
		name: user.name,
		email: user.email,
		password: '',
		buttonText: 'Update',
		error: '',
		success: '',
		loadedCategories: [],
		categories: user.categories
	});

	const { name, email, password, error, success, buttonText, loadedCategories, categories } = values;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setValues({ ...values, loadedCategories: response.data });
	};

	const handleToggle = (c) => () => {
		// return the first index or -1
		const clickedCategory = categories.indexOf(c);
		const all = [ ...categories ];

		if (clickedCategory === -1) {
			all.push(c);
		} else {
			all.splice(clickedCategory, 1);
		}

		// console.log('All >> categories', all)
		setValues({ ...values, categories: all, success: '', error: '' });
	};

	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map((c, i) => {
				return (
					<li className="list-unstyled" key={i}>
						<input
							type="checkbox"
							onChange={handleToggle(c._id)}
							checked={categories.includes(c._id)}
							className="mr-2"
						/>
						<label className="form-check-label">{c.name}</label>
					</li>
				);
			})
		);
	};

	const handleChange = (name) => (e) => {
		setValues({ ...values, [name]: e.target.value, error: '', success: '', buttonText: 'Update' });
		// console.log(e.target.value)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setValues({ ...values, buttonText: 'Updating...' });
		try {
			const response = await axios.put(
				`${API}/user`,
				{
					name,
					password,
					categories
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			updateUser(response.data, () => {
				setValues({
					...values,
					buttonText: 'Updated',
					success: 'Profile updated successfully'
				});
			});
		} catch (error) {
			setValues({
				...values,
				buttonText: 'Update',
				error: error.response.data.error
			});
		}
	};

	const updateForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						onChange={handleChange('name')}
						type="text"
						className="form-control"
						value={name}
						placeholder="Type your name"
						required
					/>
				</div>
				<div className="form-group">
					<input
						onChange={handleChange('email')}
						type="email"
						className="form-control"
						value={email}
						placeholder="Type your email"
						disabled
						required
					/>
				</div>
				<div className="form-group">
					<input
						onChange={handleChange('password')}
						type="password"
						className="form-control"
						value={password}
						placeholder="Type your password"
					/>
				</div>
				<div className="form-group">
					<label className="text-muted ml-4">Category</label>
					<ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showCategories()}</ul>
				</div>
				<div className="form-group">
					<button className="btn btn-outline-warning float-right">{buttonText}</button>
				</div>
			</form>
		);
	};

	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<h1>Update Profile</h1>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{updateForm()}
			</div>
		</Layout>
	);
};

export default withUser(Profile);
