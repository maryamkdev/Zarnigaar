import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewSchema, parseReviewPage } from '../lib/validation/review.ts';

const review = {
  productId: 'c6baeb21-73fe-4bb8-9a5b-dc72150fac63',
  rating: 4,
  body: '  The size was right for me.  ',
};

test('reviews retain real feedback and trim surrounding whitespace', () => {
  const parsed = reviewSchema.parse(review);
  assert.equal(parsed.rating, 4);
  assert.equal(parsed.body, 'The size was right for me.');
});

test('reviews reject invalid ratings, empty text and oversized feedback', () => {
  for (const rating of [0, 6, 1.5, NaN, Infinity, '5', null]) {
    assert.equal(reviewSchema.safeParse({ ...review, rating }).success, false);
  }
  for (const body of ['', '  \n\t ', 'a'.repeat(2001)]) {
    assert.equal(reviewSchema.safeParse({ ...review, body }).success, false);
  }
  assert.equal(reviewSchema.safeParse({ ...review, productId: 'not-an-id' }).success, false);
});

test('a submitted review cannot choose its account identity or public author name', () => {
  for (const field of ['user_id', 'userId', 'author_name', 'authorName', 'created_at']) {
    assert.equal(reviewSchema.safeParse({ ...review, [field]: 'forged' }).success, false);
  }
});

test('review pagination handles malformed query parameters', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', 'Infinity', 'NaN', '10001']) {
    assert.equal(parseReviewPage(value), 1);
  }
  assert.equal(parseReviewPage('2'), 2);
  assert.equal(parseReviewPage('10000'), 10000);
});
