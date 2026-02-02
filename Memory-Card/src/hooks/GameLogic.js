import { useEffect, useState } from "react";

export const GameLogic = (cardValues) => {
  const [cards, setCards] = useState([]);

  const [flippedCard, setFlippedCard] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const [isLocked, setIsLocked] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const shuffle = shuffleArray(cardValues);
    const finalCards = shuffle.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
    setMoves(0);
    setScore(0);
    setMatchedCards([]);
    setFlippedCard([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (card) => {
    if (
      card.isFlipped ||
      card.isMatched ||
      isLocked ||
      flippedCard.length === 2
    ) {
      return;
    }

    //Flip cards
    const newCards = cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      } else return c;
    });

    setCards(newCards);

    const newFlippedCard = [...flippedCard, card.id];
    setFlippedCard(newFlippedCard);

    if (flippedCard.length === 1) {
      setIsLocked(true);
      const firstCard = cards[flippedCard[0]];

      if (firstCard.value === card.value) {
        // alert("Match");

        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
          setScore((prev) => prev + 1);

          const newMatchedCards = cards.map((c) => {
            if (c.id === card.id || c.id === firstCard.id) {
              return { ...c, isMatched: true };
            } else return c;
          });

          setCards((prev) =>
            prev.map((c) => {
              if (c.id === card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true };
              } else return c;
            }),
          );

          setFlippedCard([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          const flippedBackCard = newCards.map((c) => {
            if (newFlippedCard.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else return c;
          });

          setCards(flippedBackCard);
          setFlippedCard([]);
          setIsLocked(false);
        }, 1000);
      }

      setMoves((prev) => prev + 1);
    }
  };

  const isGameComplete = matchedCards.length === cardValues.length;

  return {cards, score, moves,isGameComplete,initializeGame,handleCardClick};
};
