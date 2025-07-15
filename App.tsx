
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Bus, Participant, Seat, SpecialSpot, RequestLogEntry } from './types';
import { extractParticipantData } from './services/geminiService';
import { BUS_LAYOUT } from './constants';
import Header from './components/Header';
import BusLayout from './components/BusLayout';
import UnassignedParticipantsPanel from './components/UnassignedParticipantsPanel';
import BusRoster from './components/BusRoster';
import BusIcon from './components/icons/BusIcon';
import CheckIcon from './components/icons/CheckIcon';
import SaveIcon from './components/icons/SaveIcon';
import UploadIcon from './components/icons/UploadIcon';
import ShuffleIcon from './components/icons/ShuffleIcon';
import PaperPlaneIcon from './components/icons/PaperPlaneIcon';
import UndoIcon from './components/icons/UndoIcon';
import PrintIcon from './components/icons/PrintIcon';
import HistoryIcon from './components/icons/HistoryIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import RequestHistoryPanel from './components/RequestHistoryPanel';
import PrintView from './components/PrintView';

const APP_STORAGE_KEY_DRAFT_PARTICIPANTS = 'busApp.draft.participants';
const APP_STORAGE_KEY_DRAFT_BUSES = 'busApp.draft.buses';
const APP_STORAGE_KEY_DRAFT_LOG = 'busApp.draft.log';


const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-16 h-16 border-4 border-slate-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-gray-700">Loading Bus Manifest...</p>
        <p className="text-sm text-gray-500">Please wait.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="text-center p-8 bg-red-50 border-l-4 border-red-400">
        <h3 className="text-xl font-bold text-red-800">An Error Occurred</h3>
        <p className="text-red-600 mt-2 mb-4">{message}</p>
        <button
            onClick={onRetry}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
            Try Again
        </button>
    </div>
);


export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for all participants (master list)
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  
  // "Golden source" state, loaded from approved file or AI
  const [approvedBuses, setApprovedBuses] = useState<Bus[]>([]);
  // User's working "draft" state
  const [draftBuses, setDraftBuses] = useState<Bus[]>([]);
  const [requestLog, setRequestLog] = useState<RequestLogEntry[]>([]);
  
  const [activeBusId, setActiveBusId] = useState<number>(1);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const [draggedInfo, setDraggedInfo] = useState<{ 
    participantId: string; 
    source: { type: 'UNASSIGNED' } | { type: 'SEAT'; id: string } | { type: 'SPOT'; id: string };
  } | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const isInitialLoad = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeApp = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Step 1: Establish the "approved" baseline
            let baseParticipants: Participant[] = [];
            let baseBuses: Bus[] = [];
            let baseLog: RequestLogEntry[] = [];

            try {
                const response = await fetch('/bus_manifest_approved.json');
                if (response.ok) {
                    const data = await response.json();
                    if (!data.participants || !data.buses) {
                        throw new Error("Approved manifest file is invalid.");
                    }
                    baseParticipants = data.participants;
                    baseBuses = data.buses;
                    baseLog = data.requestLog || [];
                } else if (response.status === 404) {
                    // Approved file doesn't exist, generate from AI
                    baseParticipants = await extractParticipantData();
                    const numBuses = 2;
                    const generatedBuses: Bus[] = [];
                    for (let i = 0; i < numBuses; i++) {
                        const busId = i + 1;
                        const seats: Seat[] = BUS_LAYOUT.filter(item => item.type === 'seat').map(item => ({ id: `B${busId}-${item.seatNumber}`, seatNumber: item.seatNumber!, participantId: null, }));
                        generatedBuses.push({ id: busId, name: `Bus ${busId}`, seats: seats, specialSpots: { tourLeader: { id: 'TOUR_LEADER', participantId: null }, driver: { id: 'DRIVER', participantId: null }, } });
                    }
                    baseBuses = generatedBuses;
                } else {
                    throw new Error(`Failed to fetch approved manifest: HTTP ${response.status}`);
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                throw new Error(`Could not establish baseline data: ${message}`);
            }
            
            setApprovedBuses(baseBuses);

            // Step 2: Load user's draft from localStorage, if it exists
            const savedDraftParticipants = localStorage.getItem(APP_STORAGE_KEY_DRAFT_PARTICIPANTS);
            const savedDraftBuses = localStorage.getItem(APP_STORAGE_KEY_DRAFT_BUSES);
            const savedDraftLog = localStorage.getItem(APP_STORAGE_KEY_DRAFT_LOG);

            if (savedDraftParticipants && savedDraftBuses && savedDraftLog) {
                setAllParticipants(JSON.parse(savedDraftParticipants));
                setDraftBuses(JSON.parse(savedDraftBuses));
                setRequestLog(JSON.parse(savedDraftLog));
            } else {
                // No draft, so start with a clean copy of the approved state
                setAllParticipants(baseParticipants);
                setDraftBuses(baseBuses);
                setRequestLog(baseLog);
            }

        } catch (e) {
            const message = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
            setError(message);
        } finally {
            setIsLoading(false);
            isInitialLoad.current = false;
        }
    };
    initializeApp();
  }, []);

  // Auto-save draft changes to localStorage
  useEffect(() => {
    if (isLoading || isInitialLoad.current) return;

    try {
        localStorage.setItem(APP_STORAGE_KEY_DRAFT_PARTICIPANTS, JSON.stringify(allParticipants));
        localStorage.setItem(APP_STORAGE_KEY_DRAFT_BUSES, JSON.stringify(draftBuses));
        localStorage.setItem(APP_STORAGE_KEY_DRAFT_LOG, JSON.stringify(requestLog));
        
        setSaveStatus('saved');
        const timeoutId = setTimeout(() => setSaveStatus('idle'), 2000);
        return () => clearTimeout(timeoutId);
    } catch (e) {
        console.error("Failed to save draft to localStorage", e);
    }
  }, [allParticipants, draftBuses, requestLog, isLoading]);
  
  const participantsMap = useMemo(() => new Map(allParticipants.map(p => [p.id, p])), [allParticipants]);
  
  const assignedParticipantIds = useMemo(() => {
    const ids = new Set<string>();
    draftBuses.forEach(bus => {
        bus.seats.forEach(seat => { if(seat.participantId) ids.add(seat.participantId); });
        if(bus.specialSpots.tourLeader.participantId) ids.add(bus.specialSpots.tourLeader.participantId);
        if(bus.specialSpots.driver.participantId) ids.add(bus.specialSpots.driver.participantId);
    });
    return ids;
  }, [draftBuses]);

  const unassignedParticipants = useMemo(() => {
    return allParticipants.filter(p => !assignedParticipantIds.has(p.id));
  }, [allParticipants, assignedParticipantIds]);


  const handleDragStart = useCallback((info: { 
    participantId: string; 
    source: { type: 'UNASSIGNED' } | { type: 'SEAT'; id: string } | { type: 'SPOT'; id: string };
  }) => {
    setDraggedInfo(info);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedInfo(null);
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback((destination: { type: 'UNASSIGNED_PANEL' } | { type: 'SEAT'; id: string } | { type: 'SPOT'; id: string }) => {
    if (!draggedInfo) return;

    const newBuses: Bus[] = JSON.parse(JSON.stringify(draftBuses));
    const movedParticipantId = draggedInfo.participantId;
    let sourceRef: Seat | SpecialSpot | null = null;
    
    if (draggedInfo.source.type !== 'UNASSIGNED') {
      const source = draggedInfo.source;
      for (const bus of newBuses) {
          if (source.type === 'SEAT') {
              const seat = bus.seats.find(s => s.id === source.id);
              if (seat) { sourceRef = seat; break; }
          } else {
              if (source.id === 'TOUR_LEADER' && bus.specialSpots.tourLeader.participantId === movedParticipantId) {
                  sourceRef = bus.specialSpots.tourLeader; break;
              }
              if (source.id === 'DRIVER' && bus.specialSpots.driver.participantId === movedParticipantId) {
                  sourceRef = bus.specialSpots.driver; break;
              }
          }
      }
    }
    
    if (destination.type === 'UNASSIGNED_PANEL') {
        if (sourceRef) sourceRef.participantId = null;
    } else {
        let destRef: Seat | SpecialSpot | null = null;
        const destBus = newBuses.find(b => b.id === activeBusId)!;
        
        if (destination.type === 'SEAT') {
            destRef = destBus.seats.find(s => s.id === destination.id)!;
        } else {
            destRef = destination.id === 'TOUR_LEADER' ? destBus.specialSpots.tourLeader : destBus.specialSpots.driver;
        }

        if (!destRef || (sourceRef && (sourceRef as any).id === (destRef as any).id)) {
           // no-op
        } else {
            const occupantOfDestId = destRef.participantId;
            destRef.participantId = movedParticipantId;
            if (sourceRef) sourceRef.participantId = occupantOfDestId;
        }
    }
    setDraftBuses(newBuses);
    handleDragEnd();
  }, [draggedInfo, draftBuses, activeBusId, handleDragEnd]);


  const handlePhotoUpload = (participantId: string, photoDataUrl: string) => {
    setAllParticipants(currentParticipants => 
        currentParticipants.map(p => 
            p.id === participantId ? { ...p, photoUrl: photoDataUrl } : p
        )
    );
  };
  
  const generateChangeSummary = (approved: Bus[], draft: Bus[]): string => {
    const approvedMap = new Map<string, string | null>();
    approved.forEach(bus => {
        bus.seats.forEach(s => approvedMap.set(s.id, s.participantId));
        approvedMap.set(`B${bus.id}-TOUR_LEADER`, bus.specialSpots.tourLeader.participantId);
        approvedMap.set(`B${bus.id}-DRIVER`, bus.specialSpots.driver.participantId);
    });

    let changes = 0;
    draft.forEach(bus => {
        bus.seats.forEach(s => {
            if (approvedMap.get(s.id) !== s.participantId) changes++;
        });
        if (approvedMap.get(`B${bus.id}-TOUR_LEADER`) !== bus.specialSpots.tourLeader.participantId) changes++;
        if (approvedMap.get(`B${bus.id}-DRIVER`) !== bus.specialSpots.driver.participantId) changes++;
    });
    if (changes === 0) return "No changes made.";
    return `Modified ${changes} seat assignment(s).`;
  };

  const createAndDownloadJson = (filename: string, data: object) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleRequestChange = () => {
    const author = window.prompt("Please enter your name for the request log:");
    if (!author) return;
    
    const summary = generateChangeSummary(approvedBuses, draftBuses);
    const newLogEntry: RequestLogEntry = {
        id: crypto.randomUUID(),
        type: 'REQUEST',
        timestamp: new Date().toISOString(),
        author,
        summary,
    };
    
    const dataToSave = {
      participants: allParticipants,
      buses: draftBuses,
      requestLog: [...requestLog, newLogEntry]
    };
    createAndDownloadJson(`bus-manifest-request-${new Date().toISOString().split('T')[0]}.json`, dataToSave);
  };

  const handleApproveAndSave = () => {
    const author = window.prompt("Approver's name:");
    if (!author) return;

    const summary = generateChangeSummary(approvedBuses, draftBuses);
    const newLogEntry: RequestLogEntry = {
        id: crypto.randomUUID(),
        type: 'APPROVAL',
        timestamp: new Date().toISOString(),
        author,
        summary: `Approved changes. ${summary}`,
    };
    
    const dataToSave = {
      participants: allParticipants,
      buses: draftBuses,
      requestLog: [...requestLog, newLogEntry],
    };
    createAndDownloadJson('bus_manifest_approved.json', dataToSave);
  };

    const handleDownloadDraft = () => {
    const dataToSave = {
        participants: allParticipants,
        buses: draftBuses,
        requestLog: requestLog,
    };
    createAndDownloadJson(`bus-manifest-draft.json`, dataToSave);
  };
  
  const handleResetChanges = () => {
      setDraftBuses(JSON.parse(JSON.stringify(approvedBuses)));
      // Also reset the log to the approved one
      const approvedLog = approvedBuses.length > 0 ? (approvedBuses as any).requestLog || [] : [];
      setRequestLog(approvedLog);
  };

  const handleLoadClick = () => fileInputRef.current?.click();

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const data = JSON.parse(text);
            if (!data.participants || !data.buses) throw new Error("Invalid file format.");
            setAllParticipants(data.participants);
            setDraftBuses(data.buses);
            setRequestLog(data.requestLog || []); // Load log from file
            if(fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            alert(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };
    reader.readAsText(file);
  };
  
  const activeBus = draftBuses.find(b => b.id === activeBusId);
  const activeApprovedBus = approvedBuses.find(b => b.id === activeBusId);
  
  const activeBusParticipants = useMemo(() => {
    if (!activeBus || !participantsMap.size) return [];
    const participantsOnBus: (Participant & { seatNumber: string; source: { type: 'SEAT' | 'SPOT', id: string } })[] = [];
    activeBus.seats.forEach(seat => {
        if (seat.participantId && participantsMap.has(seat.participantId)) {
            participantsOnBus.push({ ...participantsMap.get(seat.participantId)!, seatNumber: seat.seatNumber, source: { type: 'SEAT', id: seat.id } });
        }
    });
    const { tourLeader, driver } = activeBus.specialSpots;
    if (tourLeader.participantId && participantsMap.has(tourLeader.participantId)) participantsOnBus.push({ ...participantsMap.get(tourLeader.participantId)!, seatNumber: "TL", source: { type: 'SPOT', id: 'TOUR_LEADER' } });
    if (driver.participantId && participantsMap.has(driver.participantId)) participantsOnBus.push({ ...participantsMap.get(driver.participantId)!, seatNumber: "DR", source: { type: 'SPOT', id: 'DRIVER' } });
    
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

          if (numA !== numB) {
              return numA - numB;
          }
          return letterA.localeCompare(letterB);
      }
      return seatA.localeCompare(seatB); // Fallback
    });
  }, [activeBus, participantsMap]);

  const handleRandomAssign = useCallback(() => {
      if (!activeBus) return;
      const vacantSeats = activeBus.seats.filter(seat => seat.participantId === null);
      if (vacantSeats.length === 0 || unassignedParticipants.length === 0) return;

      const shuffledUnassigned = [...unassignedParticipants].sort(() => 0.5 - Math.random());
      const newBuses: Bus[] = JSON.parse(JSON.stringify(draftBuses));
      const targetBus = newBuses.find(b => b.id === activeBusId)!;
      const targetSeatsMap = new Map(targetBus.seats.map(s => [s.id, s]));
      const assignmentsToMake = Math.min(vacantSeats.length, shuffledUnassigned.length);

      for (let i = 0; i < assignmentsToMake; i++) {
          const targetSeat = targetSeatsMap.get(vacantSeats[i].id);
          if(targetSeat) targetSeat.participantId = shuffledUnassigned[i].id;
      }
      setDraftBuses(newBuses);
  }, [activeBus, unassignedParticipants, draftBuses, activeBusId]);

  const isRandomAssignDisabled = useMemo(() => {
      if (!activeBus || unassignedParticipants.length === 0) return true;
      return !activeBus.seats.some(seat => seat.participantId === null);
  }, [activeBus, unassignedParticipants]);

  const approvedSeatState = useMemo(() => {
      const stateMap = new Map<string, string | null>();
      if (!activeApprovedBus) return stateMap;
      activeApprovedBus.seats.forEach(s => stateMap.set(s.id, s.participantId));
      stateMap.set('TOUR_LEADER', activeApprovedBus.specialSpots.tourLeader.participantId);
      stateMap.set('DRIVER', activeApprovedBus.specialSpots.driver.participantId);
      return stateMap;
  }, [activeApprovedBus]);
  
  const isSeatDirty = useCallback((seatOrSpotId: string, currentParticipantId: string | null) => {
      if (isLoading) return false;
      return approvedSeatState.get(seatOrSpotId) !== currentParticipantId;
  }, [approvedSeatState, isLoading]);
  
  const isDraftDirty = useMemo(() => {
      if (isLoading || approvedBuses.length === 0) return false;
      return JSON.stringify(approvedBuses) !== JSON.stringify(draftBuses);
  }, [approvedBuses, draftBuses, isLoading]);


  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><LoadingSpinner /></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><ErrorDisplay message={error} onRetry={() => window.location.reload()} /></div>;

  return (
    <div className="min-h-screen bg-slate-100 app-container" onDragEnd={handleDragEnd}>
      <div className="non-printable-content">
        <Header participants={allParticipants} busCount={draftBuses.length}/>
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_5fr_3fr] gap-8 items-start max-w-screen-2xl mx-auto">
            
            <div className="lg:col-span-1 sticky top-24">
                {showHistory ? (
                    <RequestHistoryPanel log={requestLog} onClose={() => setShowHistory(false)}/>
                ) : (
                    <UnassignedParticipantsPanel participants={unassignedParticipants} dragOverId={dragOverId} onParticipantDragStart={handleDragStart} onDrop={handleDrop} onPhotoUpload={handlePhotoUpload} setDragOverId={setDragOverId}/>
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-y-2">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex space-x-1 bg-slate-200/80 p-1 rounded-xl">
                            {draftBuses.map(bus => (
                                <button key={bus.id} onClick={() => setActiveBusId(bus.id)}
                                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors
                                    ${activeBusId === bus.id ? 'bg-white text-slate-800 shadow-sm' : 'text-gray-600 hover:text-slate-800 hover:bg-slate-200'}`}>
                                <BusIcon className="h-5 w-5"/><span>{bus.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                            <button onClick={handleApproveAndSave} title="Approve & Save to 'bus_manifest_approved.json'" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800">
                            <SaveIcon className="h-5 w-5"/><span className="hidden sm:inline">Approve & Save</span>
                            </button>
                            <button onClick={handleLoadClick} title="Load from JSON file" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100">
                            <UploadIcon className="h-5 w-5"/><span className="hidden sm:inline">Load</span>
                            </button>
                            <button onClick={handleDownloadDraft} title="Download current draft" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100">
                                <DownloadIcon className="h-5 w-5" /><span className="hidden sm:inline">Download</span>
                            </button>
                            <button onClick={handleRequestChange} disabled={!isDraftDirty} title="Request Change (Save draft to file)" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <PaperPlaneIcon className="h-5 w-5"/><span className="hidden sm:inline">Request</span>
                            </button>
                            <button onClick={handleResetChanges} disabled={!isDraftDirty} title="Reset Changes" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <UndoIcon className="h-5 w-5"/><span className="hidden sm:inline">Reset</span>
                            </button>
                            <button onClick={handleRandomAssign} disabled={isRandomAssignDisabled} title="Randomly assign participants" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ShuffleIcon className="h-5 w-5"/><span className="hidden sm:inline">Random</span>
                            </button>
                            <button onClick={() => window.print()} title="Print Manifest" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100">
                            <PrintIcon className="h-5 w-5"/><span className="hidden sm:inline">Print</span>
                            </button>
                            <button onClick={() => setShowHistory(s => !s)} title="Toggle Change History" className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 shadow-sm border border-slate-200/80 hover:bg-slate-50 active:bg-slate-100 ${showHistory ? 'bg-slate-200' : ''}`}>
                            <HistoryIcon className="h-5 w-5"/><span className="hidden sm:inline">History</span>
                            </button>
                            <input type="file" accept="application/json" ref={fileInputRef} onChange={handleFileLoad} className="hidden"/>
                        </div>
                    </div>
                    
                    <div className={`flex items-center space-x-2 text-sm text-slate-500 transition-opacity duration-300 ${saveStatus === 'saved' ? 'opacity-100' : 'opacity-0'}`}>
                        <CheckIcon className="h-4 w-4 text-emerald-500"/>
                        <span className="font-medium">Draft auto-saved</span>
                    </div>
                </div>
                {activeBus && (
                <BusLayout bus={activeBus} participantsMap={participantsMap} draggedInfo={draggedInfo} dragOverId={dragOverId} onDragStart={handleDragStart} onDrop={handleDrop} setDragOverId={setDragOverId} isSeatDirty={isSeatDirty} />
                )}
            </div>
            
            <div className="lg:col-span-1 sticky top-24">
                {activeBus && (<BusRoster participants={activeBusParticipants} onDragStart={handleDragStart}/>)}
            </div>

            </div>
        </main>
      </div>
      <PrintView buses={draftBuses} participantsMap={participantsMap} />
    </div>
  );
};
