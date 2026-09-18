const FLASHCARDS_URL =
  'https://opentdb.com/api.php?amount=10&type=multiple';

const namedEntities = {
  '&amp;': '&',
  '&apos;': "'",
  '&quot;': '"',
  '&lt;': '<',
  '&gt;': '>',
  '&#039;': "'",
};

function decodeHtml(value) {
  return value
    .replace(/&(amp|apos|quot|lt|gt);|&#039;/g, entity => namedEntities[entity])
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => {
      const codePoint = code.startsWith('x')
        ? parseInt(code.slice(1), 16)
        : parseInt(code, 10);
      return String.fromCodePoint(codePoint);
    });
}

export async function fetchFlashcards() {
  const response = await fetch(FLASHCARDS_URL);

  if (!response.ok) {
    throw new Error(`Flashcards request failed with status ${response.status}.`);
  }

  const payload = await response.json();

  if (payload.response_code !== 0 || !Array.isArray(payload.results)) {
    throw new Error('The flashcards service returned an invalid response.');
  }

  return payload.results.map((card, index) => ({
    id: `${card.category}-${card.question}-${index}`,
    subject: decodeHtml(card.category),
    question: decodeHtml(card.question),
    answer: decodeHtml(card.correct_answer),
    difficulty: card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1),
  }));
}
