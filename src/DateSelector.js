
import React, { Component } from 'react';
import Calendar from 'react-calendar';

const calendarStyle = {
    position: 'absolute',
    top: '0',
    left: '50%',
    marginLeft:'-175px',
    zIndex: '401'
  };
  
class DateSelector extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div className="calendarContainer" style={calendarStyle}>
            <Calendar
                onChange={this.props.onChangeDate}
                value={this.props.date}
            />
            </div>
        )
    }
}

export default DateSelector;



