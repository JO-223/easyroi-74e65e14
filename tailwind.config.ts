
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				easyroi: {
					navy: "#27184F",
					gold: "#D4AF37",
					white: "#FFFFFF",
					lightgray: "#F8F9FA",
					success: "#4CAF50",
					danger: "#E57373",
					bronze: "#CD7F32",
					silver: "#C0C0C0",
					platinum: "#E5E4E2",
					diamond: "#B9F2FF",
					// Badge colors
					starter: {
						light: "#D3D3D3",
						dark: "#A9A9A9",
					},
					ruby: {
						light: "#9B111E",
						dark: "#C41E3A",
					},
					emerald: {
						light: "#50C878",
						dark: "#2E8B57",
					},
					// Refined purple brand colors
					purple: {
						50: "#F3F1F9",
						100: "#E7E2F4",
						200: "#D0C6E9",
						300: "#B8A9DE",
						400: "#9F8CD3",
						500: "#876FC8",
						600: "#6C52BD",
						700: "#5A42A0",
						800: "#473282",
						900: "#342265",
						950: "#271B4D"
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				shimmer: {
					'100%': {
						transform: 'translateX(100%)',
					},
				},
				'bronze-pulse': {
					'0%, 100%': {
						opacity: '1',
					},
					'50%': {
						opacity: '0.85',
					},
				},
				'silver-shimmer': {
					'0%': {
						backgroundPosition: '-200% 0',
					},
					'100%': {
						backgroundPosition: '200% 0',
					},
				},
				'gold-shimmer': {
					'0%': {
						backgroundPosition: '-100% 0',
						opacity: '0.95',
					},
					'50%': {
						opacity: '1',
					},
					'100%': {
						backgroundPosition: '100% 0',
						opacity: '0.95',
					},
				},
				'ruby-pulse': {
					'0%, 100%': {
						transform: 'scale(1)',
					},
					'50%': {
						transform: 'scale(1.03)',
					},
				},
				'emerald-glint': {
					'0%': {
						backgroundPosition: '0% 0%',
					},
					'100%': {
						backgroundPosition: '100% 100%',
					},
				},
				'platinum-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
					},
					'50%': {
						boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
					},
				},
				'diamond-sparkle': {
					'0%, 100%': {
						backgroundPosition: '0% 0%',
						boxShadow: '0 0 5px rgba(185, 242, 255, 0.5)',
					},
					'25%': {
						boxShadow: '0 0 10px rgba(185, 242, 255, 0.7)',
					},
					'50%': {
						backgroundPosition: '100% 100%',
						boxShadow: '0 0 15px rgba(185, 242, 255, 0.9)',
					},
					'75%': {
						boxShadow: '0 0 10px rgba(185, 242, 255, 0.7)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				shimmer: 'shimmer 1.5s infinite',
				'bronze-pulse': 'bronze-pulse 10s ease-in-out infinite',
				'silver-shimmer': 'silver-shimmer 3s linear infinite',
				'gold-shimmer': 'gold-shimmer 2s ease infinite',
				'ruby-pulse': 'ruby-pulse 3s ease infinite',
				'emerald-glint': 'emerald-glint 5s ease infinite',
				'platinum-glow': 'platinum-glow 4s ease-in-out infinite',
				'diamond-sparkle': 'diamond-sparkle 6s linear infinite',
			},
			backgroundImage: {
				'gradient-luxury': 'linear-gradient(135deg, #271B4D 0%, #5A42A0 100%)',
				'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F8E7AC 100%)',
				'gradient-card': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03))',
				'hero-pattern': 'url("/dubai-skyline.png")',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
