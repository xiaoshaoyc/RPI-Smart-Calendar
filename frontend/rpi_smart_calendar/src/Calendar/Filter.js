import React from 'react';
import './Filter.css'

class Filter extends React.Component {

  render() {
    let labelList = this.props.labelList;
    let onFilterBtn = this.props.onFilterBtn;
    let htmlChunks = [];
    for (let label in labelList) {
      if (labelList[label] === true){
        htmlChunks.push(
          <button key={label} className="filter__item filter__item--active" onClick={() => onFilterBtn(label)}>{label}</button>
        )
      } else {
        htmlChunks.push(
          <button key={label} className="filter__item" onClick={() => onFilterBtn(label)}>{label}</button>
        )
      }
    }
    return (
      <div className="filter">
        <div className="filter__title"><b>Study Group</b></div>
        {htmlChunks}
      </div>
    );
  }
}


export default Filter;