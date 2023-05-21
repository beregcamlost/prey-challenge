import moment from 'moment';

/**
 * Calculates the time in hours, minutes, and seconds from a time value in milliseconds, using Moment.js.
 *
 * @param {number} timemilis - The time value in milliseconds.
 * @returns {string} The formatted time string in the format "ss:mm:hh".
 *
 * @example
 * // returns "01:23:45"
 * timeCalc(5025000);
 */
export const timeCalc = (timemilis) => {
  const duration = moment.duration(timemilis);
  const s = duration.seconds().toString().padStart(2, '0');
  const m = duration.minutes().toString().padStart(2, '0');
  const h = duration.hours().toString().padStart(2, '0');
  return `${s}:${m}:${h}`;
};