import Layout from '../../components/Layout';
import withAdmin from '../withAdmin'

const Admin = ({user}) => {
	return (
		<Layout>{JSON.stringify(user)}</Layout>
	);
};

export default withAdmin(Admin);
