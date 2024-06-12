const { emojis: { progress: i } } = require('./constants');

module.exports = function progress(cur, total = 1, segments = 15) {
  if (segments < 2) throw 'not enough segments to display progress';

  const max = segments - 1;
  const cursor = Math.floor(cur / total * max);

  const started = cursor !== 0;
  const ended = cursor === max;

  const start = started ? i.start_1 : i.start_0;
  const end = ended ? i.end_1 : i.end_0;
  const behind = i.line_1.repeat(Math.max(0, cursor - 1));
  const ahead = i.line_0.repeat(Math.max(0, max - cursor - 1));
  const swap = started && !ended ? i.swap : '';

  return `${start}${behind}${swap}${ahead}${end}`;
}