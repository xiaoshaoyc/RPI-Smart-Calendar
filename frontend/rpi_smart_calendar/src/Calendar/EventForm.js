import React from 'react';
import Config from '../Config';
import {parseDate} from '../Util';
import './EventForm.css';
import {Form, Button, Col, Row} from 'react-bootstrap';

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
      errorMessage: "",
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
    if (this.state.eType === "block") {
      if (event.target.id === "startTime_p1") {
        if (event.target.value !== this.state.startTime_p1) {
          this.setState({errorMessage: "StartTime and endTime must in the same date!"});
        } else {
          this.setState({errorMessage: ""});
        }
      } else if (event.target.id === "endTime_p1") {
        if (event.target.value !== this.state.startTime_p1) {
          this.setState({errorMessage: "StartTime and endTime must in the same date!"});
        } else {
          this.setState({errorMessage: ""});
        }
      }
    }
    if (event.target.id === "eType") {
      this.setState({errorMessage: ""});
    }
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

    formData.set("actualTime", this.state.actualTime*60);

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
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm="2" for="eTitle">Title </Form.Label>
        <Col sm="10">
        <Form.Control type="text" id="eTitle" name="title" value={this.state.eTitle} onChange={(x) => this.handleChange(x)} />
        </Col>
      </Form.Group>
    );
    let errorHTML = this.state.errorMessage === "" ? null : (
      <Form.Group className="eventForm__err-msg">
        {this.state.errorMessage}
      </Form.Group>
    );
    let timeRangeHTML = !isBlock ? null : (
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm="2" for="eStartTime">Start</Form.Label>
          <Col sm="5">
           <Form.Control type="date" id="startTime_p1" name="startTime_p1" value={this.state.startTime_p1} max={this.state.endTime_p1} onChange={(x) => this.handleChange(x)} />
          </Col>
          <Col sm="5">
            <Form.Control type="time" id="startTime_p2" name="startTime_p2" value={this.state.startTime_p2} max={this.state.endTime_p2} onChange={(x) => this.handleChange(x)} />
          </Col>

        <Form.Label column sm="2" for="eEndTime">End </Form.Label>
        <Col sm="5">
          <Form.Control type="date" id="endTime_p1" name="endTime_p1" value={this.state.endTime_p1} min={this.state.startTime_p1} onChange={(x) => this.handleChange(x)} />
        </Col>
        <Col sm="5">
          <Form.Control type="time" id="endTime_p2" name="endTime_p2" value={this.state.endTime_p2} min={this.state.startTime_p2} onChange={(x) => this.handleChange(x)} />
        </Col>
      </Form.Group>
    );
    let timePointHTML = isBlock ? null : (
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm="2" for="eStartTime">Due time </Form.Label>
        <Col sm="5">
          <Form.Control type="date" id="startTime_p1" name="startTime_p1" value={this.state.startTime_p1} onChange={(x) => this.handleChange(x)} />
        </Col>
        <Col sm="5">
          <Form.Control type="time" id="startTime_p2" name="startTime_p2" value={this.state.startTime_p2} onChange={(x) => this.handleChange(x)} />
        </Col>
      </Form.Group>
    );
    let groupHTML = isBlock ? null : (
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" for="eGroup">Group</Form.Label>
        <Col sm="10">
          <Form.Control placeholder="e.g. CSCI4440" type="text" id="eGroup" name="groupid" value={this.state.eGroup} onChange={(x) => this.handleChange(x)} />
        </Col>
      </Form.Group>
    );
    let actualTimeHTML = isBlock || (!this.props.isEdit) ? null : (
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm="2" for="actualTime">ActualTime</Form.Label>
        <Col sm="10">
        <Form.Control type="text" placeholder="enter time in minute" id="actualTime" name="actualTime" value={this.state.actualTime} onChange={(x) => this.handleChange(x)} />
        </Col>
      
      </Form.Group>
    );
    return (
      <div className="eventForm-container" onSubmit={(x) => this.handleSubmit(x)}>
        {errorHTML}
        <Form className="eventForm-form" id="eventForm">
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm="2" for="eType">Type</Form.Label>
          <Col sm="10">
          <Form.Select id="eType" name="type" value={this.state.eType} onChange={(x) => this.handleChange(x)}>
            <option value="line">line</option>
            <option value="block">event</option>
          </Form.Select>
          </Col>
        </Form.Group>
          {titleHTML}
          {timeRangeHTML}
          {timePointHTML}
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm='2' for="eDetails">Details </Form.Label>
            <Col sm="10">
              <Form.Control as="textarea" id="eDetails" name="details" value={this.state.eDetails} onChange={(x) => this.handleChange(x)} />
            </Col>
          </Form.Group>
          {groupHTML}
          {actualTimeHTML}
          <div className="buttons-in-form">
          <Button type="submit"> {this.props.isEdit ? "Update" : "Submit"} </Button>
          <Button variant="secondary" onClick={this.props.closeFn}>Cancel</Button>
          </div>

        </Form>
      </div>
    );
  }
}

export default EventFrom;