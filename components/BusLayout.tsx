
import React from 'react';
import { Bus, Participant } from '../types';
import { BUS_LAYOUT } from '../constants';
import SeatIcon from './icons/SeatIcon';

interface BusLayoutProps {
  bus: Bus;
  participantsMap: Map<string, Participant>;
  draggedInfo: { participantId: string } | null;
  dragOverId: string | null;
  onDragStart: (info: { participantId: string; source: { type: 'SEAT' | 'SPOT'; id: string } }) => void;
  onDrop: (destination: { type: 'SEAT' | 'SPOT'; id: string }) => void;
  setDragOverId: (id: string | null) => void;
  isSeatDirty: (seatOrSpotId: string, currentParticipantId: string | null) => boolean;
}

const SeatComponent = ({ seatId, participant, isHighlighted, isDirty, onDragStart, onDrop, setDragOverId }) => {
    const isOccupied = !!participant;
    const baseClasses = "w-full h-full rounded-md flex flex-col items-center justify-start p-0.5 shadow-sm transition-all duration-200 ease-in-out border";
    const stateClasses = isOccupied 
        ? 'bg-sky-50 border-sky-200 cursor-grab' 
        : 'bg-slate-200/70 border-slate-300/80';
    const highlightClasses = isHighlighted ? 'ring-2 ring-offset-1 ring-blue-500' : 'ring-1 ring-transparent';
    const dirtyClasses = isDirty ? 'ring-2 ring-yellow-400 ring-offset-1' : '';

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragOverId(seatId); }}
            onDragLeave={() => setDragOverId(null)}
            onDrop={(e) => { e.stopPropagation(); onDrop({ type: 'SEAT', id: seatId }); }}
            onDragStart={(e) => { e.stopPropagation(); onDragStart({ participantId: participant.id, source: { type: 'SEAT', id: seatId } }); }}
            draggable={isOccupied}
            aria-label={`Seat ${seatId}, ${isOccupied ? `occupied by ${participant.name}` : 'vacant'}`}
            className={`${baseClasses} ${stateClasses} ${highlightClasses} ${dirtyClasses}`}
        >
            <div className="text-[9px] font-semibold text-slate-500">{seatId.split('-')[1]}</div>
            <div className="flex-grow flex items-center justify-center w-full pb-0.5">
                {isOccupied ? (
                    <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                        <img src={participant.photoUrl} alt={participant.name} className="w-7 h-7 rounded-full bg-white object-cover border-2 border-white shadow"/>
                        <span className="text-[10px] font-semibold text-slate-800 leading-tight break-all mt-1">{participant.name.split(' ')[0]}</span>
                    </div>
                ) : (
                    <SeatIcon className="w-6 h-6 text-slate-400" />
                )}
            </div>
        </div>
    )
}

const SpecialSpot = ({ spotId, participant, isHighlighted, isDirty, onDragStart, onDrop, setDragOverId }) => {
    const isOccupied = !!participant;
    const isTourLeader = spotId === 'TOUR_LEADER';
    
    const baseClasses = "h-20 w-full rounded-lg flex flex-col items-center justify-center p-1 shadow-sm transition-all duration-200 ease-in-out border";
    const stateClasses = isTourLeader 
        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
        : "bg-amber-50 border-amber-200 text-amber-800";
    const highlightClasses = isHighlighted ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-1 ring-transparent';
    const dirtyClasses = isDirty ? 'ring-2 ring-yellow-400 ring-offset-1' : '';
    const label = isTourLeader ? "Tour Leader" : "Driver";

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragOverId(spotId); }}
            onDragLeave={() => setDragOverId(null)}
            onDrop={(e) => { e.stopPropagation(); onDrop({ type: 'SPOT', id: spotId }); }}
            onDragStart={(e) => { e.stopPropagation(); onDragStart({ participantId: participant.id, source: { type: 'SPOT', id: spotId } }) }}
            draggable={isOccupied}
            className={`${baseClasses} ${stateClasses} ${highlightClasses} ${dirtyClasses} ${isOccupied ? 'cursor-grab' : ''}`}
        >
            <span className="font-bold text-xs">{label}</span>
            <div className="pointer-events-none">
              {isOccupied ? (
                   <div className="flex flex-col items-center justify-center flex-grow text-center mt-1">
                      <img src={participant.photoUrl} alt={participant.name} className="w-8 h-8 rounded-full bg-white mb-1 border-2 border-white object-cover shadow"/>
                      <span className="text-[11px] font-semibold leading-tight">{participant.name.split(' ')[0]}</span>
                      <span className="text-[9px] opacity-70">{participant.id}</span>
                  </div>
              ) : <div className="text-[11px] mt-1 opacity-80">(Vacant)</div>}
            </div>
        </div>
    )
}


const BusLayout: React.FC<BusLayoutProps> = ({ bus, participantsMap, dragOverId, onDragStart, onDrop, setDragOverId, isSeatDirty }) => {
  const seatsMap = new Map(bus.seats.map(s => [s.seatNumber, s]));
  const tourLeaderParticipant = bus.specialSpots.tourLeader.participantId ? participantsMap.get(bus.specialSpots.tourLeader.participantId) ?? null : null;
  const driverParticipant = bus.specialSpots.driver.participantId ? participantsMap.get(bus.specialSpots.driver.participantId) ?? null : null;

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200/80">
       <div className="grid grid-cols-2 gap-4 mb-4">
           <SpecialSpot 
                spotId="TOUR_LEADER"
                isHighlighted={dragOverId === 'TOUR_LEADER'}
                participant={tourLeaderParticipant}
                isDirty={isSeatDirty('TOUR_LEADER', bus.specialSpots.tourLeader.participantId)}
                onDragStart={onDragStart}
                onDrop={onDrop}
                setDragOverId={setDragOverId}
           />
            <SpecialSpot 
                spotId="DRIVER"
                isHighlighted={dragOverId === 'DRIVER'}
                participant={driverParticipant}
                isDirty={isSeatDirty('DRIVER', bus.specialSpots.driver.participantId)}
                onDragStart={onDragStart}
                onDrop={onDrop}
                setDragOverId={setDragOverId}
           />
       </div>

      <div className="grid gap-x-1.5 gap-y-3" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {BUS_LAYOUT.map((item) => {
          const key = `${item.type}-${item.id}`;
          switch (item.type) {
            case 'seat':
              const seat = seatsMap.get(item.seatNumber!);
              if (!seat) return <div key={key} className="bg-red-200 aspect-square">Error</div>;
              const participant = seat.participantId ? participantsMap.get(seat.participantId) ?? null : null;
              return (
                <div key={key} className="col-span-1 aspect-[5/6]">
                   <SeatComponent
                      seatId={seat.id}
                      participant={participant}
                      isHighlighted={dragOverId === seat.id}
                      isDirty={isSeatDirty(seat.id, seat.participantId)}
                      onDragStart={onDragStart}
                      onDrop={onDrop}
                      setDragOverId={setDragOverId}
                    />
                </div>
              );
            case 'aisle':
              return <div key={key} className="col-span-1" aria-hidden="true" />;
            case 'empty':
               return <div key={key} className="col-span-1" aria-hidden="true" />;
            case 'door':
                return (
                    <div key={key} className="col-span-6 my-1 flex items-center justify-center gap-3 text-slate-500 text-[10px] font-semibold tracking-wider">
                        <div className="flex-grow h-px bg-slate-200"></div>
                        <span>{item.text}</span>
                        <div className="flex-grow h-px bg-slate-200"></div>
                    </div>
                )
            default:
              return <div key={key} className="col-span-1" aria-hidden="true" />;
          }
        })}
      </div>
    </div>
  );
};

export default BusLayout;
