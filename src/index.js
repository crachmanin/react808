import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Knob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickHeight : null,
    };
  }

  eventToValue = (e) => {
    const y = e.screenY;
    const val = Math.min(100, Math.max(0, this.props.value + (this.state.clickHeight - y) / 2));
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
    return (this.props.value - 50) * 3
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
          value={this.props.gainVal}
          onChange={this.props.onGainChange}
        />
        <Knob
          value={this.props.toneVal}
          onChange={this.props.onToneChange}
        />
        <button className="instrument-button" onClick={this.props.onClick}>
          {this.props.name}
        </button>
      </div>
    );
  };
}

class Step extends React.Component {
  render() {
    const ledClass = this.props.isSelected ? "led-unselected" : "led-selected";
    return (
      <div className="step" onClick={this.props.onClick}>
        <div className={ledClass}/>
      </div>
    );
  }
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currInstrument : 0,
      gains: Array(12).fill(50),
      tones: Array(12).fill(50),
      steps: Array(12).fill(null).map(() => Array(16).fill(false)),
    };
  }

  instClickHandler(i) {
    this.setState({
      currInstrument: i,
      gains: this.state.gains,
      tones: this.state.tones,
      steps: this.state.steps,
    });
  }

  onGainChange(i, val) {
    const newGains = this.state.gains.slice();
    newGains[i] = val;
    this.setState({
      currInstrument: this.state.currInstrument,
      gains: newGains,
      tones: this.state.tones,
      steps: this.state.steps,
    });
  }

  onToneChange(i, val) {
    const newTones = this.state.tones.slice()
    newTones[i] = val
    this.setState({
      currInstrument: this.state.currInstrument,
      gains: this.state.gains,
      tones: newTones,
      steps: this.state.steps,
    });
  }

  onStepClick(stepNo) {
    const newSteps = this.state.steps.slice();
    newSteps[this.state.currInstrument][stepNo] =
      !newSteps[this.state.currInstrument][stepNo];
    this.setState({
      currInstrument: this.state.currInstrument,
      gains: this.state.gains,
      tones: this.state.tones,
      steps: newSteps,
    });
  }

  renderInstrument(inst, i) {
    return (
      <Instrument
        name={inst}
        key={inst}
        isSelected={i === this.state.currInstrument}
        onClick={() => this.instClickHandler(i)}
        gainVal={this.state.gains[i]}
        toneVal={this.state.tones[i]}
        onGainChange={(val) => this.onGainChange(i, val)}
        onToneChange={(val) => this.onToneChange(i, val)}
      />
    );
  }

  renderStep(isSelected, stepNo) {
    return (
      <Step
        key={stepNo}
        isSelected={isSelected}
        onClick={() => this.onStepClick(stepNo)}
      />
    );
  }

  render() {
    const instruments = ["Accent", "BassDrum", "SnareDrum", "LowTom", "MidTom",
      "HighTom", "RimShot", "HandClap", "CowBell", "CYmbal", "OpenHat", "ClsdHat"];
    const instPanel = instruments.map((inst, i) =>
      this.renderInstrument(inst, i));

    const stepSelector = this.state.steps[this.state.currInstrument].map((isSelected, stepNo) =>
      this.renderStep(isSelected, stepNo));

    return (
      <div className="drum-machine">
        <div className="instrument-panel">
          {instPanel}
        </div>
        <div className="playback-options">
        </div>
        <div className="step-selector">
          {stepSelector}
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
