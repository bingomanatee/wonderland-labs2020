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

const PIXEL_CLAMP = 20;
const CANVAS_RATIO = 10;
const HEX_DIVS_HI_RES = 25;
const HEX_DIVS_LO_RES = 12;

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
  const [h] = chroma(...rgb).hsv();
  return chroma.hsv(h, 0.5, 1);
};

export default ({ size }) => {
  const width = _.get(size, 'width', 100);
  const height = _.get(size, 'height', 100);
  let stream;
  const debounceDraw = _.debounce(() => {
    if (_.get(stream, 'do.drawCurrent')) {
      stream.do.drawArticle();
    }
  }, 50);

  stream = new ValueStream('sceneManager')
    .property('size', size || { width: 100, height: 100 })
    .property('width', width || 100, 'number')
    .property('height', height || 100, 'number')
    .property('ele', null)
    .property('svg', null)
    .property('hexDivs', HEX_DIVS_HI_RES, 'number')
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
    .method('reframe', (s) => {
      s.do.stopTransform();

      s.do.resizeCanvas();
      s.do.updateSVG();
      // console.log('making coords from ', s.my.width, s.my.height);
      s.do.recreateHexes();
    })
    .method(
      'tryInit',
      (s, reset) => {
        if (s.my.init && !reset) {
          console.log('tryInit abort');
          return;
        }
        s.do.reframe();
        s.do.drawCurrent();
        s.do.setInit(true);
      },
      true,
    )
    .method('stopTransform', (s) => {
      s.my.coords.forEach((c) => {
        c.dissolveTime = 0;
      });
    })
    .method('recreateHexes', (s) => {
      if (!s.my.svg) {
        return;
      }

      s.my.svg.clear();

      console.log(
        '================= recreating hexes -- hexDivs === ',
        s.my.hexDivs,
      );
      const hexScale = N(s.my.width).min(s.my.height)
        .div(s.my.hexDivs).value;
      s.do.setMatrix(new Hexes({ scale: hexScale, pointy: true }));

      const sizes = [-s.my.width / 2, -s.my.height / 2, s.my.width * 1.5, s.my.height * 1.5];
      const coords = s.my.matrix.floodRect(...sizes, true);
      const map = new Map();

      coords.forEach((c) => {
        map.set(c.toString(), c);
        const points = s.do.polyPoints(c);
        // console.log('points:', points);
        c.poly = s.my.svg.polygon(points).fill('grey');
      });
      s.do.setCoords(map);
    })
    .method('resizeCanvas', (s) => {
      const canvas = document.createElement('canvas');
      canvas.width = N(s.my.width).times(2).div(CANVAS_RATIO).value;
      canvas.height = N(s.my.height).times(2).div(CANVAS_RATIO).value;
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
          s.do.setImageResource(i);
          s.do.drawCurrent();
        };
      }
    })
    .property('imageResource', null)
    .watchFlat('imageResource', 'drawImageResource')
    .method('drawImageResource', (s) => {
      s.do.resizeCanvas();
      if (s.my.currentArticle) {
        return;
      }

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

      canvas.getContext('2d').drawImage(image, x, y, dw, dh);
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
    .method('drawCurrent', (s) => {
      console.log('drawCurrent: article = ', s.my.currentArticle, 'imageRes = ', s.my.imageResource);
      if (!(s.my.ele && s.my.width > 100 && s.my.height > 100)) {
        console.log('drawCurrent: cannot draw in state:', s.value);
        return;
      }
      s.do.stopTransform();
      requestAnimationFrame(() => {
        if (s.my.currentArticle) {
          console.log('drawCurrent: article');
          s.do.drawArticle();
        } else if (s.my.imageResource) {
          console.log('drawCurrent: image');
          s.do.drawImageResource(true);
        } else {
          console.log('drawCurrent:  load image');
          s.do.setImage('/img/bunny-rabbit.jpg');
        }
      });
    })
    .method('canvasToTarget', (s) => {
      if (!s.my.svg) {
        return;
      }

      if (!s.my.canvas) {
        return;
      }

      const ctx = s.my.canvas.getContext('2d');

      const t = Date.now();
      const midWidth = s.my.width / 2;
      const midHeight = s.my.height / 2;

      s.my.coords.forEach((c, i) => {
        if (c.poly) {
          const p = c.toXY(s.my.matrix);
          p.x = (p.x + midWidth) / CANVAS_RATIO;
          p.y = (p.y + midHeight) / CANVAS_RATIO;
          try {
            const colorValue = getCanvasPixelColor(ctx, p.x, p.y);
            c.color = colorValue.rgb;
          } catch (err) {
            console.log('error in poly color: ', err);
          }
        }
      });
      s.do.dissolve();
    })
    .method('dissolve', (s) => {
      const time = Date.now();

      s.my.coords.forEach((c) => {
        c.dissolveTime = time + _.random(1, 5) * 50;
      });
      s.do.changeColors();
    })
    .property('changing', false, 'boolean')
    .method('changeColors', (s) => {
      if (s.my.changing) {
        return;
      }
      s.do.setChanging(true);
      let remaining = 0;

      const time = Date.now();

      s.my.coords.forEach((c) => {
        if (c.dissolveTime > time) {
          ++remaining;
        } else if (c.dissolveTime > 0 && c.dissolveTime <= time && c.color) {
          if (c.poly) {
            c.poly.fill(c.color);
            c.dissolveTime = 0;
          }
        }
      });
      s.do.setChanging(false);
      if (remaining > 0) {
        requestAnimationFrame(() => s.do.changeColors());
      }
    })
    .method('drawArticle', (s) => {
      if ((!s.my.canvas) || (!s.my.currentArticle)) {
        console.log('cannot draw article', s.my.currentArticle, 'on', s.my.canvas);
        return;
      }
      const ctx = s.my.canvas.getContext('2d');
      const baseColor = stringRGB(s.my.currentArticle.title);
      const { canvas } = s.my;
      ctx.save();
      ctx.fillStyle = baseColor.brighten().hex();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(_.random(-Math.PI / 2, Math.PI / 2));
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.fillStyle = baseColor.darken(0).hex();
      ctx.font = `bold ${Math.min(canvas.width, canvas.height) / 3}px 'Helvetica Neue'`;
      ctx.fillText(initials(s.my.currentArticle.title), canvas.width / 2, canvas.height / 2);

      ctx.restore();
      requestAnimationFrame(() => {
        s.do.canvasToTarget();
      });
    })
    .on('resize', (s) => {
      console.log('resize');
      s.do.setHexDivs(HEX_DIVS_HI_RES);
      if (s.my.init) {
        s.do.reframe();
        s.do.drawCurrent();
      } else {
        s.do.tryInit(true);
      }
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
    if (!ns.my.article) {
      if (ns.my.category && ns.my.category !== stream.my.currentArticle) {
        stream.do.setCurrentArticle(ns.my.category);
      }

      return;
    }
    if (stream.my.currentArticle !== ns.my.article) {
      stream.do.setCurrentArticle(ns.my.article);
    }
  });

  stream.subscribe(false, (err) => {
    console.log('bg error: ', err);
  }, () => nsSub.unsubscribe());

  return stream;
};
