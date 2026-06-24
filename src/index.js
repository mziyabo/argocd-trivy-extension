import React, { useState } from 'react';
import './index.css';
import { Tab, Tabs } from "@mui/material";
import DataGrid from './components/grid/vulnerability-report';
import Dashboard from './components/dashboard/dashboard';

const Extension = (props) => {

  const { resource, application } = props;
  const appName = application?.metadata?.name || "";
  const resourceNamespace = resource?.metadata?.namespace || "";
  const isPod = resource?.kind === "Pod"
  const isCronJob = resource?.kind === "CronJob"
  const resourceName = isPod ? resource?.metadata?.ownerReferences[0].name.toLowerCase() : resource?.metadata?.name;
  const resourceKind = isPod ? resource?.metadata?.ownerReferences[0].kind.toLowerCase() : resource?.kind?.toLowerCase();

  let [containerName] = useState(isPod ? resource?.spec?.containers[0]?.name : isCronJob ? resource?.spec?.jobTemplate?.spec?.template?.spec.containers[0]?.name : resource?.spec?.template?.spec?.containers[0]?.name);

  const baseURI = `${window.location.origin}/api/v1/applications/${appName}/resource`
  let [reportUrl, setReportUrl] = useState(`${baseURI}?name=${resourceKind}-${resourceName}-${containerName}&namespace=${resourceNamespace}&resourceName=${resourceKind}-${resourceName}-${containerName}&version=v1alpha1&kind=VulnerabilityReport&group=aquasecurity.github.io`);

  let containers = []
  if(isPod) {
    containers = [...resource?.spec?.containers, ...resource.spec?.initContainers ?? []]
  } else if (isCronJob) {
    containers = [...resource?.spec?.jobTemplate?.spec?.template?.spec.containers, ...resource?.spec?.jobTemplate?.spec?.template?.spec.initContainers ?? []]
  } else {
    containers = [...resource?.spec?.template?.spec.containers, ...resource?.spec?.template?.spec.initContainers ?? []]
  }
    
  const containerNames = containers.map(c => c.name)  
  const images = containers.map(c => c.image)  

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (_e, tabIndex) => {
    setCurrentTabIndex(tabIndex);
  };

  const onOptionChangeHandler = (event) => {
    containerName = event.target.value
    setReportUrl(`${baseURI}?name=${resourceKind}-${resourceName}-${containerName}&namespace=${resourceNamespace}&resourceName=${resourceKind}-${resourceName}-${containerName}&version=v1alpha1&kind=VulnerabilityReport&group=aquasecurity.github.io`)
  };

  return (
    <div>
      <React.Fragment>
        <select class="vulnerability-report__container_dropdown" onChange={onOptionChangeHandler}>
          {containerNames.map((container, index) => {
            return (<option key={index} value={container}>{`${container} (${images[index]})`}</option>)
          })}
        </select>
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
    </div>
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
  window?.extensionsAPI?.registerResourceExtension(component, '*', 'CronJob', 'Vulnerabilities', { icon: "fa fa-triangle-exclamation" });
  window?.extensionsAPI?.registerResourceExtension(component, '*', 'Job', 'Vulnerabilities', { icon: "fa fa-triangle-exclamation" });
})(window);
