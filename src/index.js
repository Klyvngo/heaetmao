import { Chart, registerables } from "chart.js";
import "chartjs-adapter-moment";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import moment from "moment-timezone";
import data from "./data_dayOfWeek_hour";
import _ from "lodash";
Chart.register(...registerables);
Chart.register(MatrixController, MatrixElement);
const ctx = document.getElementById("myChart");

const meter = "e94e0f3f-7e77-4a7e-b220-b4dbd7f0013d";

// affichage console des générations
console.log(getHours());
console.log(getDaysWeek());
console.log(getMonths());
console.log(getDaysOfYear());
console.log(getWeeks());

// affichage console
console.log(getValueFromDate("hour", moment()));
console.log(getValueFromDate("dayOfWeek", moment()));
console.log(getValueFromDate("month", moment()));
console.log(getValueFromDate("dayOfYear", moment()));
console.log(getValueFromDate("week", moment()));

function getMaxByGroupyBy(isLeapYear) {
  return {
    hour: 24,
    dayOfWeek: 7,
    month: 12,
    dayOfYear: isLeapYear ? 366 : 365,
    week: 53
  };
}

function getHours() {
  let hours = [];
  for (let i = 0; i < getMaxByGroupyBy().hour; i++) {
    hours = [...hours, i];
  }
  return hours;
}

function getDaysWeek(localeName) {
  const [sunday, ...labels] = moment.localeData(localeName).weekdays();
  const weeks = [...labels, sunday].map(_.capitalize);
  return weeks.reverse();
}

function getMonths(localeName) {
  return moment.localeData(localeName).months().map(_.capitalize).reverse();
}

function getDaysOfYear() {
  let days = [];
  for (let i = 0; i < getMaxByGroupyBy().dayOfYear; i++) {
    days = [...days, i];
  }
  return days;
}

function getWeeks() {
  let weeks = [];
  for (let i = 0; i < getMaxByGroupyBy().week; i++) {
    weeks = [...weeks, i];
  }
  return weeks;
}

function getValueFromDate(type, value) {
  switch (type) {
    case "hour":
      return moment(value).get("hour");
    case "dayOfWeek":
      return moment(value).format("dddd");
    case "month":
      return moment(value).format("MMMM");
    case "dayOfYear":
      return moment(value).get("dayOfYear");
    case "week":
      return moment(value).get("week");
    default:
      return "";
  }
}

function generateData(xAxisType, yAxisType) {
  let heatData = [];

  const xMax = getMaxByGroupyBy(false)[xAxisType];
  const yMax = getMaxByGroupyBy(false)[yAxisType];
  let compteur = 0;
  for (let x = 0; x < xMax; x++) {
    for (let y = 0; y < yMax; y++) {
      heatData = [
        ...heatData,
        {
          x: getValueFromDate(xAxisType, data[compteur].timestamp),
          y: getValueFromDate(yAxisType, data[compteur].timestamp),
          v: data[compteur][meter]
        }
      ];
      compteur = compteur + 1;
    }
  }
  return heatData;
}

function getBackgroundColor(colors, value) {
  const subColors = colors.filter((c) => c.value < value);
  const subColorsLength = subColors.length;
  if (subColorsLength === 0) {
    return colors[0].color;
  } else {
    return subColors[subColorsLength - 1].color;
  }
}

const colors = [
  { value: 2, color: "#0000FF" },
  { value: 5, color: "#B0C4DE" },
  { value: 8, color: "#B0E0E6" },
  { value: 15, color: "#ADD8E6" },
  { value: 20, color: "#CBB8E6" }
];

const chart = new Chart(ctx, {
  type: "matrix",
  data: {
    datasets: [
      {
        data: generateData("hour", "dayOfWeek"),
        backgroundColor: function (ctx) {
          var value = ctx.dataset.data[ctx.dataIndex].v;
          return getBackgroundColor(colors, value);
        }
      }
    ]
  },
  options: {
    scales: {
      x: {
        type: "category",
        labels: getHours(),
        grid: {
          display: false,
          drawBorder: false
        }
      },
      y: {
        type: "category",
        labels: getDaysWeek(),
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    plugins: {
      legend: false,
      tooltip: {
        enabled: false
      }
    }
  }
});
