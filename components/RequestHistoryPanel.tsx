
import React from 'react';
import { RequestLogEntry } from '../types';
import PaperPlaneIcon from './icons/PaperPlaneIcon';
import CheckIcon from './icons/CheckIcon';
import HistoryIcon from './icons/HistoryIcon';

interface RequestHistoryPanelProps {
    log: RequestLogEntry[];
    onClose: () => void;
}

const LogEntry: React.FC<{ entry: RequestLogEntry }> = ({ entry }) => {
    const isRequest = entry.type === 'REQUEST';
    const Icon = isRequest ? PaperPlaneIcon : CheckIcon;
    const bgColor = isRequest ? 'bg-blue-50' : 'bg-emerald-50';
    const borderColor = isRequest ? 'border-blue-200' : 'border-emerald-200';
    const iconColor = isRequest ? 'text-blue-600' : 'text-emerald-600';

    return (
        <li className={`flex items-start space-x-4 p-3 rounded-lg border ${bgColor} ${borderColor}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${iconColor} bg-white mt-1`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-baseline">
                    <p className="font-bold text-slate-800">{entry.author}</p>
                    <p className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
                <p className="text-sm text-slate-600">{entry.summary}</p>
            </div>
        </li>
    );
};

const RequestHistoryPanel: React.FC<RequestHistoryPanelProps> = ({ log, onClose }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 max-h-[80vh] flex flex-col">
            <div className="px-2 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Change History</h3>
                    <p className="text-sm text-gray-500 mb-4">{log.length} entries</p>
                </div>
                 <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            
            <div className="overflow-y-auto flex-grow -mr-2 pr-2">
                {log.length > 0 ? (
                    <ul className="space-y-3">
                        {log.slice().reverse().map(entry => (
                           <LogEntry key={entry.id} entry={entry} />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 text-gray-500 h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                        <HistoryIcon className="w-10 h-10 text-gray-400 mb-2"/>
                        <p className="font-semibold">No History Yet</p>
                        <p className="text-xs">Changes will be logged here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RequestHistoryPanel;
