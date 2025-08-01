# Taskline Web — 60-day plan

Day 1 = 2026-11-06.

## Phase 1 — Foundations (day 1–14)
- [ ] D1  `create-next-app` baseline, CI green
- [x] D2  Folder structure: app/(auth), app/boards, components/, lib/api
- [ ] D3  ESLint + Prettier strict config
- [ ] D4  Design tokens: CSS variables, base layout
- [ ] D5  API client layer for taskline-api (typed fetch wrapper)
- [ ] D6  Sign up / login pages wired to JWT endpoints
- [ ] D7  Auth context + token storage
- [ ] D8  Boards list page (fetch + render)
- [ ] D9  Board page layout: columns
- [ ] D10 Card components (basic render)
- [ ] D11 Loading / error states
- [ ] D12 README: screenshots placeholder, setup
- [ ] D13 Env config (NEXT_PUBLIC_API_URL)
- [ ] D14 Phase 1 retro

## Phase 2 — Depth (day 15–40)
- [ ] D15 dnd-kit setup: drag cards between columns
- [ ] D16 Optimistic updates for card moves
- [ ] D17 Column create/rename UI
- [ ] D18 Card create/edit modal
- [ ] D19 Card assignee + due date UI
- [ ] D20 Card comments UI
- [ ] D21 Action Cable client: JWT auth connection
- [ ] D22 Presence indicator (who is online)
- [ ] D23 Room list sidebar
- [ ] D24 Room chat UI (send/receive via channel)
- [ ] D25 WebRTC: getUserMedia + local preview
- [ ] D26 Signaling client (offer/answer/ICE over WS)
- [ ] D27 RTCPeerConnection: 1-to-1 voice call
- [ ] D28 Call controls (mute, hang up)
- [ ] D29 Connection state UI (connecting/connected/failed)
- [ ] D30 Activity feed view
- [ ] D31 Pagination for messages
- [ ] D32 Dark mode toggle
- [ ] D33 Responsive pass (mobile columns)
- [ ] D34 Component tests (Vitest + Testing Library)
- [ ] D35 E2E: login + board CRUD (Playwright)
- [ ] D36 E2E: card drag
- [ ] D37 Error boundaries
- [ ] D38 README: WebRTC flow diagram
- [ ] D39 Loading perf pass
- [ ] D40 Phase 2 retro

## Phase 3 — Polish (day 41–60)
- [ ] D41 Test coverage push
- [ ] D42 Dockerfile
- [ ] D43 Docker compose with taskline-api
- [ ] D44 CHANGELOG.md
- [ ] D45 Docs: component storybook (or doc page)
- [ ] D46 Accessibility audit (axe)
- [ ] D47 Demo GIF in README
- [ ] D48 Tag v0.1 release
- [ ] D49 Cross-link taskline-api
- [ ] D50–D60 Buffer / stretch: keyboard shortcuts, card filters, notifications
