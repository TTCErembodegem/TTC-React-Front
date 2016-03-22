// Stolen from: https://github.com/rmm5t/jquery-timeago

import t from '../locales.js';

export default function(distanceMillis) {
  var $l = t.timeAgo();
  var prefix = $l.prefixAgo;
  var suffix = $l.suffixAgo;
  if (distanceMillis < 0) {
    prefix = $l.prefixFromNow;
    suffix = $l.suffixFromNow;
  }

  var seconds = Math.abs(distanceMillis) / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var years = days / 365;

  function substitute(stringOrFunction, number) {
    var string = typeof stringOrFunction === 'function' ? stringOrFunction(number, distanceMillis) : stringOrFunction;
    var value = ($l.numbers && $l.numbers[number]) || number;
    return string.replace(/%d/i, value);
  }

  var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
    seconds < 90 && substitute($l.minute, 1) ||
    minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
    minutes < 90 && substitute($l.hour, 1) ||
    hours < 24 && substitute($l.hours, Math.round(hours)) ||
    hours < 42 && substitute($l.day, 1) ||
    days < 30 && substitute($l.days, Math.round(days)) ||
    days < 45 && substitute($l.month, 1) ||
    days < 365 && substitute($l.months, Math.round(days / 30)) ||
    years < 1.5 && substitute($l.year, 1) ||
    substitute($l.years, Math.round(years));

  var separator = $l.wordSeparator || '';
  if ($l.wordSeparator === undefined) { separator = ' '; }
  return ([prefix, words, suffix].join(separator)).trim();
}