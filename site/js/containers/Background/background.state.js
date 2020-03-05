/* eslint-disable prefer-destructuring,no-bitwise */
import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import SVG from 'svg.js';
import '@svgdotjs/svg.filter.js';
import _ from 'lodash';
import N from '@wonderlandlabs/n';
import chroma from 'chroma-js';
import { CubeCoord, Hexes } from '@wonderlandlabs/hexagony';
import rectCover from 'rect-cover';
import getCanvasPixelColor from 'get-canvas-pixel-color';

import navStream from '../../store/nav.store';

const FINISHED = 2;
const BLENDED = 1;
const UNCHANGED = 0;

const PIXEL_CLAMP = 200;
const HEX_DIVS = 25;

function initials(string) {
  return string.split(/\s+/g)
    .map((s) => s.substr(0, 1).toUpperCase())
    .join('');
}

const stringRGB = (str) => {
  if (!_.get(str, 'length')) {
    return chroma(_.random(0, 255), _.random(0, 255), _.random(0, 255));
  }

  let hash = 0;
  const rgb = [];
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash;
  }
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    rgb[i] = value;
  }
  return chroma(...rgb).brighten(2);
};

export default ({ size }) => {
  const width = _.get(size, 'width', 100);
  const height = _.get(size, 'height', 100);
  const stream = new ValueStream('sceneManager')
    .property('size', size || { width: 100, height: 100 })
    .property('width', width || 100, 'number')
    .property('height', height || 100, 'number')
    .property('ele', null)
    .property('svg', null)
    .property('matrix', new Hexes({ scale: 50, pointy: true }))
    .property('coords', new Map())
    .watchFlat('ele', (s, e) => {
      console.log('ele set to ', e);
      if (e && s.my.width > 100 && s.my.height > 100) {
        console.log('ele set to ', e);
        s.do.tryInit();
      }
    })
    .method('updateSVG', (s) => {
      if (!s.my.svg) {
        const svg = SVG(s.my.ele);
        s.do.setSvg(svg);
      } else {
        s.my.svg.clear();
      }
      s.my.svg.size(s.my.width, s.my.height);
    })
    .method(
      'tryInit',
      (s, reset) => {
        console.log('tryInit');
        if (s.my.init && !reset) {
          console.log('tryInit abort');
          return;
        }

        if (!(s.my.ele && s.my.width > 100 && s.my.height > 100)) {
          console.log('init aborted - bad state');
          return;
        }

        s.do.updateSVG();

        // console.log('making coords from ', s.my.width, s.my.height);

        s.do.stopTransform();
        requestAnimationFrame(() => {
          s.do.recreateHexes();
          if (s.my.currentArticle) {
            s.do.resizeCanvas();
            s.do.drawArticle();
          } else {
            s.do.canvasToTarget(true);
            s.do.setImage('/img/bunny-rabbit.jpg');
          }
        });
        s.do.setInit(true);
      },
      true,
    )
    .method('recreateHexes', (s) => {
      const hexScale = N(s.my.width).plus(s.my.height).div(2).div(HEX_DIVS)
        .plus(5)
        .max(20).value;
      s.do.setMatrix(new Hexes({ scale: hexScale, pointy: true }));

      const sizes = [-s.my.width / 2, -s.my.height / 2, s.my.width * 1.5, s.my.height * 1.5];
      const coords = s.my.matrix.floodRect(...sizes, true);
      console.log('getting hexes for: ', sizes);
      const map = new Map();

      coords.forEach((c) => {
        map.set(c.toString(), c);
        const points = s.do.polyPoints(c);
        // console.log('points:', points);
        c.poly = s.my.svg.polygon(points).fill('grey');
      });
      s.do.setCoords(map);
    })
    .method('stopTransform', (s) => {
      s.do.setTargetColors(new Map());
      s.do.setCellsToRedraw([]);
    }, true)
    .method('resizeCanvas', (s) => {
      const canvas = document.createElement('canvas');
      canvas.width = s.my.width * 2;
      canvas.height = s.my.height * 2;
      s.do.setCanvas(canvas);
    })
    .property('image', '', 'string')
    .watchFlat('image', 'loadImage')
    .method('loadImage', (s, img) => {
      if (img) {
        console.log('loadImage -- ', img);
        const i = new Image();
        i.src = img;
        i.onload = () => {
          console.log('image loaded');
          s.do.setImageResource(i);
        };
      }
    })
    .property('imageResource', null)
    .watchFlat('imageResource', 'drawImageResource')
    .method('drawImageResource', (s) => {
      s.do.resizeCanvas();

      const image = s.my.imageResource;
      if (!image) {
        return;
      }

      const canvas = s.my.canvas;
      const {
        scale,
        translate,
      } = rectCover(canvas, s.my.imageResource);

      const { x, y } = translate;
      const dw = (image.width) * scale;
      const dh = (image.height) * scale;

      canvas.getContext('2d').drawImage(image, x, y,
        dw,
        dh);
      s.do.setCanvas(canvas);
      s.do.canvasToTarget();
    }, true)
    .property('canvas', null)
    .method('polyPoints', (s, c) => {
      const points = s.my.matrix.corners(c);
      return points.reduce((out, p) => `${out} ${p.x},${p.y}`, '');
    })
    .property('init', false, 'boolean')
    .property('layers', [], 'array')
    .property('active', true, 'boolean')
    .property('colors', new Map())
    .property('targetColors', new Map())
    .method('canvasToTarget', (s, init) => {
      console.log('---- canvasToTarget', init);
      if (!s.my.svg) {
        return;
      }

      if (!s.my.canvas) {
        return;
      }
      const ctx = s.my.canvas.getContext('2d');
      s.my.coords.forEach((c, i) => {
        if (c.poly) {
          const p = c.toXY(s.my.matrix);
          p.x += s.my.width / 2;
          p.y += s.my.height / 2;
          try {
            const color = getCanvasPixelColor(ctx, p.x, p.y);
            const color2 = getCanvasPixelColor(ctx, p.x + 1, p.y + 1);
            const h = chroma(_.mean([color.r, color2.r]), _.mean([color.g, color2.g]), _.mean([color.b, color2.b])).hex();
            s.my.targetColors.set(i, typeof h === 'string' ? h : h.css());
          } catch (err) {
            console.log('error in poly color: ', err);
          }
        }
      });
      s.do.dissolve();
    })
    .method('setHexColor', (s, i, color) => {
      s.my.colors.set(i, color);
      const c = s.my.coords.get(i);
      if (c && c.poly) {
        c.poly.fill(color).stroke(color);
      }
    })
    .method('dissolveCell', (s, cell, color) => {
      if (!s.my.targetColors.has(cell)) {
        return UNCHANGED;
      }
      if (!color) {
        color = s.my.targetColors.get(cell);
      }

      if (!s.my.colors.has(cell)) {
        s.my.colors.set(cell, color);
        s.do.setHexColor(cell, color);
        return FINISHED;
      }
      const currentColor = s.my.colors.get(cell);
      if (currentColor === color) {
        return FINISHED;
      }
      // if (chroma.distance(color, currentColor) < 5) {
      s.do.setHexColor(cell, color);
      return FINISHED;
      //  }

      // const target = chroma.mix(color, currentColor, 0.25).hex();
      // s.do.setHexColor(cell, target);
      // return BLENDED;
    })
    .method('dissolve', (s) => {
      if (!s.my.canvas) {
        return;
      }
      if (!s.my.targetColors.size) {
        return;
      }

      let cellsToRedraw = [];

      if (s.my.targetColors.size < 2 * PIXEL_CLAMP) {
        s.do.setCellsToRedraw(Array.from(s.my.targetColors.keys()));
        return;
      }
      let lightCells = [];
      let darkCells = [];

      s.my.targetColors.forEach((color, cell) => {
        const currentColor = s.my.colors.get(cell);
        if (!currentColor) {
          cellsToRedraw.push(cell);
          return;
        }
        if (currentColor === color) {
          return;
        }

        const lum = _.sum(chroma(color).gl());
        const tLum = _.sum(chroma(currentColor).gl());
        if ((lum > 2.5) || (tLum > 2.5)) {
          lightCells.push(cell);
        } else {
          darkCells.push(cell);
        }
      });
      darkCells = _.shuffle(darkCells);
      lightCells = _.shuffle(lightCells);

      cellsToRedraw = [...cellsToRedraw,
        ...lightCells.slice(0, Math.max(lightCells.length / 2, PIXEL_CLAMP / 2)),
        ...darkCells];

      cellsToRedraw = cellsToRedraw.slice(0, cellsToRedraw.length / 2);

      if (cellsToRedraw.length || s.my.cellsToRedraw.length) {
        s.do.setCellsToRedraw(cellsToRedraw);
      }
    })
    .property('cellsToRedraw', [], 'array')
    .watchFlat('cellsToRedraw', 'digestCellsToRedrawChunks')
    .property('digesting', false, 'boolean')
    .method('digestCellsToRedrawChunks', (s) => {
      if (s.my.digesting) {
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      const cellsToRedraw = s.my.cellsToRedraw;

      if (!cellsToRedraw.length) {
        if (s.my.targetColors.size) {
          requestAnimationFrame(s.do.dissolve);
        } else {
          console.log('done with dissolve');
        }
        return;
      }

      s.do.setDigesting(true);
      const cellsToRedrawRandom = _(cellsToRedraw).shuffle().value();
      const leftOver = cellsToRedrawRandom.slice(100);

      try {
        cellsToRedrawRandom.slice(0, 100).forEach((cell) => {
          const result = s.do.dissolveCell(cell);
          if (result === FINISHED) {
            s.my.targetColors.delete(cell);
          } else if (result === BLENDED) {
            leftOver.push(result);
          }
        });
      } catch (err) {
        console.log('error: ', err);
      }

      s.do.setDigesting(false);
      s.do.setCellsToRedraw(leftOver);
    })
    .property('dissolveCells', [], 'array')
    .method('drawArticle', (s) => {
      if ((!s.my.canvas) || (!s.my.currentArticle)) {
        return;
      }
      const ctx = s.my.canvas.getContext('2d');
      const baseColor = stringRGB(s.my.currentArticle.title);
      const { canvas } = s.my;
      ctx.save();
      ctx.fillStyle = baseColor.saturate(2).hex();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(_.random(-Math.PI / 2, Math.PI / 2));
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.fillStyle = chroma.mix(baseColor.brighten(), baseColor).hex();
      ctx.font = `bold ${Math.min(canvas.width, canvas.height) / 3}px 'Helvetica Neue'`;
      let count = 0;
      s.do.blurIterations(() => ++count);
      ctx.globalAlpha = 1.0 / count;
      s.do.blurIterations((x, y) => {
        ctx.fillText(initials(s.my.currentArticle.title), x + canvas.width / 2, y + canvas.height / 2);
      });
      ctx.globalAlpha = 1;

      ctx.fillText(initials(s.my.currentArticle.title), canvas.width / 2, canvas.height / 2);

      /*     ctx.textAlign = 'left';
      ctx.fillStyle = baseColor.brighten(2).desaturate(2).hex();
      ctx.translate(canvas.width / 3, canvas.height / 4);
      ctx.rotate(Math.PI / 2);
      ctx.font = `${Math.min(canvas.width, canvas.height) / 4}px 'Helvetica Neue'`;
      ctx.fillText(s.my.currentArticle.title, 0, 0);
   */
      ctx.restore();
      s.do.canvasToTarget();
    })
    .method('blurIterations', (s, fn) => {
      _.range(-40, 41, 20).forEach((x) => {
        _.range(-40, 41, 20).forEach((y) => {
          fn(x, y);
        });
      });
    })
    .method('blurCanvas', (s) => {
      _.range(0, 6).forEach(s.do.blurCanvasIter);
    })
    .method('blurCanvasIter', (s) => {
      const ctx = s.my.canvas.getContext('2d');
      const image = new Image();
      image.src = s.my.canvas.toDataURL();
      let count = 0;
      s.do.blurIterations(() => ++count);
      ctx.save();
      ctx.globalAlpha = 1 / count;
      s.do.blurIterations((x, y) => {
        ctx.drawImage(image, x, y, s.my.canvas.width, s.my.canvas.height);
      });

      ctx.restore();
    })
    .on('resize', (s) => {
      console.log('resize');
      s.do.tryInit(true);
    }, true)
    .watchFlat('size', 'onSize')
    .property('currentArticle', null)
    .watch('currentArticle', () => debounceDraw())
    .method(
      'onSize',
      (s, size) => {
        if (!(size && typeof size === 'object')) {
          return;
        }
        try {
          const { width, height } = size;
          if (typeof width === 'number') {
            s.do.setWidth(width);
          }
          if (typeof height === 'number') {
            s.do.setHeight(height);
          }
          s.emit('resize', size);
        } catch (err) {
          console.log('error in onSize: ', err);
        }
      },
      true,
    );

  const nsSub = navStream.subscribe((ns) => {
    if (stream.my.currentArticle !== ns.my.article) {
      stream.do.setCurrentArticle(ns.my.article);
    }
  });

  const debounceDraw = _.debounce(stream.do.drawArticle, 100);

  stream.subscribe(false, (err) => {
    console.log('bg error: ', err);
  }, () => nsSub.unsubscribe());

  setInterval(() => {
    console.log('window width: ', window.innerWidth, 'background width: ', stream.my.width);
  }, 4000);

  return stream;
};
