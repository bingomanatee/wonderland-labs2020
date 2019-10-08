
import propper from '@wonderlandlabs/propper';
import _ from 'lodash';

export default class WorldPoint {
  constructor(props) {
    Object.assign(this, props);
  }

  shadeToColor() {
    if (this.poly) {
      const height = _.clamp(this.height, -20000, 20000);
      const color = this.world.eleToColor(height);
      this.poly.fill(color);
    }
  }

  get height() {
    if (!this.world.heights.has(this.pointIndex)) return 0;
    return this.world.heights.get(this.pointIndex);
  }

  set height(value) {
    this.world.heights.set(this.pointIndex, value);
    this.shadeToColor();
  }
}


propper(WorldPoint)
  .addProp('pointIndex', {
    type: 'integer',
    required: 'true',
  })
  .addProp('lat', { type: 'number' })
  .addProp('lng', { type: 'number' })
  .addProp('point', {
    type: 'object',
  })
  .addProp('world', {
    type: 'object',
  })
  .addProp('poly', {
    type: 'object',
    onChange(value, old) {
      if (value) {
        this.shadeToColor();
        value.mousemove((e) => {
          if (e.buttons === 1) {
            this.world.paint(this.pointIndex, e);
          }
        });
      }
    },
  })
  .addProp('x', {
    type: 'number',
    required: 'true',
  })
  .addProp('y', {
    type: 'number',
    required: 'true',
  });
