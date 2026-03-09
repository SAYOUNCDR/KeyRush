import { useState } from "react";
import { Keyboard, type KeyboardThemeName } from "@/components/ui/keyboard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SettingsBar } from "@/components/layout/SettingsBar";
import { TypingArea } from "@/components/layout/TypingArea";

const THEMES: KeyboardThemeName[] = ["classic", "mint", "royal", "dolch", "sand", "scarlet"];

function App() {
  const [time, setTime] = useState<number>(30);
  const [themeIndex, setThemeIndex] = useState<number>(0);

  const activeTheme = THEMES[themeIndex];

  const handleNextTheme = () => {
    setThemeIndex((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#323437] text-[#d1d0c5] font-sans selection:bg-[#e2b714] selection:text-[#323437] flex flex-col items-center">

      <div className="w-full max-w-5xl h-full flex flex-col px-8">
        {/* Top Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col justify-center items-center pb-8">

          <SettingsBar time={time} setTime={setTime} />

          <TypingArea />

          {/* Keyboard container */}
          <div className="transform scale-90">
            <Keyboard
              enableHaptics={true}
              enableSound={true}
              theme={activeTheme}
            />
          </div>

        </main>

        {/* Footer / Theme Toggle */}
        <Footer activeTheme={activeTheme} onNextTheme={handleNextTheme} />
      </div>

    </div>
  );
}

export default App;
