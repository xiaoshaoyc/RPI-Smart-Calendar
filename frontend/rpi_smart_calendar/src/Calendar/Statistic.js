import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
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

const data2 = [
  {
    name: "Time needed each week",
    "CSCI 1200": 0.5,
    "CSCI 4963": 20,
    "CSCI 4210": 3,
    "CSCI 4440": 10,
  }
];

class Statistic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      curIndex: 0,
      data: null,
    }
  }

  drawChart1() {
    return (
      <div className="pred-chart" onClick={() => this.handleClick()}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // width={500}
            // height={300} TODO
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

  drawChart2() {
    return (
      <div className="pred-chart" onClick={() => this.handleClick()}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            // width={500}
            // height={300} TODO
            data={data2}
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
            <Bar dataKey="CSCI 1200" fill="#b9bf0a" />
            <Bar dataKey="CSCI 4963" fill="#e31021" />
            <Bar dataKey="CSCI 4210" fill="#4021db" />
            <Bar dataKey="CSCI 4440" fill="#32a852" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  getData() {
    // TODO: delete
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://127.0.0.1:8000/login/auth/");
    xhr2.withCredentials = true;
    xhr2.send();

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:8000/calendar/week/");
    xhr.withCredentials = true;
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    // TODO: delete
    // xhr.withCredentials = true;

    xhr.send();
    
    xhr.onerror = function() {
      console.error("Event block request failed");
    }

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.error(`Event block request gets return code ${xhr.status}. ${xhr.statusText}`);
        return;
      }
      let resJson = xhr.response;
      if (resJson === null) {
        console.error(`Event block request: can't understand return value`);
        return;
      }
      
      if (resJson.isSuccess == false) {
        alert("need login");
        return;
      }
    }
  }


  handleClick() {
    let index = this.state.curIndex;
    index++;
    this.setState({curIndex: index});
  }

  render() {
    switch (this.state.curIndex % 2) {
      case 0:
        return this.drawChart1();
      case 1:
        return this.drawChart2();
      default:
        return this.drawChart1();
    }
  }
}

export default Statistic;