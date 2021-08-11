import React from 'react';
import './Nav.css';
import Config from './Config';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    }
  }

  handleLogin() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${Config.BACKEND_URL}/login/auth/`);
    xhr.withCredentials = true;
    xhr.responseType = 'json';

    let formData = new FormData();
    formData.append("username", "shao");
    formData.append("password", "123456");

    xhr.send(formData);
    xhr.onerror = function() {
      console.error("Login failed");
    }

    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.error(`Login: Return code ${xhr.status}. ${xhr.statusText}`);
        return;
      }
      let resJson = xhr.response;
      if (resJson === null) {
        console.error(`Login: can't understand return value`);
        return;
      }
      console.log(resJson);
      console.log(resJson.message);
      if (resJson.auth === true) {
        alert("Login Success");
        this.setState({isLogin: true})
      }
    }
  }

  handleLogout() {

  }

  handleLoginOut() {
    if (this.state.isLogin) {
      this.handleLogout();
    } else {
      this.handleLogin();
    }

  }

  render() {
    let loginMessage = "";
    if (this.state.isLogin) {
      loginMessage = "Login out";
    } else {
      loginMessage = "Login in";
    }
    return (
      <div className="nav">
        <button className="nav-item nav-item1">X</button>
        <span className="nav-item nav-item2"><b>RPI Smart Calendar</b></span>
        <img className="nav-item nav-item3" src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg" alt="user-img" />
        <span className="nav-item nav-item4">Harry</span>
        <button className="nav-item nav-item5" onClick={() => this.handleLoginOut()}>{loginMessage}</button>
      </div>
    )
  }
}

Nav.defaultProps = {
  isLogin: false
}

export default Nav;