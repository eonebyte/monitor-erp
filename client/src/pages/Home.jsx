import PropTypes from 'prop-types';
import { Col, Row } from 'antd';

import SalesOrderInvoiceChart from '../components/sales/charts/SalesOrderInvoiceChart';

export function Home({ onNavigate }) {
  return (
    <>
      <Row gutter={12}>
        <Col span={12}>
          <SalesOrderInvoiceChart onNavigate={onNavigate} />
        </Col>
      </Row>
      {/* <p>Welcome to the homepage.</p>
      <Button type="link" onClick={() => onNavigate('2-2', { contactNumber: 1 })}>
        Go to Contact Detail 1
      </Button>
      <Button type="link" onClick={() => onNavigate('2-2', { contactNumber: 2 })}>
        Go to Contact Detail 2
      </Button> */}
    </>
  );
}

Home.propTypes = {
  onNavigate: PropTypes.func,
};
