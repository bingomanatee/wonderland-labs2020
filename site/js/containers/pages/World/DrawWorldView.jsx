import React, { PureComponent } from 'react';
import { Box } from 'grommet';
import { withSize } from 'react-sizeme';

export default withSize({ monitorWidth: true, monitorHeight: true })(
  class DrawWorldView extends PureComponent {
    constructor(props) {
      super(props);
      this.svgRef = React.createRef();
    }

    componentDidMount() {
      this.draw();
    }

    componentDidUpdate() {
      this.draw();
    }

    draw() {
      const { world, size } = this.props;
      world.draw2D(this.svgRef, size);
    }

    render() {
      const { size } = this.props;
      return (
        <Box fill id="map">
          <svg ref={this.svgRef} width={size.width} height={size.height} />
        </Box>
      );
    }
  },
);
