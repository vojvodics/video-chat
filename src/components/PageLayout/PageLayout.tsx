import React from 'react';

import { Layout } from 'antd';

const PageLayout: React.FC = ({ children }) => {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout.Content>{children}</Layout.Content>
      <Layout.Footer></Layout.Footer>
    </Layout>
  );
};

export default PageLayout;
