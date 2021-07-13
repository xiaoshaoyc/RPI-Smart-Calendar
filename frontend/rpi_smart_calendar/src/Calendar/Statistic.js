import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Statistic.css'

const data = [
  {
    name: "Last Week",
    "CSCI 1200": 0.5,
    "CSCI 4963": 10,
    "CSCI 4210": 1,
    "CSCI 4440": 10,
  },
  {
    name: "This Week",
    "CSCI 1200": 0.5,
    "CSCI 4963": 20,
    "CSCI 4210": 3,
    "CSCI 4440": 10,
  },
  {
    name: "Next Week",
    "CSCI 1200": 0.5,
    "CSCI 4963": 25,
    "CSCI 4210": 2,
    "CSCI 4440": 10,
  },
];

class Statistic extends React.PureComponent {
  render() {
    return (
      <div className="pred-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // width={500}
            // height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="CSCI 1200" stroke="#b9bf0a" />
            <Line type="monotone" dataKey="CSCI 4963" stroke="#e31021" />
            <Line type="monotone" dataKey="CSCI 4210" stroke="#4021db" />
            <Line type="monotone" dataKey="CSCI 4440" stroke="#32a852" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Statistic;