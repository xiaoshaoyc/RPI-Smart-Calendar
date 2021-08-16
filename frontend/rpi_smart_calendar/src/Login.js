import React from 'react';
import './Login.css';
import Config from './Config';
import {getCookie, setCookie, eraseCookie} from './Util';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    let form = document.getElementById("loginForm");
    let formData = new FormData(form);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `http://${Config.BACKEND_URL}/login/auth/`);
    xhr.timeout = 10000;
    xhr.responseType = 'json';
    xhr.withCredentials = true;
    xhr.send(formData);

    xhr.onerror = function() {
      console.error("Login failed");
    }
    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.error(`Login: Return code ${xhr.status}. ${xhr.statusText}`);
      }
      let resJson = xhr.response;
      if (resJson === null) {
        console.error(`Login: can't understand return value`);
        return;
      }

      if (resJson.auth === true) {
        alert("Login Success");
        setCookie("username", this.state.username, 7);
        this.setState({isLogin: true});
        window.location.reload(); // TODO: hack
      } else {
        alert("Login failed");
      }
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
      <div className="login-container" onSubmit={this.handleSubmit}>
        <form className="login-form" id="loginForm">
          <label for="lUsername" className="login-form__label">username: </label>
          <input type="text" id="lUsername" name="username" value={this.state.username} onChange={this.handleChange} /> 
          <br />
          <label for="lPassword" className="login-form__label">password: </label>
          <input type="password" id="lPassword" name="password" value={this.state.password} onChange={this.handleChange} /> 
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default Login;