# StudySmart — AI-Driven Smart Academic & Skill Management System

A student-focused prototype that tracks performance, timetable, assignments, attendance, and career recommendations with AI-style insights.

## Features

- **Subject Performance** — Add subjects and test-wise marks. The app automatically splits subjects into **weak** (&lt; 60%) and **strong** (≥ 60%).
- **Career & Skill Recommendations** — Based on your strong subjects, get suggested careers and tips on how to sharpen your skills (Mathematics, Physics, Chemistry, Computer Science, English, Economics, etc.).
- **Editable Timetable** — Weekly timetable (Mon–Sat). Set start/end time and click any cell to edit; data is saved in the browser.
- **Assignment Checker** — Add, **edit**, and track assignments (title, subject, due date, priority). Mark as done; edit any assignment via the Edit button.
- **Attendance Tracker** — Log present, absent, or holiday. **AI-style insight** warns you when attendance is low or when taking more holidays may shorten your attendance percentage.
- **AI Study Assistant** — Chat-style assistant (simulated) for study tips, subject-specific advice, timetable and attendance tips.

## Quick start

Open `index.html` in a browser, or run a local server:

```bash
npx serve .
```

## Data

All data is stored in the browser (localStorage). No backend or API keys are required for this prototype.

## File structure

```
├── index.html   # App structure and panels
├── styles.css   # Design tokens and layout
├── script.js    # Logic: performance, timetable, assignments, attendance, chat, career recommendations
├── assets/
└── README.md
```
