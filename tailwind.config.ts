import type { Config } from 'tailwindcss'
import { heroui, ConfigTheme } from '@heroui/react'

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
        },
    },
    darkMode: 'class',
    plugins: [
        heroui({
            prefix: 'heroui',
            addCommonColors: false,
            defaultTheme: 'dark',
            defaultExtendTheme: 'dark',
            themes: {
                // TODO: creating a new theme fails for now... will look at it later
                dark: {
                    extend: 'dark',
                    colors: {
                        background: '#1e1e2e',
                        foreground: '#cdd6f4',
                        divider: '#b4befe',
                        overlay: '#6c7086',
                        content1: '#313244',
                        primary: {
                            DEFAULT: '#89b4fa',
                            foreground: '#1e1e2e',
                        },
                        secondary: {
                            DEFAULT: '#f38ba8',
                            foreground: '#1e1e2e',
                        },
                    },
                    layout: {},
                },
            },
        }),
    ],
} satisfies Config
