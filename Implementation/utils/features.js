import fs from 'fs';

export const chartData = (ratings, rating_data) => {
  return {
    labels: ratings,
    datasets: [
      {
        label: 'Positive',
        data: rating_data[1],
        backgroundColor: '#BDF5FF',
      },
      {
        label: 'Negative',
        data: rating_data[0],
        backgroundColor: '#FF1F39',
      },
    ],
  };
};

export const configuration = () => {
  return {
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
        },
        x: {
          stacked: true,
        },
        plugins: [
          {
            title: {
              display: true,
              text: 'Product Ratings',
            },
          },
        ],
        responsive: true,
      },
    },
  };
};

export const concatReviews = async (path) => {
  const data = fs.readFileSync(path, 'utf8');
  const reviewsClassified = await JSON.parse(data);

  let allReviews = '';

  Object.values(reviewsClassified).forEach(
    (review) => (allReviews = allReviews.concat(review.reviewText))
  );

  return allReviews;
};

export const formatJSON = async (path) => {
  const data = fs.readFileSync(path, 'utf8');
  const reviews_info = await JSON.parse(data);
  let reviews = reviews_info.data;

  reviews = reviews.map(
    ([
      overall,
      vote,
      verified,
      reviewTime,
      reviewerID,
      asin,
      reviewerName,
      reviewText,
      summary,
      unixReviewTime,
      style,
      image,
    ]) => ({
      overall,
      vote,
      verified,
      reviewTime,
      reviewerID,
      asin,
      reviewerName,
      reviewText,
      summary,
      unixReviewTime,
      style,
      image,
    })
  );

  fs.writeFileSync(
    './data/reviews_refined.json',
    JSON.stringify(reviews, null, 2),
    'utf-8'
  );

  return reviews;
};

export const countRating = (reviews, rating, sentiment) => {
  return Object.values(reviews).filter(
    (review) =>
      review.overall === rating && review.classification[0].label === sentiment
  ).length;
};

export const getRatingInfo = async (path) => {
  const data = fs.readFileSync(path, 'utf8');
  const reviews = await JSON.parse(data);

  const ratings = Array.from({ length: 5 }, (_, i) => String(i + 1));

  const negativeReviews = [];
  const positiveReviews = [];

  for (let rating = 1; rating <= 5; rating++) {
    negativeReviews[rating - 1] = countRating(reviews, rating, 'NEGATIVE');
    positiveReviews[rating - 1] = countRating(reviews, rating, 'POSITIVE');
  }

  const rating_data = [negativeReviews, positiveReviews]; 

  return { ratings, rating_data };
};
