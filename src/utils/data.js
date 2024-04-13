import axios from 'axios';

var vulnerabilityData = {}

async function GetVulnerabilityData(reportUrl) {
  const response = await axios.get(reportUrl)
    .catch(function (error) {
      // console.log(`No vulnerability report found matching: ${reportUrl}`)
    })

  if (response === undefined) {
    return []
  }
  return JSON.parse(response?.data?.manifest).report.vulnerabilities;
}

export async function GridData(reportUrl) {
  const vulnData = await GetVulnerabilityData(reportUrl);

  const data = [];
  vulnData.forEach(v => data.push([
    v.resource,
    v.score,
    v.severity,
    v.fixedVersion,
    v.installedVersion,
    v.primaryLink,
    v.publishedDate,
    v.lastModifiedDate,
    v.title
  ]));

  return data
}

export async function DashboardData(reportUrl) {
  vulnerabilityData = await GetVulnerabilityData(reportUrl);

  if (vulnerabilityData.length === 0) {
    return {
      noVulnerabilityData: true
    }
  }

  return {
    severityData: severityCountData(),
    patchSummaryData: patchSummaryData(),
    topVulnerableResourcesData: topVulnerableResourcesData(15),
    vulnerabilityAgeDistribution: vulnerabilityAgeDistribution(),
    vulnerabilitiesByType: vulnerabilitiesByType(),
    noVulnerabilityData: false
  }
}

function severityCountData() {
  const data = [];
  [
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
    "UNKNOWN"
  ].forEach(severity => {
    data.push({
      name: severity,
      count: vulnerabilityData.filter(d => d.severity === severity).length,
    })
  });
  return data;
}

function patchSummaryData() {
  const count = (severity, fixed = true) => {
    return vulnerabilityData.filter(v => (fixed ? v.fixedVersion !== "" : v.fixedVersion === "")
      && v.severity === severity).length
  }

  const data = []
  const severities = [
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
    "UNKNOWN"
  ]

  severities.forEach(severity => {
    data.push({
      severity: severity,
      fixed: count(severity),
      unfixed: count(severity, false)
    })
  })
  return data;
}

function topVulnerableResourcesData(size) {
  const data = []
  const resources = new Set()
  vulnerabilityData.forEach(v => { resources.add(v.resource) })

  const count = (resource, severity) => {
    return vulnerabilityData.filter(v => v.resource === resource && v.severity === severity).length
  }

  resources.forEach(resource => {
    data.push({
      name: resource,
      total: vulnerabilityData.filter(v => v.resource === resource).length,
      critical: count(resource, 'CRITICAL'),
      high: count(resource, 'HIGH'),
      medium: count(resource, 'MEDIUM'),
      low: count(resource, 'LOW')
    })
  })

  data.sort((a, b) => {
    return b.total - a.total
  })
  return data.slice(0, size - 1)
}

function vulnerabilityAgeDistribution() {
  const data = []

  const count = (severity, year) => {
    return vulnerabilityData.filter(v => {
      return v.severity === severity && new Date(v.publishedDate).getFullYear() === year
    }).length
  }

  let year = new Date().getFullYear() - 7
  while (year <= new Date().getFullYear()) {
    data.push({
      year: year,
      critical: count("CRITICAL", year),
      high: count("HIGH", year),
      medium: count("MEDIUM", year),
      low: count("LOW", year),
    })

    year++
  }
  return data
}

function vulnerabilitiesByType() {
  const vulnTypes = [
    "Overflow",
    "Memory corruption",
    "SQL injection",
    "XSS",
    "Directory traversal",
    "File inclusion",
    "CSRF",
    "XXE",
    "SSRF",
    "Open redirect",
    "Input validation",
    "DoS"
  ]

  const data = [];
  vulnTypes.forEach(vulnType => {

    data.push({
      name: vulnType,
      count: vulnerabilityData.filter(v => v.title.toLowerCase().includes(vulnType.toLowerCase())).length
    })
  })
  return data
}