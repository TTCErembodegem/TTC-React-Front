/* eslint-disable no-mixed-operators */
// Stolen from: https://github.com/rmm5t/jquery-timeago

import t from '../locales.js';

export default function (distanceMillis) {
  const $l = t.timeAgo();
  let prefix = $l.prefixAgo;
  let suffix = $l.suffixAgo;
  if (distanceMillis < 0) {
    prefix = $l.prefixFromNow;
    suffix = $l.suffixFromNow;
  }

  const seconds = Math.abs(distanceMillis) / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;

  function substitute(stringOrFunction, number) {
    const string = typeof stringOrFunction === 'function' ? stringOrFunction(number, distanceMillis) : stringOrFunction;
    const value = ($l.numbers && $l.numbers[number]) || number;
    return string.replace(/%d/i, value);
  }

  const words = seconds < 45 && substitute($l.seconds, Math.round(seconds))
    || seconds < 90 && substitute($l.minute, 1)
    || minutes < 45 && substitute($l.minutes, Math.round(minutes))
    || minutes < 90 && substitute($l.hour, 1)
    || hours < 24 && substitute($l.hours, Math.round(hours))
    || hours < 42 && substitute($l.day, 1)
    || days < 30 && substitute($l.days, Math.round(days))
    || days < 45 && substitute($l.month, 1)
    || days < 365 && substitute($l.months, Math.round(days / 30))
    || years < 1.5 && substitute($l.year, 1)
    || substitute($l.years, Math.round(years));

  let separator = $l.wordSeparator || '';
  if ($l.wordSeparator === undefined) {
    separator = ' ';
  }
  return ([prefix, words, suffix].join(separator)).trim();
}
