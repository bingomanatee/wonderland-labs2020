import { Store } from '@wonderlandlabs/looking-glass-engine';
import { World } from '../hexagon';

const WorldStore = new Store({
  actions: {
    addWorld({ actions, state }, { name, resolution }) {
      const { worlds } = state;
      worlds.set(name, new World(name, resolution));
      actions.setWorlds(worlds);
    },
    updateWorld({ actions, state }, world) {
      console.log('updating world', world);
      state.worlds.forEach((_, name) => {
        if (state.worlds.get(name) === world) {
          state.worlds.delete(name);
        }
      });

      state.worlds.set(world.name, world);
      actions.setWorlds(state.worlds);
    },
  },
})
  .addProp('worlds', {
    start: new Map(),
  });

export default WorldStore;
