import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState, useEffect } from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Create = ({ user, token }) => {
	const [ state, setState ] = useState({
		name: '',
		content: '',
		error: '',
		success: '',
		image: '',
		buttonText: 'Create'
	});

	const [ imageUploadButtonName, setImageUploadeButtonName ] = useState('Upload image');

	const { name, content, error, success, image, buttonText } = state;

	const handleChange = (name) => (e) => {
		setState({ ...state, [name]: e.target.value, error: '', success: '' });
		// console.log(e.target.value)
	};

	const handleImage = (event) => {
		let fileInput = false;
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			setImageUploadeButtonName(event.target.files[0].name);
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				'JPEG',
				100,
				0,
				(uri) => {
					// console.log(uri);
					setState({ ...state, image: uri, success: '', error: '' });
				},
				'base64'
			);
		} else {
			setImageUploadeButtonName('Upload image');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Creating' });
		// console.table({name, content, image});
		try {
			const response = await axios.post(
				`${API}/category`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			// console.log('Category Create Response', response);
			setImageUploadeButtonName('Upload image');
			setState({
				...state,
				name: '',
				content: '',
				buttonText: 'Created',
				success: `${response.data.name} is created`
			});
		} catch (error) {
			console.log('Category Create Error', error);
			setState({ ...state, buttonText: 'Create', error: error.response.data.error });
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
						{imageUploadButtonName}
						<input className="form-control" onChange={handleImage} type="file" accept="image/*" hidden />
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
