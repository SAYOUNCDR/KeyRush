import { IconRefresh } from "@tabler/icons-react";

interface StatsScreenProps {
    stats: { wpm: number; accuracy: number };
    onRestart: () => void;
}

export function StatsScreen({ stats, onRestart }: StatsScreenProps) {
    return (
        <div className="w-full max-w-4xl flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-500">
            <div className="flex gap-20 mb-16">
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-black text-[#e2b714] mb-2">{stats.wpm}</span>
                    <span className="text-xl text-[#646669] font-semibold uppercase tracking-widest">WPM</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-6xl font-black text-[#e2b714] mb-2">{stats.accuracy}%</span>
                    <span className="text-xl text-[#646669] font-semibold uppercase tracking-widest">ACC</span>
                </div>
            </div>

            <button
                onClick={onRestart}
                className="text-[#646669] hover:text-[#d1d0c5] transition-colors p-4 rounded-full hover:bg-white/5"
                title="Restart"
            >
                <IconRefresh className="w-8 h-8" />
            </button>
        </div>
    );
}
