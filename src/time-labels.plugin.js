import moment from "moment-timezone";
import { getXAxis } from "./plugins.utils";

/**
 * Return a duration from two dates.
 *
 * @param {number|Date} minDate Minimum date of the duration
 * @param {number|Date} maxDate Maximum date of the duration
 * @param {string}      unit    Unit of measurement
 * @returns {moment.Duration} Duration
 * @see https://momentjs.com/docs/#/displaying/difference
 */
function getDurationDiff(minDate, maxDate, unit) {
  const timerange = moment(maxDate).add(1, "ms").diff(minDate, unit);
  return moment.duration(timerange, unit);
}

/**
 * Return a format string to format dates, depending on a timerange.
 *
 * @param {number|Date} minDate Minimum date of the timerange
 * @param {number|Date} maxDate Maximum date of the timerange
 * @returns {{format: string, unit: string}} Moment format string and unit
 * @see https://momentjs.com/docs/#/displaying/format
 */
export function getDateFormatAndUnit(minDate, maxDate) {
  if (getDurationDiff(minDate, maxDate, "years").asYears() >= 1) {
    return {
      format: "MMM",
      unit: "month"
    };
  } else if (getDurationDiff(minDate, maxDate, "months").asMonths() >= 3) {
    return {
      format: "D MMM",
      unit: "day"
    };
  } else if (getDurationDiff(minDate, maxDate, "days").asDays() > 1) {
    return {
      format: "ddd D",
      unit: "day"
    };
  } else {
    return {
      format: "LT",
      unit: "hour"
    };
  }
}

function getMinUnit(timestep) {
  const duration = moment.duration(timestep);
  if (duration.asMonths() >= 1) {
    return {
      unit: "month",
      format: "MMM"
    };
  } else if (duration.asDays() >= 1) {
    return {
      unit: "day",
      format: "ddd D"
    };
  } else if (duration.asHours() >= 1) {
    return {
      unit: "hour",
      format: "LT"
    };
  } else {
    return {
      unit: "second",
      format: "LTS"
    };
  }
}

const orderOfUnits = ["second", "hour", "day", "month"];

/**
 * This plugin handles custom time labels.
 */
export default {
  id: "timelabels",
  beforeUpdate(chart, args, options) {
    const xAxis = getXAxis(chart);

    if (xAxis && xAxis.type === "time") {
      const { min, max } = xAxis.options;
      let { unit, format } = getDateFormatAndUnit(min, max);
      const { unit: minUnit, format: minUnitFormat } = getMinUnit(
        options.timestep
      );

      // Apply a unit greater than the timestep
      if (orderOfUnits.indexOf(unit) < orderOfUnits.indexOf(minUnit)) {
        ({ unit, format } = { unit: minUnit, format: minUnitFormat });
      }
      xAxis.options.time.minUnit = unit;
      xAxis.options.ticks.callback = function (value, index, values) {
        const tick = values[index];
        return tick
          ? moment(tick.value).locale(options.locale).format(format)
          : undefined;
      };
    }
  }
};
