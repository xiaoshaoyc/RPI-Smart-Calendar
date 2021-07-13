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
    let Details = `Meets with Mav to talk about Spring 3 deliverable.`;
    let addTime = new Date(0);
    let method = "manual"; // TODO: maybe need better variable name
    let eventType = "event";
    let estTime = 80;  // unit is minute for now
    if (this.props.eventId === 15) {
      title = "CSCI 4210";
      method = "sync";
      estTime = 10;
      eventType = "deadline";
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
          <div>Details: {Details}</div>
          <div>Add time: {addTime.toUTCString()}</div>
          <div>Add method: {method}</div>
          <div>Type: {eventType}</div>
          <div>Est. Time: {formatMinute(estTime)}</div>
        </div>
      </div>
    );
  }
}

export default Detail;