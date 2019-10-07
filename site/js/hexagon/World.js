import { IcosahedronGeometry } from 'three';
import propper from '@wonderlandlabs/propper';
import Voronoi from 'voronoi';
import _ from 'lodash';
import Svg from 'svg.js';
import Polygon from './Polygon';

const uniquePoints = (list, value) => {
  const lastValue = _.last(list);
  if (!lastValue) {
    return [value];
  }
  if (lastValue.x === value.x && lastValue.y === value.y) {
    return list;
  }
  return [...list, value];
};

function ptEqual(p, { x, y }, n = 0.001) {
  return ((Math.abs(p.x - x) < n)
    && (Math.abs(p.y - y) < n));
}

function distSq(a, b) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function loopToPolyPoints(loop) {
  loop.push(_.first(loop));
  return loop.map(({ x, y }) => `${Math.round(x)},${Math.round(y)}`)
    .join(' ');
}

export default class World {
  constructor(name, resolution = 0) {
    this.name = name;
    this.resolution = resolution;
    this.init();
  }

  init() {
    this.model = new IcosahedronGeometry(1, this.resolution);
  }

  drawSVG(svgRef) {
    this.svgRef = svgRef;
    this.draw2D();
  }

  draw2D(svgRef, size) {
    if (svgRef) {
      this.svgRef = svgRef;
    }
    if (size) {
      this.size2D = size;
    }

    const svgElement = _.get(this, 'svgRef.current');

    if (this.size2D && svgElement) {
      const xr = _.get(this, 'size2D.width', 0);
      const yb = _.get(this, 'size2D.height', 0);

      const bbox = {
        xl: 0, xr, yt: 0, yb,
      }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
      const uvLists = _(_.get(this, 'model.faceVertexUvs', []));
      const uvs = uvLists
        .map((list, listIndex) => {
          list.forEach((points, faceIndex) => {
            points.forEach((point, pointIndex) => {
              point.listIndex = listIndex;
              point.faceIndex = faceIndex;
              point.pointIndex = pointIndex;
            });
          });
          return list;
        })
        .flattenDeep()
        .sortBy('x', 'y')
        .reduce(uniquePoints, []);

      uvs.forEach((p) => {
        p.x *= xr;
        p.y *= yb;
      });

      const diagram = new Voronoi().compute(uvs, bbox);
      const draw = new Svg(svgElement).size(xr, yb);
      console.log('diagram:', diagram);
      diagram.cells.forEach((cell) => {
        if (_.get(cell, 'halfedges.length') > 2) {
          try {
            const edges = _(cell.halfedges)
              .map('edge')
              .map(({ va, vb }) => [va, vb])
              .value();
            const poly = new Polygon(edges);

            const polyPoints = loopToPolyPoints(poly.loop());

            draw.polygon(polyPoints).fill(_.shuffle(['red', 'green', 'blue'])[0])
              .stroke({ width: 1, color: 'black' });
          } catch (err) {
            console.log('error drawing', err);
          }
        }
      });

      uvLists.forEach((list) => {
        list.forEach((face) => {
          console.log('making smallest face from ', face);
          const smallFace = Polygon.smallestUVFace(face);
          const facePoints = smallFace.loop().map(({ x, y }) => ({ x: ((x % 1) || 1) * xr, y: ((y % 1) || 1) * yb }));
          draw.polygon(loopToPolyPoints(facePoints)).fill('none').stroke({ width: 1, color: 'yellow' });
        });
      });
    }
  }
}

propper(World)
  .addProp('svgRef')
  .addProp('name', {
    type: 'string',
    defaultValue: '',
  })
  .addProp('size2d', () => ({}), 'object')
  .addProp('model')
  .addProp('resolution', {
    type: 'integer',
    defaultValue: 0,
  });
