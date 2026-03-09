import { IconPalette } from "@tabler/icons-react";
import type { KeyboardThemeName } from "@/components/ui/keyboard";

interface FooterProps {
    activeTheme: KeyboardThemeName;
    onNextTheme: () => void;
}

export function Footer({ activeTheme, onNextTheme }: FooterProps) {
    return (
        <footer className="w-full flex justify-center py-6 text-[var(--theme-muted)]">
            <button
                onClick={onNextTheme}
                className="flex items-center gap-2 text-sm hover:text-[var(--theme-text)] transition-colors group"
            >
                <IconPalette className="w-4 h-4 group-hover:text-[var(--theme-accent)] transition-colors" />
                <span>{activeTheme}</span>
            </button>
        </footer>
    );
}
