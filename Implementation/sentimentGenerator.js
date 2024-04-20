import fs from 'fs';
import MyClassificationPipeline from './models/bertlPipeline.js';

import { dirname } from 'path'; // to use dirname in es6
import { fileURLToPath } from 'url';
const __dirname__ = dirname(fileURLToPath(import.meta.url));

import { formatJSON } from './utils/features.js';
import { log } from 'console';

try {
  const reviews = await formatJSON(__dirname__ + '/data/reviews.json');

  console.log('Running pipeline...');
  const classifier = await MyClassificationPipeline.getInstance();

  const responses = await Promise.all(
    reviews.map((review) => classifier(review.reviewText))
  );

  const updatedReviews = reviews.map((review, index) => ({
    ...review,
    index,
    classification: responses[index],
  }));

  fs.writeFileSync(
    './data/reviews_classified.json',
    JSON.stringify(updatedReviews)
  );
} catch (err) {
  console.error(err);
}
