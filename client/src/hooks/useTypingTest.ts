import { useState, useEffect, useCallback } from "react";
import { generateWords } from "@/lib/words";

export type WordScore = {
    typed: string;
    expected: string;
    isCorrect: boolean;
};

export type TestMode = "time" | "words";

export function useTypingTest(mode: TestMode, targetValue: number) {
    const [words, setWords] = useState<string[]>([]);
    const [typedWords, setTypedWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState("");

    const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
    const [timeLeft, setTimeLeft] = useState(mode === "time" ? targetValue : 0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const reset = useCallback(() => {
        setStatus("idle");
        // Always generate a healthy amount of words to fill the screen
        setWords(generateWords(Math.max(200, mode === "words" ? targetValue + 20 : 200)));
        setTypedWords([]);
        setCurrentWordIndex(0);
        setCurrentInput("");
        setTimeLeft(mode === "time" ? targetValue : 0);
        setTimeElapsed(0);
    }, [mode, targetValue]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        let interval: number;
        if (status === "playing") {
            interval = window.setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
                if (mode === "time") {
                    setTimeLeft((prev) => prev - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, mode]);

    useEffect(() => {
        if (status !== "playing") return;

        if (mode === "time" && timeLeft <= 0) {
            setStatus("finished");
        }
        // In word mode, finish when we've completed typing the target number of words
        if (mode === "words" && typedWords.length >= targetValue) {
            setStatus("finished");
        }
    }, [status, mode, timeLeft, typedWords.length, targetValue]);

    const handleKeyDown = useCallback(
        (key: string, ctrlKey: boolean = false) => {
            if (status === "finished") return;

            const isModifier = key.length > 1 && key !== "Backspace" && key !== "Space";
            if (isModifier) return;

            // Only start the test when a valid character is pressed
            if (status === "idle") {
                const isLetter = /^[a-zA-Z]$/.test(key);
                if (!isLetter) return; // ignore starting on space, enter, tab, numbers etc.
                setStatus("playing");
            }

            if (key === "Backspace") {
                if (ctrlKey) {
                    setCurrentInput("");
                } else {
                    if (currentInput.length === 0 && currentWordIndex > 0) {
                        // Move back to previous word
                        setCurrentWordIndex((prev) => prev - 1);
                        const previousWord = typedWords[typedWords.length - 1];
                        setCurrentInput(previousWord);
                        setTypedWords((prev) => prev.slice(0, -1));
                    } else {
                        setCurrentInput((prev) => prev.slice(0, -1));
                    }
                }
                return;
            }

            if (key === " ") {
                if (currentInput.length === 0) return; // Ignore leading spaces

                setTypedWords((prev) => [...prev, currentInput]);
                setCurrentWordIndex((prev) => prev + 1);
                setCurrentInput("");
                return;
            }

            // Max input length per word to prevent infinite typing
            if (currentInput.length >= 25) return;

            setCurrentInput((prev) => prev + key);
        },
        [status, currentInput]
    );

    const stats = useCallback(() => {
        let correctChars = 0;
        let totalChars = 0;

        // Count completed words
        typedWords.forEach((typed, i) => {
            const expected = words[i];
            if (!expected) return;

            const len = Math.max(typed.length, expected.length);
            for (let j = 0; j < len; j++) {
                totalChars++;
                if (typed[j] === expected[j]) correctChars++;
            }
            totalChars++; // space
            if (typed === expected) correctChars++; // correct space
        });

        // Count current word
        const currentExpected = words[currentWordIndex] || "";
        for (let i = 0; i < currentInput.length; i++) {
            totalChars++;
            if (currentInput[i] === currentExpected[i]) correctChars++;
        }

        let minutes = 0;
        if (mode === "time") {
            minutes = (targetValue - timeLeft) / 60;
        } else {
            // If test finished too fast, prevent division by zero by setting a tiny minimum
            const elapsed = timeElapsed || 1;
            minutes = elapsed / 60;
        }

        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

        return { wpm, accuracy };
    }, [typedWords, words, currentWordIndex, currentInput, mode, targetValue, timeLeft, timeElapsed]);

    return {
        words,
        typedWords,
        currentWordIndex,
        currentInput,
        status,
        timeLeft,
        timeElapsed,
        handleKeyDown,
        reset,
        stats: stats(),
    };
}
