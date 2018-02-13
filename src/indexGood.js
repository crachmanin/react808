import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value : 50,
      clickHeight : null,
    };
  }

  eventToValue = (e) => {
    const y = e.screenY;
    const val = Math.min(100, Math.max(0, this.state.value + (this.state.clickHeight - y) / 2));
    return val
  };

  handleEsc = (e) => {
    if (e.keyCode === 27) {
      e.preventDefault();
      this.handleMouseUp();
    }
  };

  handleMouseDown = (e) => {
    this.setState({
      value : this.state.value,
      clickHeight : e.screenY,
    })
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('keyup', this.handleEsc);
  };

  handleMouseMove = (e) => {
    e.preventDefault();
    const val = this.eventToValue(e);
    this.setState({
      value : val,
      clickHeight : e.screenY,
    })
    this.props.onChange(val);
  };

  handleMouseUp = (e) => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('keyup', this.handleEsc);
  };

  calcAngle() {
    return (this.state.value - 50) * 3
  }

  render() {
    const css = {transform: "rotate(" + this.calcAngle() + "deg)"};
    return (
      <div className="knob" onMouseDown={(e) => this.handleMouseDown(e)}>
        <svg width="80" height="80" style={css}>
          <circle cx="40" cy="40" r="30" fill="#babdb6" />
          <line x1="40" y1="30" x2="40" y2="10" stroke="#2e3436" strokeWidth="1px" strokeLinecap="round"></line>
        </svg>
      </div>
    );
  };
}

class Instrument extends React.Component {
  render() {
    const ledClass = this.props.isSelected ? "led-unselected" : "led-selected";
    return (
      <div className="instrument">
        <div className={ledClass}/>
        <Knob
          onChange={(e) => null}
        />
        <Knob
          onChange={(e) => null}
        />
        <button className="instrument-button" onClick={this.props.onClick}>
          {this.props.name}
        </button>
      </div>
    );
  };
}

class InstrumentPanel extends React.Component {
  renderInstrument(inst, i) {
    return (
      <Instrument
        name={inst}
        key={inst}
        isSelected={i === this.props.currInstrument}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  render() {
    const instruments = ["Accent", "BassDrum", "SnareDrum", "LowTom", "MidTom",
      "HighTom", "RimShot", "HandClap", "CowBell", "CYmbal", "OpenHat", "ClsdHat"]
    const instPanel = instruments.map((inst, i) =>
      this.renderInstrument(inst, i))
    return (
      <div className="instruments">
        {instPanel}
      </div>
    );
  }
}

class PlaybackOptions extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

class BeatSelector extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currInstrument : 0,
    };
  }

  instClickHandler(i) {
    this.setState({
      currInstrument: i,
    })
  }

  render() {
    return (
      <div className="drum-machine">
        <div className="instrument-panel">
          <InstrumentPanel
            currInstrument={this.state.currInstrument}
            onClick={(i) => this.instClickHandler(i)}
          />
        </div>
        <div className="playback-options">
          <PlaybackOptions />
        </div>
        <div className="beat-selector">
          <BeatSelector />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <DrumMachine />,
  document.getElementById('root')
);
