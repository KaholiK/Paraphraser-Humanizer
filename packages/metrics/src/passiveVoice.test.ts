import { getPassiveVoicePct } from './passiveVoice';

describe('getPassiveVoicePct', () => {
  it('should return 0 for empty text', () => {
    expect(getPassiveVoicePct('')).toBe(0);
  });

  it('should return 0 for text with no passive voice', () => {
    const text = 'The cat chased the mouse. The dog barked loudly.';
    const pct = getPassiveVoicePct(text);
    expect(pct).toBe(0);
  });

  it('should detect simple passive voice', () => {
    const text = 'The ball was thrown by John.';
    const pct = getPassiveVoicePct(text);
    expect(pct).toBe(100);
  });

  it('should calculate percentage correctly', () => {
    const text = 'The ball was thrown. The cat jumped. The door was opened.';
    const pct = getPassiveVoicePct(text);
    // 2 out of 3 sentences are passive = 66.7%
    expect(pct).toBeCloseTo(66.7, 0);
  });

  it('should handle "been" passive constructions', () => {
    const text = 'The report has been completed by the team.';
    const pct = getPassiveVoicePct(text);
    expect(pct).toBe(100);
  });

  it('should handle "being" passive constructions', () => {
    const text = 'The house is being painted by workers.';
    const pct = getPassiveVoicePct(text);
    expect(pct).toBe(100);
  });

  it('should not flag exceptions as passive', () => {
    const text = 'I am interested in science. She was surprised by the news.';
    const pct = getPassiveVoicePct(text);
    // These common constructions should be filtered as exceptions
    expect(pct).toBeLessThan(50);
  });

  it('should handle mixed active and passive', () => {
    const text =
      'The experiment was conducted carefully. Scientists observed the results. Data was collected systematically. The team analyzed everything.';
    const pct = getPassiveVoicePct(text);
    // 2 out of 4 are passive = 50%
    expect(pct).toBeCloseTo(50, 0);
  });

  it('should return percentage between 0 and 100', () => {
    const texts = [
      'Active voice only.',
      'The ball was thrown.',
      'Mix of active voice and passive constructions was used here.',
    ];

    texts.forEach((text) => {
      const pct = getPassiveVoicePct(text);
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(100);
    });
  });
});
