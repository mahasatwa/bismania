import React, { useMemo } from 'react';
import { Bus, Participant } from '../types';
import BusLayout from './BusLayout';
import BusRoster from './BusRoster';

type RosterParticipant = Participant & {
    seatNumber: string;
    source: { type: 'SEAT' | 'SPOT', id: string }
};

const PrintBusLayout: React.FC<any> = (props) => (
    <BusLayout 
        {...props} 
        draggedInfo={null}
        dragOverId={null} 
        onDragStart={() => {}} 
        onDrop={() => {}} 
        setDragOverId={() => {}} 
        isSeatDirty={() => false} 
    />
);

const PrintBusRoster: React.FC<any> = (props) => (
    <BusRoster {...props} onDragStart={() => {}} />
);


const getParticipantsForBus = (bus: Bus, participantsMap: Map<string, Participant>): RosterParticipant[] => {
    if (!bus || !participantsMap.size) return [];
    
    const participantsOnBus: RosterParticipant[] = [];
    bus.seats.forEach(seat => {
        if (seat.participantId && participantsMap.has(seat.participantId)) {
            participantsOnBus.push({ ...participantsMap.get(seat.participantId)!, seatNumber: seat.seatNumber, source: { type: 'SEAT', id: seat.id } });
        }
    });
    
    const { tourLeader, driver } = bus.specialSpots;
    if (tourLeader.participantId && participantsMap.has(tourLeader.participantId)) {
        participantsOnBus.push({ ...participantsMap.get(tourLeader.participantId)!, seatNumber: "TL", source: { type: 'SPOT', id: 'TOUR_LEADER' } });
    }
    if (driver.participantId && participantsMap.has(driver.participantId)) {
        participantsOnBus.push({ ...participantsMap.get(driver.participantId)!, seatNumber: "DR", source: { type: 'SPOT', id: 'DRIVER' } });
    }
    
    return participantsOnBus.sort((a, b) => {
        const seatA = a.seatNumber;
        const seatB = b.seatNumber;
        const isSpecialA = seatA === 'TL' || seatA === 'DR';
        const isSpecialB = seatB === 'TL' || seatB === 'DR';
        if (isSpecialA && !isSpecialB) return 1;
        if (!isSpecialA && isSpecialB) return -1;
        if (isSpecialA && isSpecialB) return seatA.localeCompare(seatB);

        const matchA = seatA.match(/(\d+)(\w+)/);
        const matchB = seatB.match(/(\d+)(\w+)/);
        if (matchA && matchB) {
            const numA = parseInt(matchA[1], 10);
            const letterA = matchA[2];
            const numB = parseInt(matchB[1], 10);
            const letterB = matchB[2];
            if (numA !== numB) return numA - numB;
            return letterA.localeCompare(letterB);
        }
        return seatA.localeCompare(seatB); // Fallback
    });
};

interface PrintViewProps {
    buses: Bus[];
    participantsMap: Map<string, Participant>;
}

const PrintView: React.FC<PrintViewProps> = ({ buses, participantsMap }) => {
    return (
        <div className="hidden print:block font-sans p-4">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold">Bus Seating Manifest</h1>
                <p className="text-lg text-slate-700">STIE Dwimulya - IDX Industry Visit</p>
            </header>
            
            {buses.map((bus) => {
                const busParticipants = getParticipantsForBus(bus, participantsMap);
                return (
                    <section key={bus.id} className="print-page-container">
                        <h2 className="text-2xl font-bold border-b-2 border-black pb-2 mb-4">{bus.name} - Manifest & Seating Chart</h2>
                        <div className="flex gap-6">
                            <div style={{width: '60%'}}>
                                <PrintBusLayout bus={bus} participantsMap={participantsMap} />
                            </div>
                            <div style={{width: '40%'}}>
                                <PrintBusRoster participants={busParticipants} />
                            </div>
                        </div>
                    </section>
                )
            })}
        </div>
    );
};

export default PrintView;
