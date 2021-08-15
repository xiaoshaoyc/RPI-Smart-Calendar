import React from 'react';
import './Nav.css';
import Config from './Config';
import Login from './Login';
import {getCookie, eraseCookie} from './Util';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    let username = getCookie("username");
    if (username === null) {
      username = "Anonymous";
    }
    this.state = {
      isLogin: false,
      disableLogin: true,
      showLoginForm: false,
      username,
    }
    this.isLogin();
  }

  isLogin() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/calendar/week/`);
    xhr.withCredentials = true;
    xhr.responseType = 'json';

    xhr.send();
    xhr.onerror = function() {
      console.error("Login failed");
    }

    xhr.onload = () => {
      if (xhr.status === 401) {
        this.setState({isLogin: false});
      } else {
        this.setState({isLogin: true});
      }
      this.setState({disableLogin: false});
    }
  }

  setUserName(username) {
    this.setState({username});
  }

  handleLogin() {
    this.setState({showLoginForm: true});
  }

  handleLogout() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${Config.BACKEND_URL}/login/logout/`);
    xhr.withCredentials = true;
    xhr.responseType = 'json';

    xhr.send();
    xhr.onerror = function() {
      console.error("Logout failed");
    }
    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.error(`Login: Return code ${xhr.status}. ${xhr.statusText}`);
        return;
      }
      alert("Logout");
      eraseCookie("username");
      this.setState({isLogin: false})
      window.location.reload();
    }
  }

  handleLoginOut() {
    if (this.state.isLogin) {
      this.handleLogout();
    } else {
      this.handleLogin();
    }

  }

  handleReg() {
    window.location.replace("/login/register/");
  }

  handleGroup() {
    window.location.replace("/groupPage/chat.html");
  }

  render() {
    let loginMessage = "";
    if (this.state.isLogin) {
      loginMessage = "Logout";
    } else {
      loginMessage = "Login";
    }
    let HTML = null;
    if (this.state.showLoginForm) {
      HTML = (<Login />);
    }

    return (
      <div className="nav">
        <button className="nav-item nav-item1" onClick={() => this.handleGroup()}>Group Chat</button>
        <span className="nav-item nav-item2"><b>RPI Smart Calendar</b></span>
        <img className="nav-item nav-item3" src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg" alt="user-img" />
        <span className="nav-item nav-item4">{this.state.username}</span>
        <div>
          <button className="nav-item nav-item5" onClick={() => this.handleLoginOut()} disabled={this.state.disableLogin}>{loginMessage}</button>
          <button className="nav-item nav-item6" onClick={() => this.handleReg()} >Register</button>
        </div>
        {HTML}
      </div>
    )
  }
}

Nav.defaultProps = {
  isLogin: false
}

export default Nav;