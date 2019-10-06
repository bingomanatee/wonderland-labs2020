import {Store} from '@wonderlandlabs/looking-glass-engine';

const WorldStore = new Store({
  actions: {
    addWorld({actions, state}, {name, resolution}) {
      const {worlds} = state;
      const world = {name, resolution};
      worlds.set(name, world);
    }
  }
})
  .addProp('worlds', {
    start: new Map()
  });

export default WorldStore;
