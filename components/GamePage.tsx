
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Home, CheckCircle2, AlertCircle } from 'lucide-react';
import { Unit, Pair } from '../types';
import FeedbackPopup from './FeedbackPopup';
import CompletionModal from './CompletionModal';

interface GamePageProps {
    unitName: string;
    unitData: Unit;
    onGoHome: () => void;
}

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const GamePage: React.FC<GamePageProps> = ({ unitName, unitData, onGoHome }) => {
    const [levelIndex, setLevelIndex] = useState(0);
    const [shuffledConcepts, setShuffledConcepts] = useState<Pair[]>([]);
    const [shuffledDefinitions, setShuffledDefinitions] = useState<Pair[]>([]);
    const [matchedConcepts, setMatchedConcepts] = useState<Set<string>>(new Set());
    const [draggedItem, setDraggedItem] = useState<Pair | null>(null);
    const [selectedConcept, setSelectedConcept] = useState<Pair | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isLevelComplete, setIsLevelComplete] = useState(false);
    const [dropZoneHighlight, setDropZoneHighlight] = useState<string | null>(null);

    const currentLevel = useMemo(() => unitData.levels[levelIndex], [unitData, levelIndex]);

    const loadLevel = useCallback(() => {
        const pairs = currentLevel.pairs;
        setShuffledConcepts(shuffleArray(pairs));
        setShuffledDefinitions(shuffleArray(pairs));
        setMatchedConcepts(new Set());
        setIsLevelComplete(false);
    }, [currentLevel]);

    useEffect(() => {
        loadLevel();
    }, [loadLevel]);
    
    useEffect(() => {
        if (matchedConcepts.size > 0 && matchedConcepts.size === currentLevel.pairs.length) {
            setTimeout(() => setIsLevelComplete(true), 500);
        }
    }, [matchedConcepts, currentLevel.pairs.length]);

    const handleDragStart = (pair: Pair) => {
        setDraggedItem(pair);
        setSelectedConcept(pair);
    };

    const handleConceptClick = (pair: Pair) => {
        if (matchedConcepts.has(pair.concept)) return;
        setSelectedConcept(prev => prev?.concept === pair.concept ? null : pair);
    };

    const handleDefinitionClick = (pair: Pair) => {
        if (selectedConcept) {
            handleDrop(pair, selectedConcept);
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, pair: Pair) => {
        e.preventDefault();
        if (matchedConcepts.has(pair.concept)) return;
        setDropZoneHighlight(pair.definition);
    };

    const handleDragLeave = () => {
        setDropZoneHighlight(null);
    };
    
    const showFeedback = (message: string, type: 'success' | 'error') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 1500);
    };

    const handleDrop = (targetPair: Pair, itemToDrop?: Pair) => {
        setDropZoneHighlight(null);
        const item = itemToDrop || draggedItem;
        if (!item) return;

        if (item.concept === targetPair.concept) {
            setMatchedConcepts(prev => new Set(prev).add(item.concept));
            showFeedback('✅ נכון מאוד!', 'success');
            setSelectedConcept(null);
        } else {
            showFeedback('❌ נסו שוב!', 'error');
        }
        setDraggedItem(null);
    };

    const goToNextLevel = () => {
        if (levelIndex < unitData.levels.length - 1) {
            setLevelIndex(prev => prev + 1);
        }
    };

    const isLastLevel = levelIndex === unitData.levels.length - 1;

    return (
        <div>
            {feedback && <FeedbackPopup message={feedback.message} type={feedback.type} />}
            {isLevelComplete && (
                <CompletionModal 
                    isLastLevel={isLastLevel}
                    onNextLevel={goToNextLevel}
                    onGoHome={onGoHome}
                />
            )}
            
            <div className="mb-6">
                <button onClick={onGoHome} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                    <Home size={20} />
                    <span>חזרה לדף הבית</span>
                </button>
            </div>
            
            <div className="text-center mb-8 px-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{unitName}</h1>
                <p className="text-base md:text-lg text-gray-600 mb-4">{unitData.intro}</p>
                <p className="text-lg md:text-xl font-semibold text-blue-600">{currentLevel.name}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-2 md:p-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 gap-2 md:gap-8">
                    {/* Concepts Column */}
                    <div className="flex flex-col">
                        <h2 className="text-lg md:text-2xl font-bold text-center text-blue-600 mb-4 md:mb-6">מושגים</h2>
                        <div className="flex flex-col gap-2 md:gap-3">
                            {shuffledConcepts.map((pair) => {
                                const isMatched = matchedConcepts.has(pair.concept);
                                const isDragging = draggedItem?.concept === pair.concept;
                                const isSelected = selectedConcept?.concept === pair.concept;
                                return (
                                    <div
                                        key={`concept-${pair.concept}`}
                                        draggable={!isMatched}
                                        onDragStart={() => handleDragStart(pair)}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => handleConceptClick(pair)}
                                        className={`h-[130px] md:h-[140px] flex items-center justify-center p-2 text-center text-xs md:text-base font-semibold rounded-lg border-2 transition-all duration-200
                                            ${isMatched 
                                                ? 'bg-green-100 border-green-300 text-gray-500'
                                                : isSelected
                                                    ? 'bg-blue-300 border-blue-500 ring-2 ring-blue-400 cursor-pointer'
                                                    : 'bg-blue-100 border-blue-300 cursor-grab hover:bg-blue-200'
                                            }
                                            ${isDragging ? 'opacity-50 rotate-3' : ''}
                                        `}
                                    >
                                        <span className="break-words">{pair.concept}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Definitions Column */}
                    <div className="flex flex-col">
                        <h2 className="text-lg md:text-2xl font-bold text-center text-orange-600 mb-4 md:mb-6">הסברים</h2>
                        <div className="flex flex-col gap-2 md:gap-3">
                            {shuffledDefinitions.map((pair) => {
                                const isMatched = matchedConcepts.has(pair.concept);
                                const isHighlighted = dropZoneHighlight === pair.definition;
                                return (
                                    <div
                                        key={`definition-${pair.definition}`}
                                        onDrop={() => handleDrop(pair)}
                                        onDragOver={(e) => handleDragOver(e, pair)}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => handleDefinitionClick(pair)}
                                        className={`h-[130px] md:h-[140px] flex items-center justify-center p-2 md:p-4 text-center text-[10px] md:text-sm lg:text-base rounded-lg border-2 transition-all duration-200 overflow-y-auto
                                            ${isMatched
                                                ? 'bg-green-100 border-green-300'
                                                : 'bg-orange-100 border-orange-300 cursor-pointer hover:bg-orange-200'
                                            }
                                            ${isHighlighted ? 'bg-blue-200 border-blue-400 scale-105' : ''}
                                        `}
                                    >
                                        <span className="break-words leading-tight">{pair.definition}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
