import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveHomepageVisibility, isHomepageSectionId } from '../lib/homepage-sections.ts';

test('unavailable settings keep real content enabled and unused placeholder tiles hidden', () => {
  const defaults = resolveHomepageVisibility(null);
  assert.equal(defaults.hero, true);
  assert.equal(defaults.scarves, true);
  assert.equal(defaults.our_articles, true);
  for (const id of ['scarves_promotion', 'clothing_promotion', 'accessories_promotion']) assert.equal(defaults[id], false);
});

test('saved choices override defaults without enabling unconfigured placeholders', () => {
  const settings = resolveHomepageVisibility([{ section_id: 'hero', enabled: false }, { section_id: 'clothing_promotion', enabled: true }]);
  assert.equal(settings.hero, false);
  assert.equal(settings.clothing_promotion, true);
  assert.equal(settings.scarves_promotion, false);
  assert.equal(settings.accessories_promotion, false);
});

test('unknown section identifiers and malformed visibility values cannot change defaults', () => {
  const settings = resolveHomepageVisibility([
    { section_id: '__proto__', enabled: true },
    { section_id: 'constructor', enabled: true },
    { section_id: 'seasonal_favorites', enabled: true },
    { section_id: 'scarves_promotion', enabled: 'false' },
  ]);
  assert.equal(Object.hasOwn(settings, '__proto__'), false);
  assert.equal(Object.hasOwn(settings, 'constructor'), false);
  assert.equal(Object.hasOwn(settings, 'seasonal_favorites'), false);
  assert.equal(settings.scarves_promotion, false);
  assert.equal(isHomepageSectionId('our_articles'), true);
  assert.equal(isHomepageSectionId('constructor'), false);
  assert.equal(isHomepageSectionId(null), false);
});

test('one request cannot mutate another requests defaults', () => {
  const first = resolveHomepageVisibility(null);
  first.scarves_promotion = true;
  assert.equal(resolveHomepageVisibility(null).scarves_promotion, false);
});
