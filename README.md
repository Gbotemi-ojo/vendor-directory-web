Here is the cleaned and properly formatted `README.md`, with the broken Markdown, duplicated labels, and `[cite: 12]` artifacts removed.

# AI Security Vendor Directory - Frontend UI

**Live Demo:** [https://vendor-directory-web.vercel.app/](https://vendor-directory-web.vercel.app/)

A responsive, high-performance React Single Page Application (SPA) built to interface with the **AI Security Vendor Directory API**.

It features real-time debounced searching, inline editing, and live data refreshing.

---

## 1. How to Run the Application

### Prerequisites

* Node.js (v18 or higher) installed locally.
* The backend API running locally or deployed to Vercel.

### Setup Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Gbotemi-ojo/vendor-directory-web.git
cd vendor-directory-web
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory and point it to your backend API:

```env
VITE_API_URL=https://vendor-directory-api.vercel.app/api
```

#### 4. Run the Application

**Development mode:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
```

**Preview the production build:**

```bash
npm run preview
```

---

## 2. Tech Stack and Why

### Vite & React (TypeScript)

Chosen for fast Hot Module Replacement (HMR), efficient production builds, and TypeScript's strict type safety.

This combination provides a lightweight development experience while helping prevent common runtime state and event-handling bugs.

### Tailwind CSS v4

Selected for rapid utility-first styling without relying on a large external component library.

It provides full control over custom vendor cards, forms, responsive layouts, spacing, typography, and UI states.

### Lucide React

Provides a clean, modern, lightweight icon set for common UI actions such as:

* Search
* Edit
* Save
* Refresh
* Loading states

---

## 3. What Was Built vs. Left Out

### What Was Built

#### Modular Component Architecture

Refactored into a scalable structure with specific files for types (`vendor.ts`) and modular UI components (`Header.tsx`, `VendorCard.tsx`, `VendorForm.tsx`).

#### Interactive Vendor Dashboard

A clean card-based interface that renders vendor records retrieved from the backend API.

#### Debounced Search Interface

Real-time keyword searching across vendor names and descriptions.

A **300ms debounce** is used to prevent excessive API requests while the user is typing.

#### Inline Editing Modal/Form

Users can modify vendor attributes directly through the UI and persist those changes through the backend API.

Includes disabled states and animated loading spinners during submissions.

#### Live Refresh Trigger

Each vendor provides an interactive refresh action that calls the backend scraping/refresh endpoint.

The UI displays a loading state while the refresh operation is in progress.

### What Was Left Out

#### Pagination / Infinite Scroll

Pagination and infinite scrolling were omitted because the current dataset is small enough to render efficiently in a single scrollable view.

The backend search structure can be extended to support pagination if the dataset grows significantly.

#### Advanced Analytics / Charts

Advanced analytics and visualization were not implemented because the core requirements focus on vendor discovery, search, editing, and live data refreshing.

---

## 4. Key Decision, Alternative Considered, and Trade-off

### Decision

Search filtering is performed by the backend through query parameters, with frontend debouncing used to control request frequency.

```text
User Input
    ↓
300ms Debounce
    ↓
API Request
    ↓
Backend Search
    ↓
Filtered Vendor Results
    ↓
UI Update
```

### Alternative Considered

Fetch all vendors once when the application loads and perform filtering entirely on the client using:

```typescript
Array.prototype.filter()
```

### Why This Approach Was Chosen

Client-side filtering is simple and fast for small datasets. However, delegating search to the backend provides a more scalable architecture as the number of vendors increases.

The frontend does not need to download the entire vendor dataset simply to perform a search.

The trade-off is additional network dependency during searches, which is mitigated by the **300ms debounce** to avoid sending a request for every individual keystroke.

---

## 5. Verification Strategy

The application was verified through a multi-tiered approach.

### 1. Production Build Validation

The production build was validated using:

```bash
npm run build
```

This verifies TypeScript compilation and the Vite production build pipeline.

### 2. Manual End-to-End Checks

The application was manually tested against the running backend API to verify:

* Vendor data loading
* Search responsiveness
* Search debouncing
* Inline editing
* Form submission
* Live vendor refresh
* Loading states
* Frontend/backend integration

---

## 6. Known Limitation and Future Improvements

### Known Limitation

If the backend API becomes unavailable or experiences high latency, the UI currently falls back to generic error alerts rather than providing a dedicated offline or degraded-network experience.

### Future Improvement

Introduce a robust client-side data-fetching and caching layer such as **TanStack Query**.

This could provide:

* Automatic background refetching
* Request caching
* Query invalidation
* Retry handling
* Optimistic UI updates
* Improved loading and error states
* Better synchronization after vendor updates

---

## 7. AI Assistance & Code Validation

### Where AI Was Used

AI assistance was used to help:

* Scaffold the initial React component structure.
* Refactor monolithic components into a modular architecture (`Header`, `VendorCard`, `VendorForm`).
* Implement improved Tailwind CSS styling and loading states.
* Configure `vite.config.ts`.
* Align TypeScript event typing, including:

```typescript
React.FormEvent<HTMLFormElement>
```

* Improve implementation and documentation structure.

### How It Was Checked

AI-assisted code was reviewed and validated against the actual application.

The implementation was verified through:

#### Production Build

```bash
npm run build
```

This was used to ensure there were no TypeScript compilation or production build errors.

#### Manual Browser Validation

The application was also tested manually in the browser to verify the actual user experience.

---

## 📄 Repository

**Frontend repository:**

[https://github.com/Gbotemi-ojo/vendor-directory-web](https://github.com/Gbotemi-ojo/vendor-directory-web)

**Live Demo:**

[https://vendor-directory-web.vercel.app/](https://vendor-directory-web.vercel.app/)

