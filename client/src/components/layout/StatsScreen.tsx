import { IconRefresh } from "@tabler/icons-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import type { HistorySnapshot, CharacterStats, TestMode } from "@/hooks/useTypingTest";

interface StatsScreenProps {
    stats: {
        wpm: number;
        rawWpm: number;
        accuracy: number;
        characters: CharacterStats;
        totalTyped: number;
    };
    history: HistorySnapshot[];
    mode: TestMode;
    targetValue: number;
    timeElapsed: number;
    onRestart: () => void;
}

export function StatsScreen({ stats, history, mode, targetValue, timeElapsed, onRestart }: StatsScreenProps) {
    // Calculate consistency
    let consistency = 0;
    if (history.length > 0) {
        const mean = stats.wpm;
        const squareDiffs = history.map(h => Math.pow(h.wpm - mean, 2));
        const variance = squareDiffs.reduce((a, b) => a + b, 0) / history.length;
        const stdDev = Math.sqrt(variance);

        // Basic consistency formula
        consistency = Math.max(0, Math.round(100 - (stdDev / (mean || 1) * 100)));
    }

    const { correct, incorrect, extra, missed } = stats.characters;

    return (
        <div className="w-full max-w-5xl flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-500">

            <div className="w-full flex justify-between gap-10 mb-8 items-stretch h-[240px]">

                {/* Left side: Huge stats */}
                <div className="flex flex-col justify-between w-48 shrink-0">
                    <div className="flex flex-col items-start -space-y-2">
                        <span className="text-2xl text-[var(--theme-muted)] font-semibold tracking-widest">wpm</span>
                        <span className="text-7xl font-black text-[var(--theme-accent)]">{stats.wpm}</span>
                    </div>
                    <div className="flex flex-col items-start -space-y-2 pt-6">
                        <span className="text-2xl text-[var(--theme-muted)] font-semibold tracking-widest">acc</span>
                        <span className="text-7xl font-black text-[var(--theme-accent)]">{stats.accuracy}%</span>
                    </div>
                </div>

                {/* Right side: Chart */}
                <div className="flex-1 w-full min-w-0 h-full relative" style={{ cursor: "crosshair" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-secondary-bg)" vertical={false} />

                            <XAxis
                                dataKey="time"
                                stroke="var(--theme-muted)"
                                tick={{ fill: 'var(--theme-muted)', fontSize: 12 }}
                                tickMargin={10}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                stroke="var(--theme-muted)"
                                tick={{ fill: 'var(--theme-muted)', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 'auto']}
                                width={30}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--theme-secondary-bg)',
                                    borderColor: 'transparent',
                                    borderRadius: '8px',
                                    color: 'var(--theme-text)',
                                    fontWeight: 'bold'
                                }}
                                itemStyle={{ color: 'var(--theme-text)' }}
                                cursor={{ stroke: 'var(--theme-muted)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />

                            {/* Line for Raw WPM */}
                            <Line
                                type="monotone"
                                dataKey="rawWpm"
                                stroke="var(--theme-muted)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: 'var(--theme-muted)' }}
                                name="Raw WPM"
                            />

                            {/* Line for WPM */}
                            <Line
                                type="monotone"
                                dataKey="wpm"
                                stroke="var(--theme-accent)"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, fill: 'var(--theme-accent)' }}
                                name="WPM"
                            />

                            {/* Render error dots optionally if needed, standard recharts handles it ok via custom dots, but keeping it simple for now */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* Bottom row: Extraneous stats */}
            <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-6 mb-16 px-4">

                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-[var(--theme-muted)] tracking-wider">test type</span>
                    <span className="text-lg text-[var(--theme-accent)] font-semibold">
                        {mode} {targetValue}
                        <br /><span className="text-sm font-normal">english</span>
                    </span>
                </div>

                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-[var(--theme-muted)] tracking-wider">raw</span>
                    <span className="text-3xl font-medium text-[var(--theme-accent)]">{stats.rawWpm}</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-[var(--theme-muted)] tracking-wider">characters</span>
                    <span className="text-3xl font-medium text-[var(--theme-accent)] whitespace-nowrap">
                        {correct}<span className="text-[var(--theme-muted)] opacity-50">/</span>{incorrect}<span className="text-[var(--theme-muted)] opacity-50">/</span>{extra}<span className="text-[var(--theme-muted)] opacity-50">/</span>{missed}
                    </span>
                </div>

                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-[var(--theme-muted)] tracking-wider">consistency</span>
                    <span className="text-3xl font-medium text-[var(--theme-accent)]">{consistency}%</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                    <span className="text-sm text-[var(--theme-muted)] tracking-wider">time</span>
                    <span className="text-3xl font-medium text-[var(--theme-accent)] pt-4">{timeElapsed}s</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onRestart}
                    className="group flex flex-col items-center justify-center p-4 rounded-xl text-[var(--theme-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-secondary-bg)] transition-all outline-none"
                    title="Restart Test (tab + enter)"
                    id="reset-test-button"
                >
                    <IconRefresh className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </div>

        </div>
    );
}
