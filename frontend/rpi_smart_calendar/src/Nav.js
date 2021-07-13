import React from 'react';
import './Nav.css'

class Nav extends React.Component {
  render() {
    let loginMessage = "";
    if (this.props.isLogin) {
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
        <button className="nav-item nav-item5">{loginMessage}</button>
      </div>
    )
  }
}

Nav.defaultProps = {
  isLogin: false
}

export default Nav;