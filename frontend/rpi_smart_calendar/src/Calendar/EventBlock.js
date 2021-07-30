import React from 'react';
import './EventBlock.css';

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

export default EventBlock;