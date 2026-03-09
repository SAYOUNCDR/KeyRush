interface SettingsBarProps {
    time: number;
    setTime: (time: number) => void;
}

export function SettingsBar({ time, setTime }: SettingsBarProps) {
    return (
        <div className="flex items-center gap-6 bg-[var(--theme-secondary-bg)] px-6 py-2 rounded-xl text-sm font-semibold text-[var(--theme-muted)] transition-colors duration-300">
            <div className="flex items-center gap-4 pr-6 border-r border-[var(--theme-muted)]/30">
                <button className="text-[var(--theme-accent)] flex items-center gap-2">@ time</button>
            </div>
            <div className="flex items-center gap-5">
                {[15, 30, 60, 120].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`transition-colors ${time === t ? "text-[var(--theme-accent)]" : "hover:text-[var(--theme-text)]"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
    );
}
