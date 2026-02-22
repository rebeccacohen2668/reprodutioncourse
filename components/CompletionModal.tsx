
import React from 'react';
import { Trophy, ArrowRight, Home, CheckCircle } from 'lucide-react';

interface CompletionModalProps {
    isLastLevel: boolean;
    onNextLevel: () => void;
    onGoHome: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isLastLevel, onNextLevel, onGoHome }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 text-center max-w-md w-full transform transition-all">
                <div className="flex justify-center mb-6">
                    {isLastLevel ? (
                        <div className="bg-yellow-100 p-4 rounded-full">
                            <Trophy className="text-yellow-600" size={64} />
                        </div>
                    ) : (
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="text-green-600" size={64} />
                        </div>
                    )}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                    {isLastLevel 
                        ? 'כל הכבוד! סיימתם את המשחק' 
                        : 'סיימתם את השלב בהצלחה!'
                    }
                </h2>
                
                <div className="flex flex-col gap-3">
                    {isLastLevel ? (
                        <button 
                            onClick={onGoHome}
                            className="flex items-center justify-center gap-2 px-8 py-4 text-lg md:text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <Home size={24} />
                            <span>חזרה לדף הבית</span>
                        </button>
                    ) : (
                        <button 
                            onClick={onNextLevel}
                            className="flex items-center justify-center gap-2 px-8 py-4 text-lg md:text-xl font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <span>המשיכו לשלב הבא</span>
                            <ArrowRight size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletionModal;
