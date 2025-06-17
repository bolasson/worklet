# ⌚ Worklet Initial Design

## Project Purpose and Goals

The goal of this project is to help people (especially me) improve their ability to estimate how long tasks and projects will take. The app lets users:

- Log **projects** and **work sessions**.
- Record their time spent and reflect on what took more or less time than expected.
- Review personal analytics to spot estimation patterns and improve accuracy.

People are notoriously poor at time estimation, and I want this tool to serve as both a tracker and a learning resource.

---

## Conceptual Summary

Over time, this app should allow users to:
- Build a **history** of actual vs. estimated work.
- Analyze their **accuracy** in estimation.
- Gain **insights** about productivity patterns, session urgency vs. importance, and more.

I plan to build and host this project using:

- **Frontend & Backend**: Next.js (React) hosted on Vercel
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)

---

## ERD

![image](https://github.com/user-attachments/assets/d8ab1608-22ec-46f7-9ba3-e6d7e5b173f0)
**Entities:**

- **people** — one per authenticated user
- **projects** — each linked to a person
- **sessions** — individual work sessions linked to a project

---

## System Design

![image](https://github.com/user-attachments/assets/c47dc233-c5b5-44e0-9392-714551e91849)

- Users log in via Supabase Auth.
- Once authenticated, they can perform CRUD operations for:
  - **Projects**
  - **Sessions**
- All operations are served via a **Next.js frontend/backend**, deployed on **Vercel**.
- Supabase handles both **Auth** and **PostgreSQL** data storage.

---

## Development Timeline

| Date       | Goal                                                                 |
|------------|----------------------------------------------------------------------|
| **June 6** | Core schema in Supabase complete (people, projects, sessions)       |
| **June 9** | Create the project dashboard and associated backend calls        |
| **June 10** | Create the project details page, and session logic (frontend and backend)             |
| **June 11** | Polish the UI and form validation |
| **June 16**| Stretch goal: basic analytics on time estimation accuracy           |

---

## UX Plan

The current layout involves:
- **Dashboard**: shows projects as cards with progress bars, details, and estimated duration.
- **Project Detail Page**:
  - Left panel: project title, description, and progress. Potentially will also display project stats and recommendations. 
  - Right panel: sessions grouped by week, then by day with session reports.
- Use **shadcn/ui** for clean design.

---

## Future Plans

Over the summer, I plan to:
- Add **estimation accuracy analytics** (e.g., charts showing predicted vs. actual).
- Possibly allow multiple users to contribute to a single project.
