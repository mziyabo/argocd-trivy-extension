import React, { Component } from 'react';
import { Area, AreaChart, RadarChart, PolarGrid, Radar, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { DashboardData } from '../../utils/data';
import "./dashboard.scss";

class Dashboard extends Component {
    state = {
    }
    componentDidMount() {
        const fetchData = async () => {
            const res = await DashboardData(this.props.reportUrl).then(data => {
                return data;
            })
            this.setState(res);
        }
        fetchData();
    }

    componentDidUpdate(prevProp, prevState){
        if (prevProp.reportUrl !== this.props.reportUrl) {
            const fetchData = async () => {
                const res = await DashboardData(this.props.reportUrl).then(data => {
                    return data;
                })
                this.setState(res);
            }
            fetchData();
        }
    }

    render() {
        const { severityData, patchSummaryData, topVulnerableResourcesData, vulnerabilitiesByType, vulnerabilityAgeDistribution, noVulnerabilityData } = this.state;

        if (noVulnerabilityData) {
            return (
                <div style={{ 'margin': '15px' }}>
                </div>
            )
        }

        const severityHexColors = [
            '#D22B2B', // Critical
            '#FF7E62', // High
            '#F1D86F', // Medium
            '#00C49F', // Low
            '#0088FE'  // Unknown
        ];

        const hexColors = [
            '#238AB2',
            '#EE964B',
            '#299D8F',
            '#457B9D',
            '#1F8090',
            '#E8C469',
            '#299D8F',
            '#F4A261',
            '#2168A6',
            '#F16889',
            '#00C49F',
            '#1F5F8B'
        ];

        return (
            <div>
                <div className="vulnerability-charts__wrapper">
                    <div>
                        <span className="vulnerability-charts__title">Vulnerabilities by Severity</span>
                        <PieChart width={500} height={350}>
                            <Pie
                                dataKey="count"
                                data={severityData}
                                cx="40%"
                                cy="50%"
                                outerRadius={110}
                                fill="#8884d8"
                            >
                                {severityData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={severityHexColors[index % severityHexColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align='right'
                            />
                        </PieChart>
                    </div>

                    <div>
                        <span className="vulnerability-charts__title">Vulnerabilities by Type</span>
                        <PieChart width={550} height={350}>
                            <Pie
                                dataKey="count"
                                data={vulnerabilitiesByType}
                                cx="40%"
                                cy="50%"
                                outerRadius={110}
                                fill="#8884d8"
                            >
                                {vulnerabilitiesByType?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={hexColors[index % hexColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align='right'
                            />
                        </PieChart>
                    </div>

                    <div style={{ "width": "500px" }}>
                        <span className="vulnerability-charts__title">Patchable Vulnerabilities</span>
                        <ResponsiveContainer width={"100%"} maxHeight={"350px"}>
                            <RadarChart cx="50%" cy="50%" data={patchSummaryData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="severity" />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                <Radar name="fixed" dataKey="fixed" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Radar name="unfixed" dataKey="unfixed" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="vulnerability-charts__wrapper">

                    <div>
                        <span className="vulnerability-charts__title">Top Vulnerable Resources</span>
                        <BarChart
                            width={1050}
                            height={370}
                            data={topVulnerableResourcesData}
                            margin={{
                                top: 20,
                                right: 10,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" >
                            </XAxis>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="critical" stackId="a" fill="#D22B2B" />
                            <Bar dataKey="high" stackId="a" fill="#FF7E62" />
                            <Bar dataKey="medium" stackId="a" fill="#F1D86F" />
                            <Bar dataKey="low" stackId="a" fill="#00C49F" />
                        </BarChart>
                    </div>

                    <div>
                        <span className="vulnerability-charts__title">Vulnerabilities by Year</span>
                        <AreaChart
                            width={500}
                            height={350}
                            data={vulnerabilityAgeDistribution}
                            margin={{
                                top: 15,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="critical" stackId="1" stroke="#D22B2B" fill="#D22B2B" />
                            <Area type="monotone" dataKey="high" stackId="1" stroke="#FF7E62" fill="#FF7E62" />
                            <Area type="monotone" dataKey="medium" stackId="1" stroke="#F1D86F" fill="#F1D86F" />
                            <Area type="monotone" dataKey="low" stackId="1" stroke="#00C49F" fill="#00C49F" />
                            <Area type="monotone" dataKey="unknown" stackId="1" stroke="#0088FE" fill="#0088FE" />
                        </AreaChart>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;