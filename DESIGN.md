---
name: Nexus High-Fidelity IT
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a31'
  surface-container-highest: '#33343c'
  on-surface: '#e2e1eb'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#e2e1eb'
  inverse-on-surface: '#2f3037'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#b395ff'
  on-tertiary-container: '#4900ae'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#12131a'
  on-background: '#e2e1eb'
  surface-variant: '#33343c'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
This design system embodies the intersection of developer-centric utility and premium enterprise reliability. It targets high-growth tech companies and IT infrastructure teams who value speed, precision, and architectural elegance.

The visual language is a hybrid of **Minimalism** and **Glassmorphism**, characterized by a high-contrast dark aesthetic. It leverages deep obsidian surfaces, crisp 1px borders, and purposeful "light leaks" or glows to denote technical vitality. The emotional response is one of sophisticated power—a UI that feels like a high-performance terminal reimagined for a modern executive suite.

## Colors
The palette is rooted in a "True Dark" foundation to ensure maximum contrast and depth. 

- **Background:** Deep Charcoal (#0A0A0A) serves as the infinite canvas.
- **Accents:** 
    - **Cyan Tech:** Used for primary actions, system status, and active states.
    - **Emerald:** Used for success metrics, deployment status, and growth indicators.
    - **Premium Purple:** Reserved for "Nexus Elite" features, high-tier pricing, or unique AI capabilities.
- **Surface:** Secondary surfaces and cards use a slightly elevated tint or a glassmorphic blur to differentiate from the base background.

## Typography
The system uses **Geist** for its neutral, geometric precision, ensuring readability across marketing and functional interfaces. **JetBrains Mono** is introduced as a structural element—used for metadata, tags, and technical snippets to reinforce the "IT Platform" identity.

Large display headings should use tighter letter spacing and bold weights to mimic a sleek, high-tech editorial feel. Body text remains generous in line-height to maintain legibility against the dark background.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. 

- **Bento Grid:** Information is organized into modular "cells" with varying spans (e.g., a 2x2 card next to two 1x1 cards). 
- **Rhythm:** An 8px base grid governs all padding and margins. 
- **Adaptation:** On mobile, the 12-column grid collapses into a single column. Spacing between bento-style cards reduces from 24px to 16px to maximize screen real estate while maintaining the "cell" visual.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

- **Level 1 (Base):** #0A0A0A Background.
- **Level 2 (Cards):** Semi-transparent background (white at 0.03 opacity) with a `backdrop-filter: blur(12px)`.
- **Borders:** Every interactive container must have a 1px solid border at 0.1 white opacity.
- **Glows:** Active or featured components utilize a `box-shadow` with a massive blur (40px-80px) and very low opacity (0.15) using the accent colors (Cyan or Purple) to create a "bloom" effect behind the element.

## Shapes
The shape language is "Calculated Softness." Elements use a 8px (0.5rem) radius as the standard. This provides a modern, approachable feel that is still disciplined and structured. High-level containers (Bento Cards) may use `rounded-xl` (1.5rem) to emphasize their role as distinct content modules.

## Components

### Buttons
- **Primary:** Solid background (Cyan), dark text, with a subtle outer glow of the same color on hover.
- **Ghost:** No background, 1px border at 0.1 opacity. On hover, the border opacity increases to 0.4 and the text brightens.
- **Icon Buttons:** Always square with `JetBrains Mono` character icons or minimalist line-art icons.

### Bento Cards
- Featured cards use a linear-gradient border (top-left to bottom-right) that transitions from white (0.2) to transparent.
- Internal padding is strictly `md` (1.5rem).

### Inputs & Search
- Background-less inputs with a 1px bottom border. 
- Focus state: The bottom border transitions to Cyan with a small glowing dot at the start of the line.

### Floating Widgets
- The support widget is a pill-shaped button (`rounded-3`) that floats in the bottom right. 
- It uses a heavy backdrop blur and a unique "Premium Purple" glow to differentiate it from the standard UI actions.

### Chips & Tags
- Always rendered in `JetBrains Mono`.
- Backgrounds are low-opacity versions of the accent colors (e.g., Cyan at 0.1 opacity) with high-contrast text.