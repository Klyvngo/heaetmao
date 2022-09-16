/**
 * Return the first horizontal axis of the given chart.
 *
 * @param {Chart} chart Chart.js object
 * @returns {Object} Found scale object
 */
export function getXAxis(chart) {
  return Object.values(chart.scales).find((scale) => scale.isHorizontal());
}

/**
 * Return the first vertical axis of the given chart.
 *
 * @param {Chart} chart Chart.js object
 * @returns {Object} Found scale object
 */
export function getYAxis(chart) {
  return Object.values(chart.scales).find((scale) => !scale.isHorizontal());
}
