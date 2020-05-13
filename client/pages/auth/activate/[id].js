import { withRouter } from 'next/router';

const ActivateAccount = ({ router }) => {
	return <div>{JSON.stringify(router)}</div>;
};

export default withRouter(ActivateAccount);
