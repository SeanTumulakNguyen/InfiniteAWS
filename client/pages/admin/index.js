import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({ user }) => {
	return (
		<Layout>
			<h1>Admin Dashboard</h1>
			<br />
			<div className="row">
				<div className="col-md-4">
					<ul className="nav flex-column">
						<li className="nav-item">
							<a className="nav-link" href="/admin/category/create">
								Create Category
							</a>
						</li>
						<li className="nav-item">
							<Link href="/admin/category/read">
								<a className="nav-link">All Categories</a>
							</Link>
						</li>
					</ul>
				</div>
				<div className="col-md-8" />
			</div>
		</Layout>
	);
};

export default withAdmin(Admin);
