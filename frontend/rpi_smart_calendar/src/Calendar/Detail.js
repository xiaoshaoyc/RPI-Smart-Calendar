import React from 'react'
import './Detail.css'

var DAY_TO_WEEK = [
  "Sunday"
  , "Monday"
  , "Tuesday"
  , "Wednesday"
  , "Thursday"
  , "Friday"
  , "Saturday"
];

function formatMinute(minute) {
  let hours = Math.floor(minute / 60);
  let minutes = minute % 60;
  let hourUnit = hours === 1 ? "hour" : "hours";
  let minuteUnit = minute === 1 ? "min" : "mins";

  let returnStr = "";
  if (hours !== 0) {
    returnStr += `${hours} ${hourUnit}`;
  }
  if (minutes !== 0) {
    returnStr += ` ${minutes} ${minuteUnit}`;
  }
  return returnStr;
}

class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      startTime: null,
      endTime: null,
      Deatils: null,
      addTime: null,
      method: null,
      eventType: null,
      estTime: null,
      id: props.eventId,
    }

    this.state.isSet = false;
    this.getDetails();
  }

  getDetails() {
    // TODO: delete
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://127.0.0.1:8000/login/auth/");
    xhr2.withCredentials = true;
    xhr2.send();

    let id = this.props.eventId;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://127.0.0.1:8000/calendar/event/${id}`);
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

      this.setState({
          title: resJson.title,
          startTime: new Date(),
          endTime: new Date(),
          details: resJson.details,
          addTime: new Date(),
          method: resJson.mothod, // TODO: maybe need better variable name
          eventType: resJson.devetType,
          estTime: 80,  // unit is minute for now
      });
      this.setState({isSet: true});
    }
  }

  handleDelete() {
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://127.0.0.1:8000/login/auth/");
    xhr2.withCredentials = true;
    xhr2.send();

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://127.0.0.1:8000/calendar/event/${this.state.id}/delete`);
    xhr.withCredentials = true;
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
      
      if (resJson.isSuccess == false) {
        alert("need login");
        return;
      }

      // TODO: flush the page
    }
  }

  render() {
    if (this.props.eventId === null) {
      return (
        <div className="detail"></div>
      );
    }
    let formatter = new Intl.DateTimeFormat("en-US",{
      hour: 'numeric'
      , minute: 'numeric'
    });
    let title = "CSCI 4963";
    let startTime = new Date();
    let endTime = new Date(startTime.getTime() + 2*60*60*1000);
    let details = `Meets with Mav to talk about Spring 3 deliverable.`;
    let addTime = new Date(0);
    let method = "manual"; // TODO: maybe need better variable name
    let eventType = "event";
    let estTime = 80;  // unit is minute for now
    if (this.props.eventId === 999) {
      title = "CSCI 4210";
      method = "sync";
      estTime = 10;
      eventType = "deadline";
    }
    if (this.state.isSet) {
      title = this.state.title;
      startTime = this.state.startTime;
      endTime = this.state.endTime;
      details = this.state.details;
      addTime = this.state.addTime;
      method = this.state.method;
      eventType = this.state.eventType;
      estTime = this.state.estTime;
    }
    return (
      <div className="detail">
        <div className="detail-title">
          <div className="detail-title__text">{title}</div>
          <div className="detail-title__time">{formatter.format(startTime)} - {formatter.format(endTime)} </div>
        </div>
        <div className="detail-content">
          <div>Title: {title}</div>
          <div>{startTime.getMonth()}/{startTime.getDate()} ({DAY_TO_WEEK[startTime.getDay()]})</div>
          <div>{startTime.toString()} - {endTime.toString()}</div>
          <br/>
          <div>Details: {details}</div>
          <div>Add time: {addTime.toUTCString()}</div>
          <div>Add method: {method}</div>
          <div>Type: {eventType}</div>
          <div>Est. Time: {formatMinute(estTime)}</div>
        </div>
        <div className="deatil-actions">
          <button onClick={() => this.handleDelete()}>Delete</button>
        </div>
      </div>
    );
  }
}

export default Detail;