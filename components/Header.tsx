
import React from 'react';
import BusIcon from './icons/BusIcon';
import UserIcon from './icons/UserIcon';
import { Participant, ParticipantType } from '../types';

interface HeaderProps {
  participants: Participant[];
  busCount: number;
}

const Header: React.FC<HeaderProps> = ({ participants, busCount }) => {
  const totalParticipants = participants.length;
  const studentCount = participants.filter(p => p.type === ParticipantType.STUDENT).length;
  const lecturerCount = participants.filter(p => p.type === ParticipantType.LECTURER).length;
  const assistantCount = participants.filter(p => p.type === ParticipantType.ASSISTANT).length;

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-2 rounded-lg">
                <BusIcon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-800">Bus Seat Manager</h1>
                <p className="text-xs text-gray-500">STIE Dwimulya - IDX Industry Visit</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
                <UserIcon className="h-5 w-5"/>
                <span className="font-medium">{totalParticipants} Total ({studentCount} S, {lecturerCount} L, {assistantCount} A)</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
                <BusIcon className="h-5 w-5"/>
                <span className="font-medium">{busCount} Buses</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
