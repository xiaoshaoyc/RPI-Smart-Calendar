import React from 'react';
import './Calendar.css';

import Filter from './Filter';
import Statistic from './Statistic';
import Detail from './Detail';
import Grid from './Grid';
import GridHead from './GridHead';
import EventFrom from './EventForm';
import {getWeek} from '../Util';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    let labelList = {
      "CSCI 4963": true,
      "CSCI 1200": true,
      "CSCI 4210": true,
      "CSCI 4440": true,
    };
    
    let date = new Date();

    this.state = {
      labelList,
      curEventId: 99999999,
      date,
      showEventForm: false,
      eventList: [],
    };
  }

  handlePrevWeek() {
    let newDate = new Date(this.state.date.valueOf());
    newDate.setDate(newDate.getDate() - 7);
    this.setState({date: newDate});
  }

  handleNextWeek() {
    let newDate = new Date(this.state.date.valueOf());
    newDate.setDate(newDate.getDate() + 7);
    this.setState({date: newDate});
  }

  handleFilterBtn(label) {
    let labelList = Object.assign({}, this.state.labelList);
    labelList[label] = !labelList[label];
    this.setState({labelList: labelList});
  }

  handleOpenDetail(eventId) {
    this.setState({curEventId: eventId});
  }

  hanleAddEvent() {
    this.showEventForm();
  }

  showEventForm() {
    this.setState({showEventForm: true});
  }

  hideEventForm() {
    this.setState({showEventForm: false});
  }

  addEvent(event) {
    let newEventList = this.state.eventList.slice();
    newEventList.add(event);
    this.setState({eventList: newEventList});
  }

  updatePage() {
    this.forceUpdate();
  }

  render() {
    let formHTML = null;
    if (this.state.showEventForm) {
      formHTML = (
        <div className="eventForm">
          <EventFrom closeFn={() => this.hideEventForm()} addFn={(x) => this.addEvent(x)} updatePage={() => this.updatePage()}/>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="left-content">
          <Filter labelList={this.state.labelList} onFilterBtn={(label) => this.handleFilterBtn(label)} />
          <Statistic />
        </div>
        <div className="main-content">
          <GridHead date={this.state.date} onPrevWeek={() => this.handlePrevWeek()} onNextWeek={() => this.handleNextWeek()} />
          <Grid curDate={this.state.date} handleOpenDetail={(x) => this.handleOpenDetail(x)} eventList={this.state.eventList} />
        </div>
        <div className="right-content">
          <Detail key={this.state.curEventId} eventId={this.state.curEventId} onOpenDetail={() => this.handleOpenDetail(this.state.curEventId)} />
        </div>
        <div className="addEvent">
          <button className="addEvent-btn" onClick={() => this.hanleAddEvent()}>Add</button>
        </div>
        {formHTML}
      </div>
    );

  }
}

export default Calendar;