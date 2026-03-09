import { loremIpsum } from "lorem-ipsum";

export function generateWords(count: number = 100): string[] {
    const text = loremIpsum({
        count: count,
        units: "words",
        format: "plain",
        random: Math.random,
    });

    return text.toLowerCase().split(" ");
}
