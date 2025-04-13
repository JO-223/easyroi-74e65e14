
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
				'ruby-reflection': {
					'0%': {
						backgroundPosition: '-100% 0',
					},
					'100%': {
						backgroundPosition: '200% 0',
					},
				},
				'emerald-glow': {
					'0%': {
						boxShadow: '0 0 3px rgba(80, 200, 120, 0.2)',
						opacity: '0.9',
					},
					'50%': {
						boxShadow: '0 0 10px rgba(80, 200, 120, 0.6)',
						opacity: '1',
					},
					'100%': {
						boxShadow: '0 0 3px rgba(80, 200, 120, 0.2)',
						opacity: '0.9',
					},
				},
				'platinum-wave': {
					'0%': {
						backgroundPosition: '-100% -100%',
					},
					'100%': {
						backgroundPosition: '200% 200%',
					},
				},
				'diamond-sparkle': {
					'0%': {
						boxShadow: '0 0 5px rgba(185, 242, 255, 0.3)',
						background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 25%)',
						backgroundSize: '250% 250%',
						backgroundPosition: '0% 0%',
					},
					'25%': {
						boxShadow: '0 0 10px rgba(185, 242, 255, 0.5)',
					},
					'50%': {
						boxShadow: '0 0 15px rgba(185, 242, 255, 0.7)',
						background: 'radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.4) 0%, transparent 25%)',
						backgroundSize: '250% 250%',
						backgroundPosition: '100% 100%',
					},
					'75%': {
						boxShadow: '0 0 10px rgba(185, 242, 255, 0.5)',
					},
					'100%': {
						boxShadow: '0 0 5px rgba(185, 242, 255, 0.3)',
						background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 25%)',
						backgroundSize: '250% 250%',
						backgroundPosition: '0% 0%',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				shimmer: 'shimmer 1.5s infinite',
				'silver-shimmer': 'silver-shimmer 3s linear infinite',
				'gold-shimmer': 'gold-shimmer 2s ease infinite',
				'ruby-reflection': 'ruby-reflection 3s ease-in-out infinite',
				'emerald-glow': 'emerald-glow 4s ease-in-out infinite',
				'platinum-wave': 'platinum-wave 5s ease-in-out infinite',
				'diamond-sparkle': 'diamond-sparkle 6s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-luxury': 'linear-gradient(135deg, #271B4D 0%, #5A42A0 100%)',
				'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F8E7AC 100%)',
				'gradient-card': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03))',
				'hero-pattern': 'url("/dubai-skyline.png")',
				'ruby-shine': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
				'platinum-diagonal': 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
