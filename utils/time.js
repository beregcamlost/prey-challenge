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
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return formattedTime;
};