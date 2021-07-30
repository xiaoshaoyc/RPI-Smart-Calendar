import React from 'react';



class Group extends React.Component {
  constructor(props) {
    this.state = {
      messages: ""
    }
  }
  getGroup() {
    // TODO: delete
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://127.0.0.1:8000/login/auth/");
    xhr2.withCredentials = true;
    xhr2.send();

    let id = this.props.eventId;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://127.0.0.1:8000/group/`);
    xhr.withCredentials = true;
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    // TODO: delete
    // xhr.withCredentials = true;

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
      
      if (resJson.isSuccess == false) {
        alert("need login");
        return;
      }

      let data = resJson.data;
      let groupHTML = [];
      for (let group of data) {
        groupHTML.push(<div>{group}</div>);
      }
    }
    
  }

  render() {
    return (
      <div className="gContainer">
        <div className="gSelector">

        </div>
        <div className="gChat">
          <div className="gMessage">

          </div>
          <div className="gInput">
            <textarea></textarea>
            <button>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Group;