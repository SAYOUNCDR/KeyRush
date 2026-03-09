import { useEffect, useRef } from "react";

interface TypingAreaProps {
    words: string[];
    typedWords: string[];
    currentWordIndex: number;
    currentInput: string;
}

export function TypingArea({ words, typedWords, currentWordIndex, currentInput }: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeWordRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic to keep the active word in view
    useEffect(() => {
        if (activeWordRef.current && containerRef.current) {
            activeWordRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [currentWordIndex]);

    return (
        <div
            ref={containerRef}
            className="w-full max-w-4xl text-left relative h-[165px] mb-16 overflow-hidden select-none outline-none"
        >
            <div className="text-3xl leading-relaxed tracking-wide font-medium flex flex-wrap gap-x-3 gap-y-2">
                {words.map((word, wordIdx) => {
                    const isCurrentWord = wordIdx === currentWordIndex;
                    const isPastWord = wordIdx < currentWordIndex;

                    let typedWord = "";
                    if (isPastWord) {
                        typedWord = typedWords[wordIdx] || "";
                    } else if (isCurrentWord) {
                        typedWord = currentInput;
                    }

                    // Compute max length to handle "extra" typed characters
                    const lengthToRender = Math.max(word.length, typedWord.length);
                    const letters = [];

                    for (let i = 0; i < lengthToRender; i++) {
                        const expectedChar = word[i];
                        const typedChar = typedWord[i];

                        let colorClass = "text-[#646669]"; // default unfilled color

                        if (typedChar === expectedChar) {
                            colorClass = "text-[#d1d0c5]"; // correct highlight
                        } else if (typedChar !== undefined && expectedChar !== undefined) {
                            colorClass = "text-[#ca4754]"; // incorrect highlight
                        } else if (typedChar !== undefined && expectedChar === undefined) {
                            colorClass = "text-[#ca4754] opacity-50"; // extra character
                        }

                        const isCaretHere = isCurrentWord && i === typedWord.length;

                        letters.push(
                            <span key={i} className={`relative transition-colors duration-150 ${colorClass}`}>
                                {isCaretHere && (
                                    <span className="absolute -left-[2px] top-1 bottom-1 w-[3px] bg-[#e2b714] animate-pulse rounded-full" />
                                )}
                                {expectedChar || typedChar}
                            </span>
                        );
                    }

                    // Caret at the very end of the word if it's perfectly typed
                    const isCaretAtEnd = isCurrentWord && typedWord.length === word.length;
                    if (isCaretAtEnd) {
                        letters.push(
                            <span key="end-caret" className="relative">
                                <span className="absolute -left-[2px] top-1 bottom-1 w-[3px] bg-[#e2b714] animate-pulse rounded-full" />
                            </span>
                        );
                    }

                    // Apply error styling to past words that were finished incorrectly (e.g. skipped letters)
                    const isWordError = isPastWord && typedWord !== word;

                    return (
                        <div
                            key={wordIdx}
                            ref={isCurrentWord ? activeWordRef : null}
                            className={`relative ${isWordError ? 'border-b-2 border-[#ca4754]' : ''}`}
                        >
                            {letters}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
