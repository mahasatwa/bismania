import React, { useRef } from 'react';
import { Participant } from '../types';
import CameraIcon from './icons/CameraIcon';
import UserIcon from './icons/UserIcon';

const ParticipantAvatar = ({ participant, onDragStart, onPhotoUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag from starting
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                onPhotoUpload(participant.id, reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div 
            className="relative group flex flex-col items-center cursor-grab"
            draggable="true"
            onDragStart={() => onDragStart({ participantId: participant.id, source: { type: 'UNASSIGNED' } })}
        >
            <div
                className="flex flex-col items-center text-center p-2 rounded-xl transition-all duration-150 w-full border-2 border-transparent"
                style={{minWidth: '80px'}}
            >
                <div className="relative mb-2">
                    <img
                        src={participant.photoUrl}
                        alt={participant.name}
                        className="w-14 h-14 rounded-full bg-yellow-400 border-2 border-white shadow-md mb-1 object-cover pointer-events-none"
                        onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.onerror = null; // prevents looping
                           target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(participant.name)}`;
                        }}
                    />
                     <button
                        onClick={handleUploadClick}
                        aria-label={`Upload photo for ${participant.name}`}
                        className="absolute -bottom-1 -right-1 bg-slate-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-slate-800 shadow-md border-2 border-white"
                    >
                        <CameraIcon className="w-3.5 h-3.5" />
                    </button>
                </div>

                <p className="font-semibold text-gray-800 truncate text-xs leading-tight w-full pointer-events-none">{participant.name}</p>
                <p className="text-[10px] text-gray-500 truncate w-full pointer-events-none">{participant.id}</p>
            </div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};


const UnassignedParticipantsPanel = ({ participants, dragOverId, onParticipantDragStart, onDrop, onPhotoUpload, setDragOverId }) => {
    const isDropTarget = dragOverId === 'UNASSIGNED_PANEL';
    return (
        <div 
            className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 max-h-[80vh] flex flex-col transition-all duration-200 ${isDropTarget ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOverId('UNASSIGNED_PANEL'); }}
            onDragLeave={() => setDragOverId(null)}
            onDrop={() => onDrop({ type: 'UNASSIGNED_PANEL' })}
        >
            <div className="px-2">
                <h3 className="text-lg font-bold text-gray-800 mb-1">List Partisipan</h3>
                <p className="text-sm text-gray-500 mb-4">{participants.length} remaining</p>
            </div>
            
            <div className="overflow-y-auto flex-grow -mr-2 pr-2">
                {participants.length > 0 ? (
                    <div className="grid gap-2" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))'}}>
                       {participants.map(p => (
                            <ParticipantAvatar 
                                key={p.id}
                                participant={p}
                                onDragStart={onParticipantDragStart}
                                onPhotoUpload={onPhotoUpload}
                            />
                       ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg">
                        <UserIcon className="w-10 h-10 text-gray-400 mb-2"/>
                        <p className="font-semibold">All participants seated!</p>
                        <p className="text-xs">This list is empty.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UnassignedParticipantsPanel;