import dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);


export default function parseRD(fileRevised) {
  if (!fileRevised) return null;
  const d = dayjs(fileRevised);
  if (!d.isValid()) return null;
  return d;
}
