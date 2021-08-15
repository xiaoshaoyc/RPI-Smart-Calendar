import React from 'react';
import Config from '../Config';
import {parseDate} from '../Util'

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
      eType: "block",
      eGroup: "",
      actualTime: 0,
      eventData: null,
      canEdit: true,
    };
    if (props.isEdit) {
      this.getDetails();
    }
  }

  getDetails() {
    this.setState({canEdit: false});
    let id = this.props.eventId;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/event/${id}`);
    xhr.withCredentials = true;
    xhr.timeout = 10000;
    xhr.responseType = 'json';

    xhr.send();
    
    xhr.onerror = function() {
      this.setState({canEdit: true});
      console.error("Event block request failed");
    }

    xhr.onload = () => {
      this.setState({canEdit: true});
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
        alert("Something went wrong.");
        return;
      }
      let twoDigit = (num) => {
        if (num < 10) {
          return "0" + String(num);
        } else {
          return num;
        }
      };

      let startTime = parseDate(resJson.startTime);
      let endTime = parseDate(resJson.endTime);
      this.setState({
        eType: resJson.eventType,
        eTitle: resJson.title,
        startTime_p1: `${startTime.getFullYear()}-${twoDigit(startTime.getMonth()+1)}-${twoDigit(startTime.getDate())}`,
        startTime_p2: `${twoDigit(startTime.getHours())}:${twoDigit(startTime.getMinutes())}`,
        endTime_p1: `${endTime.getFullYear()}-${twoDigit(endTime.getMonth()+1)}-${twoDigit(startTime.getDate())}`,
        endTime_p2: `${twoDigit(endTime.getHours())}:${twoDigit(endTime.getMinutes())}`,
        eDetails: resJson.details,
        eGroup: resJson.label[0],
      });
      console.log(this.state.startTime_p1);
    }
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
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
    if (this.props.isEdit) {
      this.editEvent();
    } else {
      this.addEvent();
    }
  }

  addEvent() {
    // TODO: check input before sending
    let isBlock = this.state.eType === "block" ? true : false;

    let form = document.getElementById("eventForm");
    console.log(form);
    let formData = new FormData(form);

    let startTime = `${this.state.startTime_p1}T${this.state.startTime_p2}:00.000Z`;
    formData.append("startTime", startTime);
    if (isBlock) {
      let endTime = `${this.state.endTime_p1}T${this.state.endTime_p2}:00.000Z`
      formData.append("endTime", endTime);
    } else {
      formData.append("endTime", startTime);
    }
    if (!formData.has("title")) {
      formData.set("title", formData.get("groupid"));
    }
    if (!formData.has("details")) {
      formData.set("details", "");
    }
    if (!formData.has("groupid")) {
      formData.set("groupid", " ");
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${Config.BACKEND_URL}/calendar/event/add`);
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    xhr.withCredentials = true;
    xhr.send(formData);

    xhr.onerror = function () {
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
      window.location.reload();
    }
  }

  editEvent() {
    let eventId = this.props.eventId;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/event/${eventId}/delete`);
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
      this.addEvent();
      let resJson = xhr.response;
      if (resJson === null) {
        console.error(`Event block request: can't understand return value`);
        return;
      }
    }
  }

  render() {
    let isBlock = this.state.eType === "block" ? true : false;
    let titleHTML = !isBlock ? null : (
      <div>
        <label for="eTitle">Title:</label>
        <input type="text" id="eTitle" name="title" value={this.state.eTitle} onChange={(x) => this.handleChange(x)} />
        <br />
      </div>
    );
    let timeRangeHTML = !isBlock ? null : (
      <div>
        <label for="eStartTime">Start time:</label>
        <input type="date" id="startTime_p1" name="startTime_p1" value={this.state.startTime_p1} onChange={(x) => this.handleChange(x)} />
        <input type="time" id="startTime_p2" name="startTime_p2" value={this.state.startTime_p2} onChange={(x) => this.handleChange(x)} />
        <br />
        <label for="eEndTime">End time:</label>
        <input type="date" id="endTime_p1" name="endTime_p1" value={this.state.endTime_p1} onChange={(x) => this.handleChange(x)} />
        <input type="time" id="endTime_p2" name="endTime_p2" value={this.state.endTime_p2} onChange={(x) => this.handleChange(x)} />
        <br />
      </div>
    );
    let timePointHTML = isBlock ? null : (
      <div>
        <label for="eStartTime">Due time:</label>
        <input type="date" id="startTime_p1" name="startTime_p1" value={this.state.startTime_p1} onChange={(x) => this.handleChange(x)} />
        <input type="time" id="startTime_p2" name="startTime_p2" value={this.state.startTime_p2} onChange={(x) => this.handleChange(x)} />
      </div>
    );
    let groupHTML = isBlock ? null : (
      <div>
        <label for="eGroup">Group:</label>
        <input type="text" id="eGroup" name="groupid" value={this.state.eGroup} onChange={(x) => this.handleChange(x)} />
        <br />
      </div>
    );
    let actualTimeHTML = isBlock || (!this.props.isEdit) ? null : (
      <div>
        <label for="actualTime">ActualTime</label>
        <input type="text" id="actualTime" name="actualTime" value={this.state.actualTime} onChange={(x) => this.handleChange(x)} />
        <br />
      </div>
    );
    return (
      <div className="eventForm-container" onSubmit={(x) => this.handleSubmit(x)}>
        <form className="eventForm-form" id="eventForm">
          <label for="eType"><b>Type:</b></label>
          <select id="eType" name="type" value={this.state.eType} onChange={(x) => this.handleChange(x)}>
            <option value="line">deadline</option>
            <option value="block">event</option>
          </select>
          <br />
          <br />
          {titleHTML}
          {timeRangeHTML}
          {timePointHTML}
          <label for="eDetails">Details:</label>
          <textarea id="eDetails" name="details" value={this.state.eDetails} onChange={(x) => this.handleChange(x)} />
          <br />
          {groupHTML}
          {actualTimeHTML}
          <input type="submit" value={this.props.isEdit ? "Update" : "Submit"} />
          <button onClick={this.props.closeFn}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default EventFrom;