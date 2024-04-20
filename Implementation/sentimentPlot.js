import fs from 'fs';
import ChartJsImage from 'chartjs-to-image';
import { getRatingInfo, chartData, configuration } from './utils/features.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const response = await getRatingInfo(
  __dirname + '/data/reviews_classified.json'
);
const { ratings, rating_data } = response;

const chart = new ChartJsImage();

(async () => {
  chart.setConfig({
    type: 'bar',
    data: chartData(ratings, rating_data),
    options: configuration.options,
  });

  const width = 400;
  const height = 400;
  chart.setWidth(width).setHeight(height).setBackgroundColor('#ffffff');

  const url = await chart.getShortUrl();
  await chart.toFile('./data/sentimentPlot.png');
  console.log(url);
})();
