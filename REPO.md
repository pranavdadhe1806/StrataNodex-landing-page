# StrataNodex Landing Page

This repository contains the stunning, production-grade landing page for **StrataNodex**, a CLI-first, cross-platform productivity and task management system.

## 🚀 Overview

StrataNodex is built for developers who think in layers. The platform features infinite node nesting, gamification, and real-time sync across CLI, Web App, and Mobile App. This landing page acts as the primary entry point to the ecosystem, featuring a premium dark-themed design with cyan/teal accents, smooth scrolling, and dynamic micro-animations.

## 🛠 Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript (Strict)
*   **Styling:** Tailwind CSS (with custom design tokens and CSS variables)
*   **Animations:** 
    *   [Framer Motion](https://www.framer.com/motion/) (Spring physics, layout transitions, word-stagger reveals)
    *   [GSAP](https://gsap.com/) & ScrollTrigger (Scroll-based section reveals, connector drawing)
    *   [SplitType](https://github.com/lukePeavey/SplitType) (Advanced text splitting for animations)
*   **Smooth Scrolling:** [Lenis](https://lenis.studiofreight.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Typography:** [Geist Font Family](https://vercel.com/font) (Geist Sans & Geist Mono)

## ✨ Key Features & Sections

*   **Immersive Hero:** Features an animated canvas dot-grid background, word-by-word stagger animations, and a simulated terminal prompt.
*   **Interactive Terminal Mockup (`TerminalMock`):** A custom built component that simulates a terminal interface with dynamic, looping typing effects and syntax highlighting.
*   **Glassmorphism Cards (`GlassCard`):** Custom UI primitive featuring subtle glows, frosted glass effects, and reactive hover states.
*   **Smooth Scroll Experience:** Powered by Lenis, ensuring silky smooth navigation across the page.
*   **Scroll-Reactive Animations:** GSAP ScrollTrigger powers staggered feature reveals and dynamic line drawing in the "How It Works" section.
*   **Integrated Auth Form:** The authentication section connects to a backend API (`POST /api/auth/login`) with error handling, loading states, and a simulated shake animation on failure. OAuth buttons for Google and GitHub are also prepared.
*   **100% Responsive:** Adapts flawlessly from large desktop monitors down to 375px mobile screens.

## 📂 Project Structure

```
.
├── app/
│   ├── layout.tsx        # Root layout, Lenis provider, Font setup
│   ├── page.tsx          # Main landing page assembling all sections
│   └── globals.css       # Global styles, variables, keyframes
├── components/
│   ├── layout/           # Navbar and Footer components
│   ├── sections/         # The 8 core sections of the landing page
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── CLISection.tsx
│   │   ├── WebAppSection.tsx
│   │   ├── MobileSection.tsx
│   │   └── AuthSection.tsx
│   ├── ui/               # Reusable primitive components
│   │   ├── AnimatedText.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GlowButton.tsx
│   │   ├── SectionLabel.tsx
│   │   └── TerminalMock.tsx
│   └── providers/        # Context providers (e.g., LenisProvider)
└── public/               # Static assets
```

## 💻 Getting Started

### Prerequisites

*   Node.js 18.x or later
*   npm (or yarn/pnpm)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/pranavdadhe1806/StrataNodex-landing-page.git
    cd StrataNodex-landing-page
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory based on the following:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_PUBLIC_APP_URL=http://localhost:5173
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```
