import React from 'react';
import './GridHead.css';
import {getWeek} from '../Util';

class GridHead extends React.Component {

  render() {
    let formater = new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    });
    let date = this.props.date;
    let offset = (date.getDay() + 6) % 7;  // the offset to Monday of this week
    let weekHead = new Date(date.getTime() - offset*24*60*60*1000);
    let weekEnd = new Date(weekHead.getTime() + 6*24*60*60*1000);
    return (
      <div className="cal-grid__head">
        <button className="cal-grid__btn" onClick={this.props.onPrevWeek}>Left</button>
        <span>{formater.format(weekHead)} - {formater.format(weekEnd)}</span>
        <span>week {getWeek(weekHead)} {getWeek(weekEnd)}</span>
        <button className="cal-grid__btn" onClick={this.props.onNextWeek}>Right</button>
      </div>
    );
  }
}

export default GridHead;