## Design System & UI/UX Requirements

The website must have a **premium, modern, highly polished visual identity inspired by the design principles of Vercel**, while maintaining a unique and professional brand identity suitable for a serious IT services agency.

The goal is **not to create a direct copy of Vercel**. Instead, adopt its strongest design principles:

* Minimal and intentional visual design
* Strong typography and clear information hierarchy
* Generous whitespace
* Precise alignment and spacing
* Subtle grid-based backgrounds
* High-quality dark and light themes
* Refined interactions and micro-animations
* Elegant borders, shadows, gradients, and lighting effects
* High-performance, conversion-focused layouts
* Consistent visual rhythm across all pages

### Visual Direction

The overall design should feel:

* Premium
* Technical
* Trustworthy
* Modern
* Clean
* Precise
* Innovative
* Enterprise-ready

The website must clearly communicate that the agency builds reliable, scalable, and high-quality digital products.

Avoid generic agency templates, excessive illustrations, overly colorful interfaces, large decorative blobs, exaggerated gradients, glassmorphism everywhere, or unnecessary visual effects.

Every visual element must have a clear purpose.

### Design References

Use Vercel as the primary inspiration for:

* Typography scale
* Navigation simplicity
* Hero composition
* Section spacing
* Grid backgrounds
* Monochrome visual foundation
* Product presentation
* Cards and bordered containers
* Interactive hover states
* Dark-mode execution
* Footer structure
* Technical and professional atmosphere

The final interface must still be original and adapted to an IT services agency rather than a SaaS deployment platform.

The design should present services, portfolios, capabilities, and calls to action more clearly than a typical agency website.

### Color System

Use a refined neutral color system as the visual foundation.

Recommended base palette:

* Black and near-black backgrounds
* White and off-white surfaces
* Neutral gray borders
* Muted gray secondary text
* High-contrast primary text
* One carefully selected brand accent color

The accent color must be used sparingly for:

* Primary calls to action
* Active navigation states
* Important icons
* Focus rings
* Selected controls
* Small gradient highlights
* Key data points

Do not use multiple competing accent colors.

Gradients should be subtle, controlled, and primarily used for:

* Hero lighting
* Background glow
* Borders
* Featured service cards
* Call-to-action sections

The interface must meet accessible contrast requirements in both light and dark modes.

### Theme Support

The platform must support:

* Light mode
* Dark mode
* System theme detection

Dark mode should be treated as a first-class design experience, not a simple inverted version of the light theme.

Theme colors must be implemented using semantic design tokens and CSS variables.

Components must not contain hardcoded theme-specific colors when semantic tokens can be used.

Suggested semantic tokens include:

* `background`
* `foreground`
* `surface`
* `surface-muted`
* `card`
* `card-foreground`
* `border`
* `input`
* `muted`
* `muted-foreground`
* `primary`
* `primary-foreground`
* `secondary`
* `secondary-foreground`
* `accent`
* `accent-foreground`
* `destructive`
* `ring`

### Typography

Typography must be one of the strongest visual elements of the website.

Use:

* `Vazirmatn` for Persian
* `Geist`, `Inter`, or a similarly modern sans-serif font for English

Fonts must be loaded using `next/font`.

Typography must automatically change based on the active locale.

Use a carefully defined typography scale for:

* Display headings
* Page titles
* Section headings
* Card headings
* Body text
* Secondary text
* Labels
* Captions
* Buttons
* Navigation items

Headings should be bold, compact, and visually impactful without being oversized.

Body text must remain highly readable, with appropriate line height and constrained content width.

Persian typography must be manually reviewed to ensure:

* Correct line height
* Comfortable paragraph width
* Proper punctuation spacing
* Natural letter rendering
* Balanced heading sizes
* Proper RTL alignment

Do not rely on English typography settings for Persian content.

### Layout System

Use a structured and consistent layout system.

The interface should use:

* A centered maximum-width container
* Responsive horizontal padding
* Consistent section spacing
* Grid-based page composition
* Strong alignment between sections
* Reusable content width constraints

Recommended content container behavior:

* Full-width backgrounds
* Centered inner content
* Maximum width between approximately `1200px` and `1440px`
* Responsive padding across mobile, tablet, laptop, and desktop sizes

Pages must not feel crowded.

Use generous whitespace to create hierarchy and improve perceived quality.

### Background Treatments

Use subtle technical background patterns inspired by Vercel, including:

* Fine grid lines
* Radial gradients
* Soft spotlight effects
* Faded border lines
* Dot patterns
* Subtle noise textures
* Layered section dividers

Background effects must be lightweight and should not reduce readability or performance.

Do not use large background videos in the MVP.

Decorative effects should preferably be implemented with CSS rather than heavy image assets.

### Header and Navigation

The public header must be:

* Minimal
* Sticky or intelligently fixed
* Responsive
* Accessible
* Visually lightweight
* Easy to navigate in both RTL and LTR modes

The desktop navigation should include:

* Logo
* Main navigation links
* Language switcher
* Theme switcher
* Primary call-to-action button
* Optional secondary action

The mobile navigation must use a polished drawer or sheet component.

The header may use a subtle backdrop blur and translucent background when scrolling, but the effect must remain restrained.

The active navigation state must be clearly visible.

Dropdowns and mega menus, when used, must support keyboard navigation and automatically align based on the current text direction.

### Hero Section

The homepage hero must immediately communicate:

* What the agency does
* Who it serves
* Why it is different
* What the visitor should do next

The hero should include:

* A concise eyebrow or announcement label
* A strong headline
* A clear supporting description
* One primary call to action
* One secondary call to action
* Trust indicators or service highlights
* A premium technical visual element

Suitable technical visuals include:

* Abstract product interface previews
* Dashboard mockups
* Architecture diagrams
* Code-inspired UI compositions
* Layered browser windows
* Animated grid systems
* Service capability cards

Avoid generic stock photography in the main hero.

The hero must remain visually effective in Persian and English, even when headline lengths differ.

### Section Design

Each homepage section must have a clear purpose and visual identity while remaining consistent with the overall design system.

Recommended homepage sections include:

1. Hero
2. Client or trust indicators
3. Core services
4. Why choose us
5. Selected portfolio projects
6. Delivery process
7. Technical capabilities
8. Key statistics
9. Testimonials or client results
10. Latest articles
11. Final call to action

Sections should use varied but controlled compositions such as:

* Split layouts
* Bento grids
* Feature cards
* Sticky content
* Step timelines
* Comparison blocks
* Full-width call-to-action areas
* Large typography sections

Do not place every section inside identical cards.

Create visual rhythm by alternating between open layouts, bordered sections, grids, and focused content areas.

### Cards and Containers

Cards must have a refined, technical appearance.

Use:

* Thin borders
* Subtle surface differences
* Moderate corner radius
* Minimal shadows
* Clean internal spacing
* Controlled hover effects

Avoid large shadows, excessive rounding, and overly soft mobile-app-style cards.

Featured cards may use:

* Gradient borders
* Background glow
* Slight elevation
* Animated highlights
* Larger visual hierarchy

Cards must remain readable and aligned in both RTL and LTR layouts.

### Service Presentation

Service pages must clearly explain:

* The service
* The business problem it solves
* The target customer
* Deliverables
* Work process
* Technologies
* Estimated engagement model
* Related portfolio projects
* Frequently asked questions
* Final conversion action

Service cards must not only show an icon and title. They should communicate meaningful value and expected outcomes.

Use custom technical icons or a consistent icon library such as Lucide.

### Portfolio Presentation

Portfolio items must feel like professional case studies rather than a basic image gallery.

Each portfolio detail page should support:

* Project overview
* Client or industry
* Challenge
* Solution
* Services delivered
* Technologies used
* Timeline
* Screenshots
* Results
* Metrics
* Testimonial
* Related projects
* Project request call to action

Portfolio cards should include meaningful metadata and interactive preview behavior.

Images must use consistent aspect ratios and optimized loading.

### Forms

Forms must feel simple, premium, and trustworthy.

Use:

* Clear labels
* Helpful descriptions
* Logical grouping
* Inline validation
* Accessible error messages
* Visible focus states
* Loading states
* Success states
* Autosave where useful
* Multi-step behavior only when it improves completion rate

The smart service request form should progressively reveal questions based on previous answers.

Avoid presenting a very long form on a single screen.

Form controls must adapt correctly to RTL and LTR modes, including:

* Labels
* Input alignment
* Icons
* Select dropdowns
* Radio groups
* Checkboxes
* Date inputs
* File uploads
* Validation messages

### Admin Interface

The admin interface should share the same design system but prioritize efficiency over marketing visuals.

The admin UI must include:

* Responsive sidebar
* Top navigation
* Breadcrumbs
* Search
* Filters
* Data tables
* Pagination
* Bulk actions
* Empty states
* Loading skeletons
* Confirmation dialogs
* Toast notifications
* Permission-aware navigation

The admin dashboard should feel clean, fast, and operational.

Avoid decorative gradients and marketing animations inside data-heavy admin pages.

Admin tables must support:

* RTL and LTR alignment
* Mobile overflow
* Sorting
* Filtering
* Pagination
* Clear status indicators
* Accessible action menus

### Motion and Interactions

Motion should improve clarity and perceived quality without distracting the user.

Use subtle animation for:

* Page entrance transitions
* Section reveals
* Hover states
* Button feedback
* Navigation menus
* Modal transitions
* Accordion expansion
* Card highlights
* Loading states
* Form success states

Animations should be short, smooth, and restrained.

Prefer CSS transitions and lightweight animation utilities.

Use Framer Motion only where it provides meaningful value.

Respect the user's `prefers-reduced-motion` setting.

Avoid excessive parallax, long entrance animations, or animations that block interaction.

### Buttons and Calls to Action

Buttons must have a clear hierarchy:

* Primary
* Secondary
* Outline
* Ghost
* Destructive
* Link

Primary buttons should be visually prominent but not oversized.

Buttons must include:

* Hover state
* Active state
* Focus-visible state
* Disabled state
* Loading state
* Optional leading or trailing icon

Call-to-action wording must be specific and outcome-oriented.

Avoid vague labels such as “Click Here” or “Submit”.

Examples of stronger actions:

* Start Your Project
* Request a Consultation
* View Our Work
* Get a Technical Estimate
* Discuss Your Idea

Persian equivalents must be natural and conversion-focused rather than literal translations.

### Responsive Design

The website must be fully responsive and optimized for:

* Small mobile devices
* Large mobile devices
* Tablets
* Laptops
* Desktop monitors
* Large displays

Layouts must be designed mobile-first.

Responsive behavior must not only shrink desktop sections. Components should reorganize intelligently across breakpoints.

Test at minimum around these viewport widths:

* `320px`
* `375px`
* `430px`
* `768px`
* `1024px`
* `1280px`
* `1440px`
* `1920px`

Prevent horizontal overflow in all locales.

Long Persian and English text must wrap correctly without breaking layouts.

### RTL and LTR Requirements

The entire interface must support bidirectional layouts from a single component system.

The application must automatically set:

* `lang`
* `dir`
* Locale-specific font
* Locale-specific metadata

Use logical CSS properties whenever possible, including:

* `margin-inline-start`
* `margin-inline-end`
* `padding-inline-start`
* `padding-inline-end`
* `inset-inline-start`
* `inset-inline-end`
* `border-inline-start`
* `border-inline-end`
* `text-align: start`
* `text-align: end`

In Tailwind, prefer direction-safe utilities and abstractions.

Avoid hardcoded assumptions such as:

* `left`
* `right`
* `ml-*`
* `mr-*`
* `pl-*`
* `pr-*`

unless the behavior is intentionally physical rather than directional.

Directional icons such as arrows, chevrons, navigation indicators, and step connectors must automatically flip in RTL mode.

Logos, media controls, charts, code snippets, email addresses, URLs, and technical identifiers should not be incorrectly mirrored.

Every major component must be tested in both Persian and English.

### Accessibility

The interface must meet modern accessibility standards.

Target WCAG 2.2 AA where practical.

Requirements include:

* Semantic HTML
* Keyboard navigation
* Visible focus indicators
* Correct heading hierarchy
* Accessible form labels
* Proper ARIA attributes
* Sufficient color contrast
* Screen-reader-friendly validation
* Accessible modals and drawers
* Skip-to-content link
* Reduced-motion support
* Touch targets with sufficient size

Do not remove focus outlines unless they are replaced with an accessible custom focus style.

### Performance Requirements

The premium visual design must not reduce performance.

Prioritize:

* React Server Components
* Minimal client-side JavaScript
* Optimized fonts
* Optimized images
* Lazy loading
* Code splitting
* CSS-based decorative effects
* Limited third-party scripts
* Avoiding unnecessary animation libraries

Target strong Lighthouse scores for:

* Performance
* Accessibility
* Best Practices
* SEO

Avoid large video backgrounds, unoptimized images, and excessive client-side rendering.

### Component Architecture

All interface patterns must be built as reusable components and design primitives.

Create reusable components for:

* Container
* Section
* Section header
* Page header
* Button
* Badge
* Card
* Feature card
* Service card
* Portfolio card
* Blog card
* Statistic
* Testimonial
* Call-to-action section
* Empty state
* Loading skeleton
* Form field
* Data table
* Dialog
* Drawer
* Language switcher
* Theme switcher

Do not duplicate section markup across multiple pages when a reusable abstraction is appropriate.

Avoid over-engineering tiny components that are only used once and contain no reusable logic.

### Design Tokens

Define a centralized design token system for:

* Colors
* Typography
* Spacing
* Radius
* Shadows
* Borders
* Container widths
* Breakpoints
* Motion duration
* Easing curves
* Z-index levels

The token system must be shared across public pages and the admin interface.

shadcn/ui components must be customized to follow the project design system rather than used with their default appearance.

### Visual Quality Standard

Before considering a page complete, verify:

* Alignment is precise
* Spacing is consistent
* Typography hierarchy is clear
* RTL and LTR both work correctly
* Dark and light themes are polished
* Interactive elements include all required states
* Loading, empty, error, and success states are implemented
* Mobile layouts are intentionally designed
* Accessibility requirements are respected
* The page does not look like a generic template
* The visual identity remains consistent across the platform

The final result should feel comparable in quality to modern products and websites from companies such as Vercel, Linear, Raycast, Stripe, and Resend, while remaining original and specifically designed for a premium IT services agency.
