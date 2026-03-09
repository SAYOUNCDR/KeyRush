import { IconKeyboard, IconCrown, IconSettings, IconUser } from "@tabler/icons-react";

export function Header() {
    return (
        <header className="w-full flex justify-between items-center py-6">
            <div className="flex items-center gap-3 text-2xl font-bold text-[#e2b714]">
                <IconKeyboard className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-6 text-[#646669] transition-colors">
                <IconCrown className="w-5 h-5 hover:text-[#d1d0c5] cursor-pointer transition-colors" />
                <IconSettings className="w-5 h-5 hover:text-[#d1d0c5] cursor-pointer transition-colors" />
                <IconUser className="w-5 h-5 hover:text-[#d1d0c5] cursor-pointer transition-colors" />
            </div>
        </header>
    );
}
