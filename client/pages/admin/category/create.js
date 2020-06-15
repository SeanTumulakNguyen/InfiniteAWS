import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Create = ({ user }) => {
	const [ state, setState ] = useState({
		name: '',
		content: '',
		error: '',
		success: '',
		formData: process.browser && new FormData(),
		buttonText: 'Create',
		imageUploadText: 'Upload image'
	});

	const { name, content, error, success, formData, buttonText, imageUploadText } = state;

	const handleChange = (name) => (e) => {
		const value = name === 'image' ? e.target.files[0] : e.target.value;

		const imageName = name === 'image' ? e.target.files[0].name : 'Upload image';

		formData.set(name, value);
		setState({ ...state, [name]: value, error: '', success: '', imageUploadText: imageName });
		// console.log(e.target.value)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Creating' });
		// console.log(...formData);
		try {
			const response = await axios.post(`${API}/category`, formData, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log('Category Create Response', response);
			setState({
				...state,
				name: '',
				content: '',
				formData: '',
				buttonText: 'Created',
                imageUploadText: 'Upload image',
                success: `${response.data.name} is created`
			});
		} catch (error) {
			console.log('Category Create Error', error);
			setState({ ...state, name: '', formData: '', buttonText: 'Create', error: error.response.data.error });
		}
	};

	const createCategoryForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-muted">Name</label>
					<input className="form-control" onChange={handleChange('name')} value={name} required type="text" />
				</div>
				<div className="form-group">
					<label className="text-muted">Content</label>
					<textarea className="form-control" onChange={handleChange('content')} value={content} required />
				</div>
				<div className="form-group pb-5">
					<label className="btn btn-outline-secondary float-right">
						{imageUploadText}
						<input
							className="form-control"
							onChange={handleChange('image')}
							required
							type="file"
							accept="image/*"
							hidden
						/>
					</label>
				</div>
				<div>
					<button className="btn btn-outline-warning float-right">{buttonText}</button>
				</div>
			</form>
		);
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h1>Create category</h1>
					<br />
					{error && showErrorMessage(error)}
					{success && showSuccessMessage(success)}
					{createCategoryForm()}
				</div>
			</div>
		</Layout>
	);
};

export default withAdmin(Create);
