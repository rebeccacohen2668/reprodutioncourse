
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FeedbackPopupProps {
    message: string;
    type: 'success' | 'error';
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ message, type }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 1400); 
        return () => clearTimeout(timer);
    }, [message, type]);
    
    const isSuccess = type === 'success';

    return (
        <div 
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
                        ${visible ? 'opacity-100 -translate-y-1/2 scale-100' : 'opacity-0 -translate-y-2/3 scale-90'}`}
        >
            <div className={`flex items-center gap-3 bg-white rounded-2xl shadow-2xl p-6 border-2 ${isSuccess ? 'border-green-500' : 'border-red-500'}`}>
                {isSuccess ? (
                    <CheckCircle2 className="text-green-500" size={32} />
                ) : (
                    <XCircle className="text-red-500" size={32} />
                )}
                <p className={`text-xl md:text-2xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default FeedbackPopup;
