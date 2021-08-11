import React from 'react';
import Config from '../Config';

class EventFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eTitle: "",
      startTime_p1: "",
      startTime_p2: "",
      endTime_p1: "",
      endTime_p2: "",
      eDetails: "",
      eType: "deadlines",
      eGroup: "",
    }
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
    console.log(`
    title: ${this.state.eTitle}
    startTime_p1: ${this.state.startTime_p1}
    startTime_p2: ${this.state.startTime_p2}
    endTime_p1: ${this.state.endTime_p1}
    endTime_p2: ${this.state.endTime_p2}
    details: ${this.state.eDetails}
    type: ${this.state.eType}
    group: ${this.state.eGroup}
    `);
    this.props.closeFn();
    this.addEvent();
  }

  addEvent() {
    // TODO: check input before sending
    let form = document.getElementById("eventForm");
    let formData = new FormData(form);

    let startTime = `${this.state.startTime_p1}T${this.state.startTime_p2}:00.000Z`;
    let endTime = `${this.state.endTime_p1}T${this.state.endTime_p2}:00.000Z`
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${Config.BACKEND_URL}/calendar/event/add`);
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    xhr.withCredentials = true;
    xhr.send(formData);
    
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
    }
    // TODO: delete since no use
    this.props.updatePage();
  }


  render() {
    return (
      <div className="eventForm-container" onSubmit={(x) => this.handleSubmit(x)}>
        <form className="eventForm-form" id="eventForm">
          <label for="eTitle">Title:</label>
          <input type="text" id="eTitle" name="title" value={this.state.eTitle} onChange={(x) => this.handleChange(x)}/>
          <br />
          <label for="eStartTime">Start time:</label>
          <input type="date" id="startTime_p1" name="startTime_p1" value={this.state.eStartTime} onChange={(x) => this.handleChange(x)}/>
          <input type="time" id="startTime_p2" name="startTime_p2" value={this.state.eStartTime2} onChange={(x) => this.handleChange(x)}/>
          <br />
          <label for="eEndTime">End time:</label>
          <input type="date" id="endTime_p1" name="endTime_p1" value={this.state.eEndTime} onChange={(x) => this.handleChange(x)}/>
          <input type="time" id="endTime_p2" name="endTime_p2" value={this.state.eEndTime2} onChange={(x) => this.handleChange(x)}/>
          <br />
          <label for="eDetails">Details:</label>
          <textarea id="eDetails" name="details" value={this.state.eDetails} onChange={(x) => this.handleChange(x)}/>
          <br />
          <label for="eType">Type:</label>
          <select id="eType" name="type" value={this.state.eType} onChange={(x) => this.handleChange(x)}>
            <option value="line">deadlines</option>
            <option value="event">event</option>
          </select>
          <br />
          <label for="eGroup">Group:</label>
          <input type="text" id="eGroup" name="groupid" value={this.state.eGroup} onChange={(x) => this.handleChange(x)} />
          <br />
          <input type="submit" value="Submit" />
          <button onClick={this.props.closeFn}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default EventFrom;