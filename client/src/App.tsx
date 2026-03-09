import { useState, useEffect } from "react";
import { Keyboard, type KeyboardThemeName, type KeyboardInteractionEvent } from "@/components/ui/keyboard";
import { Footer } from "@/components/layout/Footer";
import { SettingsBar } from "@/components/layout/SettingsBar";
import { TypingArea } from "@/components/layout/TypingArea";
import { StatsScreen } from "@/components/layout/StatsScreen";
import { useTypingTest } from "@/hooks/useTypingTest";

const THEMES: KeyboardThemeName[] = ["classic", "mint", "royal", "dolch", "sand", "scarlet"];

function App() {
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [themeIndex, setThemeIndex] = useState<number>(0);

  const activeTheme = THEMES[themeIndex];

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
      // Don't capture keys if an input is explicitly focused
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      handleKeyDown(e.key);
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
    <div className="h-screen w-screen overflow-hidden bg-[#323437] text-[#d1d0c5] font-sans selection:bg-[#e2b714] selection:text-[#323437] flex flex-col items-center">

      <div className="w-full max-w-5xl h-full flex flex-col px-8">

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col justify-center items-center pb-8 pt-10">

          {status !== "finished" ? (
            <>
              {status === "idle" && (
                <SettingsBar time={timeLimit} setTime={setTimeLimit} />
              )}

              {status === "playing" && (
                <div className="flex w-full justify-center mb-10 text-2xl font-bold text-[#e2b714]">
                  {timeLeft}s
                </div>
              )}

              <TypingArea
                words={words}
                typedWords={typedWords}
                currentWordIndex={currentWordIndex}
                currentInput={currentInput}
              />

              {/* Keyboard container */}
              <div className="transform scale-90">
                <Keyboard
                  enableHaptics={true}
                  enableSound={true}
                  theme={activeTheme}
                  onKeyEvent={onKeyEvent}
                />
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
