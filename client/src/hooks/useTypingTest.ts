import { useState, useEffect, useCallback } from "react";
import { generateWords } from "@/lib/words";

export type WordScore = {
    typed: string;
    expected: string;
    isCorrect: boolean;
};

export function useTypingTest(timeLimit: number) {
    const [words, setWords] = useState<string[]>([]);
    const [typedWords, setTypedWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState("");

    const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    const reset = useCallback(() => {
        setStatus("idle");
        setWords(generateWords(200));
        setTypedWords([]);
        setCurrentWordIndex(0);
        setCurrentInput("");
        setTimeLeft(timeLimit);
    }, [timeLimit]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        let interval: number;
        if (status === "playing" && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && status === "playing") {
            setStatus("finished");
        }
        return () => clearInterval(interval);
    }, [status, timeLeft]);

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

        const minutes = (timeLimit - timeLeft) / 60;
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

        return { wpm, accuracy };
    }, [typedWords, words, currentWordIndex, currentInput, timeLimit, timeLeft]);

    return {
        words,
        typedWords,
        currentWordIndex,
        currentInput,
        status,
        timeLeft,
        handleKeyDown,
        reset,
        stats: stats(),
    };
}
