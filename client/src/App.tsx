import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Keyboard, type KeyboardThemeName, type KeyboardInteractionEvent } from "@/components/ui/keyboard";
import { Footer } from "@/components/layout/Footer";
import { SettingsBar } from "@/components/layout/SettingsBar";
import { TypingArea } from "@/components/layout/TypingArea";
import { StatsScreen } from "@/components/layout/StatsScreen";
import { useTypingTest } from "@/hooks/useTypingTest";

const THEMES: KeyboardThemeName[] = ["classic", "mint", "royal", "dolch", "sand", "scarlet"];

const SITE_THEMES: Record<KeyboardThemeName, {
  background: string;
  text: string;
  muted: string;
  accent: string;
  secondaryBg: string;
  error: string;
}> = {
  classic: {
    background: "#323437",
    text: "#d1d0c5",
    muted: "#646669",
    accent: "#e2b714",
    secondaryBg: "#2c2e31",
    error: "#ca4754",
  },
  mint: {
    background: "#0f1719",
    text: "#d5e8e6",
    muted: "#4e7c78",
    accent: "#86c8ac",
    secondaryBg: "#162022",
    error: "#ca4754",
  },
  royal: {
    background: "#232530",
    text: "#e1e2e6",
    muted: "#6a7ea3",
    accent: "#e4d440",
    secondaryBg: "#2a2c38",
    error: "#ca4754",
  },
  dolch: {
    background: "#202020",
    text: "#ebebeb",
    muted: "#585858",
    accent: "#d73e42",
    secondaryBg: "#2a2a2a",
    error: "#ca4754",
  },
  sand: {
    background: "#2e2a24",
    text: "#fdf6e3",
    muted: "#8c7f70",
    accent: "#e0ab76",
    secondaryBg: "#36322b",
    error: "#ca4754",
  },
  scarlet: {
    background: "#2b1d1d",
    text: "#ebdcdb",
    muted: "#916b6b",
    accent: "#d5868a",
    secondaryBg: "#362424",
    error: "#ca4754",
  },
};

function App() {
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [themeIndex, setThemeIndex] = useState<number>(0);

  const activeTheme = THEMES[themeIndex];

  // Apply site theme colors
  useEffect(() => {
    const theme = SITE_THEMES[activeTheme];
    const root = document.documentElement;
    root.style.setProperty("--theme-bg", theme.background);
    root.style.setProperty("--theme-text", theme.text);
    root.style.setProperty("--theme-muted", theme.muted);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-secondary-bg", theme.secondaryBg);
    root.style.setProperty("--theme-error", theme.error);
  }, [activeTheme]);

  const handleNextTheme = () => {

    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  const {
    words,
    typedWords,
    currentWordIndex,
    currentInput,
    status,
    timeLeft,
    handleKeyDown,
    reset,
    stats,
  } = useTypingTest(timeLimit);

  // Capture physical keyboard typing

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Capture Tab and Enter explicitly for quick restart
      if (e.key === "Tab") {
        e.preventDefault();
        const resetBtn = document.getElementById("reset-test-button");
        if (resetBtn) resetBtn.focus();
        return;
      }

      if (e.key === "Enter" && document.activeElement?.id === "reset-test-button") {
        // Let the exact button's onClick or standard keypress handle it, but prevent default text entry
      } else if (e.key === "Enter" && status === "finished") {
        reset();
        return;
      }

      // Don't capture keys if an input is explicitly focused
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      handleKeyDown(e.key, e.ctrlKey);
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleKeyDown]);

  const onKeyEvent = (event: KeyboardInteractionEvent) => {
    if (event.phase === "down" && event.source === "pointer") {
      // Allow on-screen keyboard clicks to type
      let char = event.code;
      if (char.startsWith("Key")) char = char.replace("Key", "").toLowerCase();
      if (char === "Space") char = " ";
      if (char === "Backspace") char = "Backspace";

      if (char.length === 1 || char === "Backspace" || char === " ") {
        handleKeyDown(char);
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans selection:bg-[var(--theme-accent)] selection:text-[var(--theme-bg)] flex flex-col items-center transition-colors duration-300 relative">

      {/* Vertical Theme Toggle - Right Edge */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 bg-[var(--theme-secondary-bg)] p-3 rounded-full transition-colors duration-300 shadow-lg">
        {THEMES.map((theme, index) => (
          <button
            key={theme}
            onClick={(e) => {
              setThemeIndex(index);
              e.currentTarget.blur();
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTheme === theme
                ? "bg-[var(--theme-accent)] scale-150"
                : "bg-[var(--theme-muted)] hover:bg-[var(--theme-text)] hover:scale-125"
              }`}
            style={{
              boxShadow: activeTheme === theme ? `0 0 10px var(--theme-accent)` : "none"
            }}
            title={`Theme: ${theme}`}
            aria-label={`Select ${theme} theme`}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl h-full flex flex-col px-8">

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col justify-center items-center pb-8 pt-10">

          {status !== "finished" ? (
            <>
              <div className="flex items-center h-10 mb-10 gap-4">
                {status === "idle" && (
                  <SettingsBar time={timeLimit} setTime={setTimeLimit} />
                )}

                {status === "playing" && (
                  <div className="flex items-center justify-center text-2xl font-bold text-[var(--theme-accent)] px-4">
                    {timeLeft}s
                  </div>
                )}

                {/* Reset Button moved to side of time tab top */}
                <button
                  id="reset-test-button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    reset();
                  }}
                  title="tab + enter to restart test"
                  className="flex items-center justify-center gap-2 p-2 rounded-md outline-none text-[var(--theme-muted)] hover:text-[var(--theme-text)] focus-visible:text-[var(--theme-text)] focus-visible:bg-[var(--theme-secondary-bg)] transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <TypingArea
                words={words}
                typedWords={typedWords}
                currentWordIndex={currentWordIndex}
                currentInput={currentInput}
              />

              {/* Keyboard container */}
              <div className="flex items-center gap-12">
                <div className="transform scale-90">
                  <Keyboard
                    enableHaptics={true}
                    enableSound={true}
                    theme={activeTheme}
                    onKeyEvent={onKeyEvent}
                  />
                </div>
              </div>

            </>
          ) : (
            <StatsScreen stats={stats} onRestart={reset} />
          )}

        </main>

        {/* Footer / Theme Toggle */}
        <Footer activeTheme={activeTheme} onNextTheme={handleNextTheme} />
      </div>

    </div>
  );
}

export default App;
