import React from 'react';
import EventBlock from './EventBlock';
import './Grid.css';
import {getWeek, parseDate} from '../Util';
import Config from '../Config';

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curDate: props.curDate,
      eventList: [],
    }

    this.getEventList();
  }
  getEventList() {
    if (Config.DEBUG_ALWAYS_LOGIN) {
      // TODO: delete
      let xhr2 = new XMLHttpRequest();
      xhr2.open("GET", `http://${Config.BACKEND_URL}/login/auth/`);
      xhr2.withCredentials = true;
      xhr2.send();
    }
   
    let curDate = this.props.curDate;
    console.log(`CurWeek: ${getWeek(curDate)}`);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/week/${curDate.getFullYear()}/${getWeek(curDate)}`);
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
      let temp = data.shift();
      console.log(temp);
      data.push(temp);
      console.log(data); // TODO
      let eventList = [];
      for (let dayEventList of data) {
        for (let event of dayEventList) {
          let e = {
            eventType: event.eventType,
            title: event.title,
            startTime: parseDate(event.startTime),
            endTime: parseDate(event.endTime),
            id: event.id,
          }
          eventList.push(e);
        }
      }
      this.setState({eventList});
    }
  }

  render() {
    if (this.props.curDate.valueOf() !== this.state.curDate.valueOf()) {
      this.getEventList();
      this.setState({curDate: this.props.curDate});
    }

    let c1 = "#91918c";
    let c2 = "#d6d6c3";

    let eventHTML = [];
    for (let event of this.state.eventList) {
      eventHTML.push(
        <EventBlock key={event.id} data={event} onOpenDetail={() => this.props.handleOpenDetail(event.id)} />
      );
    }
    if (Config.DEBUG_TEST_DATA) {
      // Test Data
      let d = new Date();
      let test1 = {};
      test1.eventType = "block";
      test1.title = "CSCI 4963";
      test1.startTime = new Date(d.getTime());
      test1.endTime = new Date(d.getTime() + 2*60*60*1000);
      test1.id = 666;
  
      let test2 = {};
      test2.eventType = "line";
      test2.title = "CSCI 4210";
      test2.startTime = new Date(d.getTime() + 7*60*60*1000);
      test2.endTime = new Date(d.getTime() + 7*60*60*1000);
      test2.id = 999;

      eventHTML.push(
        <EventBlock key={test1.id} data={test1} onOpenDetail={() => this.props.handleOpenDetail(test1.id)} />
      );
      eventHTML.push(
        <EventBlock key={test2.id} data={test2} onOpenDetail={() => this.props.handleOpenDetail(test2.id)} />
      );
    }
    let rows = [];
    for (let i = 0; i < 24; i++) {
      rows.push(i/24*100);
    }
    return (
      <div className="cal-grid-elem">
        <div className="cal-timebar">
          {rows.map((item,index) => {
            if (index !== 0) 
              return (<div className="cal-timebar__time" style={{top: item+"%"}}>
                <div className="cal-timebar__time-inner">{index}</div>
              </div>); 
            return null;
          })}
        </div>
        <div className="cal-grid">
          {rows.map(item => <div className="cal-grid__row" style={{top: item+"%"}}></div>)}
          <div className="cal-grid__col" style={{backgroundColor:c1}}></div>
          <div className="cal-grid__col" style={{backgroundColor:c2}}></div>
          <div className="cal-grid__col" style={{backgroundColor:c1}}></div>
          <div className="cal-grid__col" style={{backgroundColor:c2}}></div>
          <div className="cal-grid__col" style={{backgroundColor:c1}}></div>
          <div className="cal-grid__col" style={{backgroundColor:c2}}></div>
          <div className="cal-grid__col" style={{backgroundColor:c1}}></div>
          {eventHTML}
          {/* <EventBlock key={eventId1} eventId={eventId1} onOpenDetail={() => this.props.onOpenDetail(eventId1)} 
            type="block" startTime={startTime} endTime={endTime} title={title} 
          />
          <EventBlock key={eventId2} eventId={eventId2} onOpenDetail={() => this.props.onOpenDetail(eventId2)} 
            type="line" startTime={new Date(endTime.getTime()+3*60*60*1000)} endTime={new Date(endTime.getTime()+3*60*60*1000)} title={title2} 
          /> */}
        </div>
      </div>
    );
  }
}

export default Grid;