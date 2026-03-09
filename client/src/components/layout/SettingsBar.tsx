interface SettingsBarProps {
    time: number;
    setTime: (time: number) => void;
}

export function SettingsBar({ time, setTime }: SettingsBarProps) {
    return (
        <div className="flex items-center gap-6 bg-[#2c2e31] px-6 py-2 rounded-xl text-sm font-semibold text-[#646669]">
            <div className="flex items-center gap-4 pr-6 border-r border-[#646669]/30">
                <button className="text-[#e2b714] flex items-center gap-2">@ time</button>
            </div>
            <div className="flex items-center gap-5">
                {[15, 30, 60, 120].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`transition-colors ${time === t ? "text-[#e2b714]" : "hover:text-[#d1d0c5]"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
