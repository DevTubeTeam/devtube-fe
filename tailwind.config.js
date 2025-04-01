/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', 'class'], // Cho phép dark mode (sử dụng class='dark')
  theme: {
  	container: {
  		center: true,
  		padding: '1rem',
  		screens: {
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		}
  	},
  	extend: {
  		colors: {
  			brand: {
  				DEFAULT: '#6366F1',
  				dark: '#4F46E5',
  				light: '#A5B4FC'
  			},
  			background: 'hsl(var(--background))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui'
  			],
  			mono: [
  				'Fira Code',
  				'monospace'
  			]
  		},
  		spacing: {
  			header: '64px',
  			'video-thumb': '300px'
  		},
  		borderRadius: {
  			xl: '1rem',
  			'2xl': '1.5rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			fadeInUp: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			pulseSlow: {
  				'0%, 100%': {
  					opacity: 1
  				},
  				'50%': {
  					opacity: 0.5
  				}
  			}
  		},
  		animation: {
  			fadeInUp: 'fadeInUp 0.4s ease-out',
  			pulseSlow: 'pulseSlow 2s ease-in-out infinite'
  		},
  		zIndex: {
  			dropdown: '1000',
  			modal: '1100',
  			overlay: '1200'
  		}
  	}
  },
  safelist: [
    'bg-brand',
    'text-brand',
    'dark',
    'dark:bg-background-dark',
    'dark:text-white',
  ],
  plugins: [
    require('@tailwindcss/typography'), // For markdown & content
    require('@tailwindcss/aspect-ratio'), // Responsive video containers
      require("tailwindcss-animate")
],
};
