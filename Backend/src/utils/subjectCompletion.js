export function getNewlyCompletedSubject(cards, completedIds, decks, card) {
  if (!card) return null;

  const completedIdSet = new Set(completedIds.map(String));
  const cardId = String(card.id);
  if (completedIdSet.has(cardId)) return null;

  const deckId = String(card.deckId || decks[0]?.id || 'default');
  const deckCards = cards.filter(
    item => String(item.deckId || decks[0]?.id || 'default') === deckId,
  );
  if (!deckCards.length || !deckCards.some(item => String(item.id) === cardId)) {
    return null;
  }

  const remainingCards = deckCards.filter(
    item => !completedIdSet.has(String(item.id)),
  );
  if (remainingCards.length !== 1) return null;

  return decks.find(item => String(item.id) === deckId)?.title || deckId;
}
