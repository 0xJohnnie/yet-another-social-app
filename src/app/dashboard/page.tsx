'use client';

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <div>DASHBOARD</div>
    </>
  );
};

export default Dashboard;
