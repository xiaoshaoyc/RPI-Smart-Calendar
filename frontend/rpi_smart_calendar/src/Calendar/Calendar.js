import React from 'react';
import './Calendar.css';

import Filter from './Filter';
import Statistic from './Statistic';
import Detail from './Detail';

class EventBlock extends React.Component {
  render() {
    let formatter = new Intl.DateTimeFormat("en-US",{
      hour: 'numeric'
      , minute: 'numeric'
    });
    let data = this.props.data;
    let oneDay = 24*60*60*1000;
    let startTime = data.startTime;
    let endTime = data.endTime;
    let dateOrigin = new Date(startTime.getTime());
    dateOrigin.setHours(0, 0, 0, 0);
    let top = (startTime.getTime() - dateOrigin.getTime()) / oneDay * 100;
    let bottom = 100 - (endTime.getTime() - dateOrigin.getTime()) / oneDay * 100;  // TODO: assuming in one day for now
    let left = startTime.getDay() / 7 * 100;
    let right = 100 - (startTime.getDay() + 1) / 7 * 100;
    if (data.eventType === "block") {
      return (
        <div 
          className="event-item event-item__block" 
          style={{"inset":`${top}% ${right}% ${bottom}% ${left}%`}}
          onClick={this.props.onOpenDetail}
        >
          <div className="event-item__text">{data.title}</div>
          <div className="event-item__time">{formatter.format(startTime)} - {formatter.format(endTime)}</div>
        </div>
      );
    } else if (data.eventType === "line") {
      return (
        <div 
          className="event-item event-item__line" 
          style={{inset:`${top-0.5}% ${right}% ${bottom-0.5}% ${left}%`}}
          onClick={this.props.onOpenDetail}
        >
          <div className="event-item__text">{data.title}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
    }

    this.getEventList();
  }
  getEventList() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/calendar/week");
    xhr.timeout = 10000;
    xhr.responseType = 'json';
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
      let eventList = [];
      for (let dayEventList of resJson) {
        for (let event of dayEventList) {
          eventList.push(event);
        }
      }
      this.setState({eventList});
    }
  }

  

  render() {
    let c1 = "#91918c";
    let c2 = "#d6d6c3";

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
    
    let eventHTML = [];
    for (let event of this.state.eventList) {
      eventHTML.push(
        <EventBlock key={event.id} data={event} onOpenDetail={() => this.props.handleOpenDetail(event.id)} />
      );
    }
    eventHTML.push(
      <EventBlock key={test1.id} data={test1} onOpenDetail={() => this.props.handleOpenDetail(test1.id)} />
    );
    eventHTML.push(
      <EventBlock key={test2.id} data={test2} onOpenDetail={() => this.props.handleOpenDetail(test2.id)} />
    );
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

class GridHead extends React.Component {
  render() {
    let formater = new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    });
    let date = new Date();
    let offset = (date.getDay() + 6) % 7;  // the offset to the Monday of this week
    let weekHead = date - offset*24*60*60*1000;
    let weekEnd = weekHead + 6*24*60*60*1000;
    return (
      <div className="cal-grid__head">
        <button className="cal-grid__btn">Left</button>
        <span>{formater.format(weekHead)} - {formater.format(weekEnd)}</span>
        <button className="cal-grid__btn">Right</button>
      </div>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    let labelList = {
      "CSCI 4963": true
      , "CSCI 1200": true
      , "CSCI 4210": true
      , "CSCI 4440": true
    };
    
    this.state = {
      labelList
      , curEventId: null
    };
  }

  handleFilterBtn(label) {
    let labelList = Object.assign({}, this.state.labelList);
    labelList[label] = !labelList[label];
    this.setState({labelList: labelList});
  }

  handleOpenDetail(eventId) {
    this.setState({curEventId: eventId});
  }

  render() {
    return (
      <div className="container">
        <div className="left-content">
          <Filter labelList={this.state.labelList} onFilterBtn={(label) => this.handleFilterBtn(label)} />
          <Statistic />
        </div>
        <div className="main-content">
          <GridHead />
          <Grid handleOpenDetail={(x) => this.handleOpenDetail(x)}/>
        </div>
        <div className="right-content">
          <Detail eventId={this.state.curEventId} onOpenDetail={() => this.handleOpenDetail(this.state.curEventId)}/>
        </div>
      </div>
    );
  }
}

export default Calendar;