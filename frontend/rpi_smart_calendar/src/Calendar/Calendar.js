import React from 'react';
import './Calendar.css';

import Filter from './Filter';
import Statistic from './Statistic';
import Detail from './Detail';
import Grid from './Grid';
import GridHead from './GridHead';
import EventFrom from './EventForm';
// import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      curEventId: null,
      date,
      eventFormHTML: null,
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
    let formHTML = (
      <div className="eventForm">
        <EventFrom
          closeFn={() => this.hideEventForm()}
          addFn={(x) => this.addEvent(x)}
          isEdit={false}
          eventId={null}
        />
      </div>
    );
    this.setState({eventFormHTML: formHTML});
  }

  hideEventForm() {
    this.setState({eventFormHTML: null});
  }

  addEvent(event) {
    let newEventList = this.state.eventList.slice();
    newEventList.add(event);
    this.setState({eventList: newEventList});
  }

  handleEdit(eventId) {
    let formHTML = (
      <div className="eventForm">
        <EventFrom
          closeFn={() => this.hideEventForm()}
          addFn={(x) => this.addEvent(x)}
          isEdit={true}
          eventId={eventId}
        />
      </div>
    );
    this.setState({eventFormHTML: formHTML});
  }

  render() {
    let formHTML = this.state.eventFormHTML;

    return (
      <div className="container-in-calendar">

        <div className="main-content">
          <GridHead date={this.state.date} onPrevWeek={() => this.handlePrevWeek()} onNextWeek={() => this.handleNextWeek()} />
          <Grid curDate={this.state.date} handleOpenDetail={(x) => this.handleOpenDetail(x)} eventList={this.state.eventList} />
          <button class="float-button" onClick={() => this.hanleAddEvent()}>+</button>
        </div>

        <div class="right-container">
          <div className="right-content">
            <Detail
              key={this.state.curEventId}
              eventId={this.state.curEventId}
              onOpenDetail={() => this.handleOpenDetail(this.state.curEventId)} 
              onEdit={(x) => this.handleEdit(x)}  
            />
            
          </div>
          <div className="analysis">
            {/* <Filter labelList={this.state.labelList} onFilterBtn={(label) => this.handleFilterBtn(label)} /> */}
            <Statistic />
          </div>
        </div>
        
        
        {formHTML}
      </div>
    );

  }
}

export default Calendar;