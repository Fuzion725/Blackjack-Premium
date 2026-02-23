export type Suite = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    suite: Suite;
    rank: Rank;
    value: number;
}

export type GameStatus = 'betting' | 'dealing' | 'playing' | 'dealer-turn' | 'game-over';

export interface GameState {
    deck: Card[];
    playerHand: Card[];
    dealerHand: Card[];
    balance: number;
    currentBet: number;
    status: GameStatus;
    message: string;
}

const SUITES: Suite[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suite of SUITES) {
        for (const rank of RANKS) {
            let value = parseInt(rank);
            if (rank === 'A') value = 11;
            else if (['J', 'Q', 'K'].includes(rank)) value = 10;

            deck.push({ suite, rank, value: value || 10 });
        }
    }
    return shuffle(deck);
};

const shuffle = (deck: Card[]): Card[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
};

export const calculateScore = (hand: Card[]): number => {
    let score = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(card => card.rank === 'A').length;

    while (score > 21 && aces > 0) {
        score -= 10;
        aces -= 1;
    }
    return score;
};
