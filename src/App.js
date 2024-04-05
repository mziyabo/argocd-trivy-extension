import './App.scss';
import DataGrid from './components/grid/vulnerability-report';
import Dashboard from './components/dashboard/dashboard';
import { Tab, Tabs } from "@mui/material";
import React, { useState } from 'react';

function App() {

  // TODO: CLEANUP - for local testing only
  const url = "http://localhost:8000/vulnreport.raw.json"

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  return (
    <React.Fragment>
      <Tabs value={currentTabIndex} onChange={handleTabChange}>
        <Tab label='Table' />
        <Tab label='Dashboard'/>
      </Tabs>
      {currentTabIndex === 0 && (
        <DataGrid reportUrl={url} />
      )}
      {currentTabIndex === 1 && (
        <Dashboard reportUrl={url} />
      )}
    </React.Fragment>
  );
}

export default App;
