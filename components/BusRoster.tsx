
import React from 'react';
import { Participant } from '../types';
import UserIcon from './icons/UserIcon';

type RosterParticipant = Participant & {
    seatNumber: string;
    source: {
        type: 'SEAT' | 'SPOT';
        id: string;
    }
};

interface BusRosterProps {
    participants: RosterParticipant[];
    onDragStart: (info: { participantId: string; source: { type: 'SEAT' | 'SPOT'; id: string } }) => void;
}

const BusRoster: React.FC<BusRosterProps> = ({ participants, onDragStart }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 max-h-[80vh] flex flex-col">
            <div className="px-2">
                <h3 className="text-lg font-bold text-gray-800 mb-1">Manifest Bus Roster</h3>
                <p className="text-sm text-gray-500 mb-4">{participants.length} assigned</p>
            </div>
            
            <div className="overflow-y-auto flex-grow -mr-2 pr-2">
                {participants.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                        {participants.map(p => (
                            <div 
                                key={p.id} 
                                className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50/80 border border-slate-200/60 cursor-grab hover:bg-slate-100 transition-colors bus-roster-item"
                                draggable="true"
                                onDragStart={() => onDragStart({ participantId: p.id, source: p.source })}
                            >
                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-inner pointer-events-none">
                                    {p.seatNumber}
                                </div>
                                <div className="flex-grow overflow-hidden flex items-center gap-2 pointer-events-none">
                                     <img 
                                        src={p.photoUrl} 
                                        alt={p.name} 
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null; // prevents looping
                                            target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(p.name)}`;
                                        }}
                                     />
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-gray-800 truncate text-xs">{p.name}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {'nim' in p ? `${p.nim}` : ('nuptk' in p ? `${p.nuptk || 'N/A'}`: `${p.role}`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                        <UserIcon className="w-10 h-10 text-gray-400 mb-2"/>
                        <p className="font-semibold">This bus is empty</p>
                        <p className="text-xs">Assign participants to this bus.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BusRoster;
