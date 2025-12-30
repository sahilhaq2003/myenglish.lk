import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-full border border-border">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-full transition-all ${theme === "light"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Light Mode"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-full transition-all ${theme === "system"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                title="System Theme"
            >
                <Laptop size={16} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-full transition-all ${theme === "dark"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Dark Mode"
            >
                <Moon size={16} />
            </button>
        </div>
    );
}
