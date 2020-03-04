import React, { PureComponent } from 'react';
import _ from 'lodash';
import backgroundState from './background.state';

export default class Background extends PureComponent {
  constructor(props) {
    super(props);
    this.stream = backgroundState(props);
    this.state = this.stream.value;
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.mounted = true;
    this._sub = this.stream.subscribe((s) => {
      if (this.mounted) {
        //   this.setState(s.value); this component doesn't have a point to listneing to state
      }
    }, (e) => {
      console.log('error in stream', e);
    });

    console.log('ref is ', this.ref);
    this.stream.do.setEle(this.ref.current);
    // this.stream.emit('tryInit');
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    console.log('component updated with ', prevProps, 'to', this.props);
    const size = _.get(this, 'props.size');
    if (!size) return;
    if (
      (_.get(size, 'width') !== _.get(prevProps, 'size.width'))
      || (_.get(size, 'height') !== _.get(prevProps, 'size.height'))) {
      console.log('------------ resize');
      this.stream.do.setSize(size);
    }
  }

  render() {
    return (
      <section className="background-container" ref={this.ref} />
    );
  }
}
