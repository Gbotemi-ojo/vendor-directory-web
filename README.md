# AI Security Vendor Directory — Frontend UI

A responsive React Single Page Application (SPA) built to interface with the AI Security Vendor Directory API. It provides vendor discovery, debounced searching, inline editing, server-side pagination, and asynchronous data refreshing through a clean, modular user interface.

## 1. How to Run the Application

### Prerequisites

- Node.js v18 or higher
- npm
- The backend API running locally or deployed to a hosting provider

### Setup Instructions

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Gbotemi-ojo/vendor-directory-web.git
cd vendor-directory-web
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the project root directory and configure the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Replace the URL with the actual API deployment address if it differs from the examples above.

#### Step 4: Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

#### Step 5: Build for Production

```bash
npm run build
```

#### Step 6: Preview the Production Build

```bash
npm run preview
```

## 2. Tech Stack and Rationale

### React and TypeScript

React provides a component-based architecture for building interactive user interfaces, while TypeScript introduces static type checking to help catch common errors during development.

### Vite

Vite provides a fast development server, Hot Module Replacement (HMR), and an optimized production build process.

### Tailwind CSS v4

Tailwind CSS provides utility-first styling for building responsive layouts and consistent UI components without requiring a large external component library. It supports custom vendor cards, forms, spacing, typography, and interactive states.

### Lucide React

Lucide React provides lightweight, consistent icons for common interface actions, including searching, editing, saving, refreshing, and indicating loading states.

## 3. What Was Built and What Was Left Out

### Implemented Features

#### Modular Component and Type Architecture

The application separates UI components and TypeScript interfaces into dedicated modules to improve maintainability and reusability.

The architecture includes centralized type definitions, such as `vendor.ts` and `components.ts`, alongside modular components such as `Header.tsx`, `VendorCard.tsx`, and `VendorForm.tsx`.

#### Vendor Dashboard with Server-Side Pagination

The dashboard displays vendor records retrieved from the backend API in a card-based layout.

Pagination is handled through the API, with Previous and Next controls and dynamic page tracking in the frontend.

#### Debounced Search

Users can search vendor names and descriptions using a keyword-based search interface.

A 300-millisecond debounce reduces unnecessary API requests while users type. Changing the search query resets pagination to the first page.

#### Inline Vendor Editing

Users can update vendor information through an editing form and submit changes to the backend.

The interface includes loading and disabled states during submission. Empty string values are normalized to `null` where appropriate to support backend validation requirements.

#### Asynchronous Vendor Refresh

Each vendor includes a refresh action that requests a background scraping job through the backend API.

The interface displays a loading state while the refresh operation is processed. After the configured wait period, it refetches vendor data while bypassing the browser's HTTP cache using `cache: 'no-store'`.

This approach helps the frontend retrieve updated information, although the wait period alone does not guarantee that the background job has completed.

### Features Not Implemented

#### WebSockets or Server-Sent Events (SSE)

Real-time push notifications for background job completion were not implemented. Instead, the frontend uses a delay before requesting updated vendor data.

This keeps the frontend integration simple but does not provide an authoritative indication of when a scraping job finishes.

#### Advanced Analytics and Charts

Advanced analytics, dashboards, and data visualizations were excluded because the core functionality focuses on vendor discovery, searching, editing, and refreshing records.

## 4. Key Architectural Decision and Trade-Off

### Decision: Backend-Driven Search and Pagination

Search filtering and pagination are handled by the backend API through query parameters, such as:

```text
?search=security&page=1&limit=24
```

The frontend uses debouncing to reduce the frequency of requests while users type.

### Alternative Considered

Fetch all vendor records when the application loads, then perform filtering and pagination entirely in the browser using JavaScript array methods such as `filter()` and `slice()`.

### Why This Approach Was Chosen

Client-side filtering and pagination are straightforward for small datasets. However, downloading every vendor record becomes less efficient as the dataset grows.

Backend-driven filtering and pagination offer several advantages:

- Only the records required for the current page need to be transferred.
- Database queries handle filtering and pagination.
- Browser memory usage is reduced for large datasets.
- The backend remains the central source of truth for vendor data.
- The frontend can support larger datasets without downloading the entire collection.

The main trade-off is the application's dependence on network requests during searches and page navigation. The 300-millisecond debounce helps reduce unnecessary requests, while appropriate database indexing can improve backend query performance.

## 5. Verification Strategy

The application was verified through production build validation and manual end-to-end testing.

### Production Build Validation

Run:

```bash
npm run build
```

This checks the TypeScript compilation and Vite production build process, provided the project's build script includes the relevant checks.

### Manual End-to-End Testing

The frontend was tested in a browser against the running backend API and its separate BullMQ worker process.

The verification process covered:

- Loading vendor data from the API
- Server-side pagination and page-state tracking
- Search responsiveness and debounce behavior
- Inline editing and form submission
- Asynchronous vendor refresh requests
- Cache-bypassing behavior during data refetching
- Loading states and error handling
- Frontend and backend integration

## 6. Known Limitations and Future Improvements

### Known Limitations

The frontend depends on the backend API being available and responsive.

If the API becomes unavailable, requests experience high latency, or a background scraping job takes longer than the configured wait period, the interface may display a generic error or refetch data before the latest changes are available.

The current refresh workflow does not provide reliable job-completion notifications or continuous polling until a job reaches a terminal state.

### Future Improvements

Introduce a dedicated client-side data-fetching and caching solution such as **TanStack Query (React Query)**.

Potential benefits include:

- Automatic background refetching and query invalidation
- Configurable retries for transient network failures
- Polling for background job status
- Optimistic UI updates during vendor editing
- Improved loading, error, and stale-data handling
- More efficient server-state management

Additional improvements could include more accessible form controls, clearer refresh-status messages, and dedicated UI feedback for failed background jobs.

## 7. AI Assistance and Code Validation

### Where AI Was Used

AI tools assisted with:

- Scaffolding the initial React component structure and pagination state logic
- Refactoring components into a modular architecture
- Centralizing TypeScript interfaces
- Implementing browser-cache bypassing for fetch requests
- Configuring `vite.config.ts`
- Improving TypeScript event typing and component organization

### Verification Process

AI-assisted changes were reviewed against the actual application implementation and validated through the following checks:

1. **Production Build:** Ran `npm run build` to check TypeScript compilation and production build output.
2. **Manual Browser Testing:** Tested the application alongside the backend API and background worker.
3. **Functional Verification:** Checked searching, pagination, editing, loading states, and asynchronous refresh behavior.
4. **Integration Validation:** Verified that frontend requests and responses aligned with the backend API.

AI-generated suggestions were treated as development assistance, with implementation decisions reviewed against the application's expected behavior.

## 8. Repository

- **Frontend Repository:** [https://github.com/Gbotemi-ojo/vendor-directory-web](https://github.com/Gbotemi-ojo/vendor-directory-web)
