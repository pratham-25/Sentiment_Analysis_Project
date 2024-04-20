import { summarization } from '@huggingface/inference';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { concatReviews } from './utils/features.js';

const reviews = await concatReviews(
  __dirname + '/data/reviews_classified.json'
);

console.log(reviews.length);

const summarizedReviews = await summarization({
  accessToken: process.env.ACCESS_TOKEN,
  model: 'facebook/bart-large-cnn',
  inputs: reviews,
  parameters: {
    max_length: 13800,
  },
});

console.log(summarizedReviews);
