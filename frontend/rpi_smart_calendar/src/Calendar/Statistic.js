import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import './Statistic.css';
import Config from '../Config';
import { getRandomColor } from '../Util';

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
      data: data,
      data2: data2,
    }
    this.getData();
  }

  drawChart1() {
    let HTMLChunk = [];
    for (let course in this.state.data[0]) {
      if (course !== "name") {
        HTMLChunk.push(<Line type="monotone" dataKey={course} stroke={getRandomColor()} />);
      }      
    }
    return (
      <div className="pred-chart" onClick={() => this.handleClick()}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // width={500}
            // height={300} TODO
            data={this.state.data}
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
            {HTMLChunk}
            {/* <Line type="monotone" dataKey="CSCI 1200" stroke="#b9bf0a" />
            <Line type="monotone" dataKey="CSCI 4963" stroke="#e31021" />
            <Line type="monotone" dataKey="CSCI 4210" stroke="#4021db" />
            <Line type="monotone" dataKey="CSCI 4440" stroke="#32a852" /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  drawChart2() {
    let HTMLChunk = [];
    for (let course in this.state.data[0]) {
      if (course !== "name") {
        HTMLChunk.push(<Bar dataKey={course} fill={getRandomColor()} />);
      }      
    }
    return (
      <div className="pred-chart" onClick={() => this.handleClick()}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            // width={500}
            // height={300} TODO
            data={this.state.data2}
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
            {HTMLChunk}
            {/* <Bar dataKey="CSCI 1200" fill="#b9bf0a" />
            <Bar dataKey="CSCI 4963" fill="#e31021" />
            <Bar dataKey="CSCI 4210" fill="#4021db" />
            <Bar dataKey="CSCI 4440" fill="#32a852" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  getData() {
    if (Config.DEBUG_ALWAYS_LOGIN) {
      // TODO: delete
      let xhr2 = new XMLHttpRequest();
      xhr2.open("GET", `http://${Config.BACKEND_URL}/login/auth/`);
      xhr2.withCredentials = true;
      xhr2.send();
    }
    

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/analysis/`);
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
      
      if (resJson.isSuccess === false) {
        alert("need login");
        return;
      }

      let data = resJson.data;

      let lastWeekCourseCost = {name: "Last Week"};
      let thisWeekCourseCost = {name: "This Week"};
      let nextWeekCourseCost = {name: "Next Week"};
      let avgCourseCost = {name: "average time need each week"};

      for (let courses of data) {
        for (let courseName in courses) {
          lastWeekCourseCost[courseName] = Math.floor(courses[courseName].last_time / 60);
          thisWeekCourseCost[courseName] = Math.floor(courses[courseName].this_time / 60);
          nextWeekCourseCost[courseName] = Math.floor(courses[courseName].next_time / 60);
          avgCourseCost[courseName] = Math.floor(courses[courseName].avg_time / 60);
        }
      }

      let chartData = [
        lastWeekCourseCost,
        thisWeekCourseCost,
        nextWeekCourseCost,
      ];
      let chartData2 = [avgCourseCost];
      this.setState({
        data: chartData,
        data2: chartData2,
      });
    }
  }


  handleClick() {
    let index = this.state.curIndex;
    index++;
    this.setState({curIndex: index});
    this.getData();
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