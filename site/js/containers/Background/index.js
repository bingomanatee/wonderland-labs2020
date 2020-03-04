import { withRouter } from 'react-router-dom';
import { withSize } from 'react-sizeme';
import Background from './Background';

export default withSize({ monitorWidth: true, monitorHeight: true, refreshRate: 500 })(withRouter(Background));
