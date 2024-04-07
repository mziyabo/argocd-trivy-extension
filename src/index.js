// import ReactDOM from 'react-dom/client';
// import App from './App';
import React, { useState } from 'react';
import './index.css';
import { Tab, Tabs } from "@mui/material";
import DataGrid from './components/grid/vulnerability-report';
import Dashboard from './components/dashboard/dashboard';

// TODO: remove this for production - only required testing locally
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const Extension = (props) => {

  const { resource, application } = props;
  const appName = application?.metadata?.name || "";
  let container = resource?.spec?.template?.spec?.containers[0]?.name || "";
  let resourceName = resource?.metadata?.name || "";
  let resourceNamespace = resource?.metadata?.namespace || "";
  let resourceKind = resource?.kind?.toLowerCase() || "";


  if (resource?.kind === "Pod") {
    container = resource?.spec?.containers[0]?.name
    resourceName = resource?.metadata?.ownerReferences[0].name.toLowerCase()
    resourceKind = resource?.metadata?.ownerReferences[0].kind.toLowerCase()
  }

  const reportUrl = `${window.location.origin}/api/v1/applications/${appName}/resource?name=${resourceKind}-${resourceName}-${container}&namespace=${resourceNamespace}&resourceName=${resourceKind}-${resourceName}-${container}&version=v1alpha1&kind=VulnerabilityReport&group=aquasecurity.github.io`

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (e, tabIndex) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
  };

  return (
    <React.Fragment>
      <Tabs value={currentTabIndex} onChange={handleTabChange}>
        <Tab label='Table' />
        <Tab label='Dashboard' />
      </Tabs>
      {currentTabIndex === 0 && (
        <DataGrid reportUrl={reportUrl} />
      )}
      {currentTabIndex === 1 && (
        <Dashboard reportUrl={reportUrl} />
      )}
    </React.Fragment>
  );
};

const component = Extension;

((window) => {
  window?.extensionsAPI?.registerResourceExtension(
    component,
    "*",
    "ReplicaSet",
    "Vulnerabilities",
    { icon: "fa fa-triangle-exclamation" }
  );
  window?.extensionsAPI?.registerResourceExtension(component, '', 'Pod', 'Vulnerabilities', { icon: "fa fa-triangle-exclamation" });
  window?.extensionsAPI?.registerResourceExtension(component, '*', 'StatefulSet', 'Vulnerabilities', { icon: "fa fa-triangle-exclamation" });
})(window);