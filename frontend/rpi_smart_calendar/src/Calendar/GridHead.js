import React from 'react';
import './GridHead.css';
import { getWeek } from '../Util';

class GridHead extends React.Component {

  render() {
    let formater = new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    });
    let date = this.props.date;
    let offset = (date.getDay() + 6) % 7;  // the offset to Monday of this week
    let weekHead = new Date(date.getTime() - offset * 24 * 60 * 60 * 1000);
    let weekEnd = new Date(weekHead.getTime() + 6 * 24 * 60 * 60 * 1000);
    return (
      <div className="cal-grid__head">
        <div className="cal-grid__navi">
          <button className="cal-grid__btn" onClick={this.props.onPrevWeek}>Left</button>
          <span>{formater.format(weekHead)} - {formater.format(weekEnd)}</span>
          <span>week {getWeek(weekHead)}</span>
          <button className="cal-grid__btn" onClick={this.props.onNextWeek}>Right</button>
        </div>
        <div className="cal-grid__date-warp">
          <div className="cal-grid__date-item--empty"> </div>
          <div className="cal-grid__date">
            <span className="cal-grid__date-item">Mon</span>
            <span className="cal-grid__date-item">Tue</span>
            <span className="cal-grid__date-item">Wed</span>
            <span className="cal-grid__date-item">Thur</span>
            <span className="cal-grid__date-item">Fri</span>
            <span className="cal-grid__date-item">Sat</span>
            <span className="cal-grid__date-item">Sun</span>
          </div>
        </div>
      </div>
    );
  }
}

export default GridHead;