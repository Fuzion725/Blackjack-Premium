import React, { useState } from 'react';
import { Card, GameState, createDeck, calculateScore, isBlackjack } from './logic/gameEngine';

const BlackjackApp: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        deck: createDeck(),
        playerHand: [],
        dealerHand: [],
        balance: 250000,
        currentBet: 0,
        status: 'betting',
        message: 'Place your bet to begin.',
    });

    const startGame = (bet: number) => {
        if (bet > gameState.balance) return;

        let currentDeck = [...gameState.deck];
        if (currentDeck.length < 10) currentDeck = createDeck();

        const p1 = currentDeck.pop()!;
        const d1 = currentDeck.pop()!;
        const p2 = currentDeck.pop()!;
        const d2 = currentDeck.pop()!;

        const playerHand = [p1, p2];
        const dealerHand = [d1, d2];

        // Check for player Blackjack
        if (isBlackjack(playerHand)) {
            setGameState(prev => ({
                ...prev,
                deck: currentDeck,
                playerHand,
                dealerHand,
                balance: prev.balance + (bet * 1.5), // 3:2 Payout
                currentBet: bet,
                status: 'game-over',
                message: 'Blackjack! You win $' + (bet * 1.5),
            }));
            return;
        }

        setGameState(prev => ({
            ...prev,
            deck: currentDeck,
            playerHand,
            dealerHand,
            balance: prev.balance - bet,
            currentBet: bet,
            status: 'playing',
            message: 'Hit or Stand?',
        }));
    };

    const hit = () => {
        if (gameState.status !== 'playing') return;

        const currentDeck = [...gameState.deck];
        const card = currentDeck.pop()!;
        const newHand = [...gameState.playerHand, card];
        const score = calculateScore(newHand);

        if (score > 21) {
            setGameState(prev => ({
                ...prev,
                deck: currentDeck,
                playerHand: newHand,
                status: 'game-over',
                message: 'Bust! Dealer wins.',
            }));
        } else {
            setGameState(prev => ({
                ...prev,
                deck: currentDeck,
                playerHand: newHand,
            }));
        }
    };

    const stand = () => {
        if (gameState.status !== 'playing') return;

        let currentDeck = [...gameState.deck];
        let dealerHand = [...gameState.dealerHand];
        let dealerScore = calculateScore(dealerHand);

        while (dealerScore < 17) {
            const card = currentDeck.pop()!;
            dealerHand.push(card);
            dealerScore = calculateScore(dealerHand);
        }

        const playerScore = calculateScore(gameState.playerHand);
        let message = '';
        let winAmount = 0;

        if (dealerScore > 21 || playerScore > dealerScore) {
            message = 'You win!';
            winAmount = gameState.currentBet * 2;
        } else if (playerScore < dealerScore) {
            message = 'Dealer wins.';
        } else {
            message = 'Push.';
            winAmount = gameState.currentBet;
        }

        setGameState(prev => ({
            ...prev,
            deck: currentDeck,
            dealerHand,
            balance: prev.balance + winAmount,
            status: 'game-over',
            message,
        }));
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-[#eebd2b] flex flex-col font-sans p-4">
            {/* Header HUD */}
            <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-md rounded-xl border border-[#eebd2b]/30">
                <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">Balance</p>
                    <p className="text-2xl font-serif">${gameState.balance.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-white/60">Current Bet</p>
                    <p className="text-2xl font-serif">${gameState.currentBet.toLocaleString()}</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative py-12">
                <div className="absolute inset-0 bg-radial-gradient from-[#0d2b0d] to-[#050f05] rounded-[200px] border-8 border-[#3d2b1f] shadow-2xl opacity-80" />

                {/* Dealer Hand */}
                <div className="z-10 text-center mb-12">
                    <p className="text-sm uppercase mb-4 text-white/40">Dealer</p>
                    <div className="flex gap-2">
                        {gameState.dealerHand.map((card, i) => (
                            <div key={i} className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-black font-bold border-2 border-[#eebd2b]">
                                {gameState.status === 'playing' && i === 1 ? '?' : `${card.rank}${card.suit[0].toUpperCase()}`}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Player Hand */}
                <div className="z-10 text-center">
                    <div className="flex gap-2 mb-4">
                        {gameState.playerHand.map((card, i) => (
                            <div key={i} className="w-20 h-32 bg-white rounded-lg shadow-xl flex items-center justify-center text-black text-xl font-bold border-2 border-[#eebd2b]">
                                {card.rank}{card.suit[0].toUpperCase()}
                            </div>
                        ))}
                    </div>
                    <p className="text-lg font-bold mb-2">{gameState.message}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 flex flex-col gap-4">
                {gameState.status === 'betting' || gameState.status === 'game-over' ? (
                    <div className="flex justify-center gap-4">
                        {[100, 500, 1000, 5000].map(amount => (
                            <button
                                key={amount}
                                onClick={() => startGame(amount)}
                                className="w-16 h-16 rounded-full border-4 border-[#eebd2b] bg-black hover:bg-[#eebd2b] hover:text-black transition-all flex items-center justify-center font-bold"
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center gap-4">
                        <button onClick={hit} className="flex-1 py-4 bg-white/10 backdrop-blur-md border border-[#eebd2b] rounded-xl font-bold uppercase hover:bg-[#eebd2b] hover:text-black transition-all">
                            Hit
                        </button>
                        <button onClick={stand} className="flex-1 py-4 bg-white/10 backdrop-blur-md border border-[#eebd2b] rounded-xl font-bold uppercase hover:bg-[#eebd2b] hover:text-black transition-all">
                            Stand
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlackjackApp;
