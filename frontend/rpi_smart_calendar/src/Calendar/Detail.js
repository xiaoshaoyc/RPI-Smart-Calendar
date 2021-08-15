import React from 'react';
import './Detail.css';
import Config from '../Config';
import { parseDate } from '../Util';

var DAY_TO_WEEK = [
  "Sunday"
  , "Monday"
  , "Tuesday"
  , "Wednesday"
  , "Thursday"
  , "Friday"
  , "Saturday"
];

function formatMinute(second) {
  let seconds = second % 60;
  let minutes = Math.floor(second / 60) % 60;
  let hours = Math.floor(second / (60*60));
  let hourUnit = hours === 1 ? "hour" : "hours";
  let minuteUnit = minutes === 1 ? "min" : "mins";
  let secondUnit = seconds === 1 ? "sec" : "sec";

  let returnStr = "";
  if (hours !== 0) {
    returnStr += `${hours} ${hourUnit}`;
  }
  if (minutes !== 0) {
    returnStr += ` ${minutes} ${minuteUnit}`;
  }
  if (seconds !== 0) {
    returnStr +=  `${seconds} ${secondUnit}`;
  }

  if (returnStr === "") {
    returnStr = "data not available";
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
      eventType: null,
      estTime: null,
      id: props.eventId,
    }

    this.state.isSet = false;
    this.getDetails();
  }

  getDetails() {
    if (this.props.eventId === null) {
      return;
    }
    // TODO: delete
    if (Config.DEBUG_ALWAYS_LOGIN) {
      let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", `http://${Config.BACKEND_URL}/login/auth/`);
    xhr2.withCredentials = true;
    xhr2.send();
    }

    let id = this.props.eventId;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/event/${id}`);
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
      
      if (resJson.isSuccess === false) {
        alert("need login");
        return;
      }
      this.setState({
          title: resJson.title,
          startTime: parseDate(resJson.startTime),
          endTime: parseDate(resJson.endTime),
          details: resJson.details,
          addTime: new Date(),
          eventType: resJson.eventType,
          estTime: resJson.estTime,  // unit is minute for now
      });
      this.setState({isSet: true});
    }
  }

  handleDelete() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/event/${this.state.id}/delete`);
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
      
      if (resJson.isSuccess === false) {
        alert("need login");
        return;
      }

      // TODO: flush the page
      window.location.reload();
    }
  }

  render() {
    if (Config.DEBUG_TEST_DATA === true) this.state.isSet = true; // TODO: delete this hack
    if (this.props.eventId === null || this.state.isSet === false) {
      return (
        <div className="detail"></div>
      );
    }
    let formatter = new Intl.DateTimeFormat("en-US",{
      hour: 'numeric',
      minute: 'numeric'
    });
    let formatter2 = new Intl.DateTimeFormat("en-US",{
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    });

    let title, startTime, endTime, details, addTime, method, eventType, estTime;
    if (Config.DEBUG_TEST_DATA) {
      title = "CSCI 4963";
      startTime = new Date();
      endTime = new Date(startTime.getTime() + 2*60*60*1000);
      details = `Meets with Mav to talk about Spring 3 deliverable.`;
      addTime = new Date(0);
      method = "manual"; // TODO: maybe need better variable name
      eventType = "event";
      estTime = 80;  // unit is minute for now
      if (this.props.eventId === 999 && Config.DEBUG_TEST_DATA === true) {
        title = "CSCI 4210";
        method = "sync";
        estTime = 10;
        eventType = "line";
      }
    }
    if (this.state.isSet) {
      title = this.state.title;
      startTime = this.state.startTime;
      endTime = this.state.endTime;
      details = this.state.details;
      addTime = this.state.addTime;
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
          <div>FROM {formatter2.format(startTime)} TO {formatter2.format(endTime)}</div>
          <br/>
          <div>Details: {details}</div>
          {/* <div>Add time: {addTime.toUTCString()}</div> */}
          <div>Type: {eventType}</div>
          <div>Est. Time: {formatMinute(estTime)}</div>
        </div>
        <div className="detail-actions">
          <button onClick={() => this.props.onEdit(this.state.id)}>Edit</button>
          <button onClick={() => this.handleDelete()}>Delete</button>
        </div>
      </div>
    );
  }
}

export default Detail;