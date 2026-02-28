<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# Studoo 🎯

## Basic Details

### Team Name: HN

### Team Members
- Member 1: - Helen Martin Jose - MEC
- Member 2: Nazrin M N - MEC

### Hosted Project Link
[mention your project hosted link here]

### Project Description
Studoo is an all-in-one smart study app that boosts focus and productivity. It combines a Pomodoro timer, task tracker, AI-powered study assistant, and collaborative sessions, all in one platform. Students can organize tasks, get quick explanations, and study together efficiently.

### The Problem statement
Students today juggle multiple disconnected tools while studying — a timer app here, a to-do list there, a music app, a chat window for doubts. This constant context-switching breaks focus, reduces accountability, and makes collaborative study sessions nearly impossible to coordinate. There is no single environment built around how students actually study.


### The Solution
FocusFlow is an all-in-one smart study platform that integrates a Pomodoro timer, task manager, AI-powered doubt assistant, focus music player, and real-time collaborative study rooms into a single distraction-free environment — helping students study smarter, stay accountable, and learn together.


## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used:  JavaScript, Python, Java
- Frameworks used:  html,css 
- Libraries used: Spotify embed widget / HTML5 audio – for the focus‑music player (external music integration).,canvas confetti
- Tools used: VS Code, Git


## Features

List the key features of your project:
- Feature 1: Pomodoro Timer
- Helps users focus by breaking study time into intervals (focus, short, long, deep) with automatic tracking of completed sessions. Encourages consistent study habits and productivity.
- Feature 2: Micro 5-minute start
- A quick-start option for days when motivation is low—enables a 5-minute study burst to kickstart focus without committing to a full session.
- Feature 3: Task Management
- Users can add, edit, and organize tasks with subjects, difficulty levels, and deadlines. Keeps study plans structured and actionable.
- Feature 4: Study Room 
Allows multiple users to join a virtual room via a code, view members, and collaborate or study together in real-time, enhancing accountability and peer motivation.
---

## Implementation

### For Software:

#### Installation
```bash
node -v
npm -v
git clone https://github.com/your-username/studoo.git
cd studoo
or
npm install
```

#### Run
```bash
node server.js
http://localhost:3000


## Project Documentation

### For Software:

#### Screenshots (Add at least 3)
<img width="773" height="478" alt="image" src="https://github.com/user-attachments/assets/f833af3a-b8b8-415b-809c-7fd65dd714c1" /> : this shows the login page
<img width="1901" height="985" alt="image" src="https://github.com/user-attachments/assets/9cf7c573-45dd-48ec-8a18-4f9fe99d6c59" />: this  shows “Studoo” with a dark pink gradient theme. On the left, there is a large circular Pomodoro timer set to 25:00, with mode buttons (Focus 25, Short 5, Long 15, Deep 50) at the top and Start/Pause/Reset buttons below. Under the timer, there’s a Tasks section, a “Today’s Plan” area with a “Plan my day” button, and a “Current block” section for the active study task. On the right side, there’s a tall card containing a “Focus music” dropdown and an embedded Spotify playlist at the top, and below that a “Shared Study Notes” area with fields for name, a notes textbox, and a “Share Note” button.
<img width="1917" height="989" alt="image" src="https://github.com/user-attachments/assets/a252216e-739d-4442-a219-63475b82d658" />: this shows shows the middle and lower part of  Studoo app. On the left, there is a stacked set of cards: a “Tasks” section with a single‑line input and “Add” button, followed by “Today’s Plan” with an input for available minutes and a “Plan my day” button. Below that, the “Current block” area shows that no block is selected and has a “Start next block” button. Further down is a “Progress” card that displays XP, day streak, and blocks today, plus an empty “Recent focus blocks” area. At the bottom, the “AI Study Helper” section begins. On the right side of the screen, a tall “Shared Study Notes” card remains fixed, with fields for name and notes and a “Share Note” button, leaving some unused vertical space beneath it.
<img width="1850" height="959" alt="image" src="https://github.com/user-attachments/assets/ae941e35-5395-4b91-bd51-c2b7ccfd2e60" />
This shows This screenshot shows the lower part of Studoo interface. At the top is the “Progress” card with XP, day streak, and blocks today, followed by an empty “Recent focus blocks” bar. Below that, a large “AI Study Helper” card contains a dark chat window with an initial greeting message and an input field plus pink “Ask” button for questions. At the very bottom is the “Study room” section, where users can enter a room code, press “Create” or “Join,” toggle “Sync timer with room,” choose what they’re focusing on from a dropdown, and later see room information.





---


#### Build Photos

![Team](Add photo of your team here)

![WhatsApp Image 2026-02-28 at 8 27 23 AM](https://github.com/user-attachments/assets/a093cc88-ec95-4922-a355-88edaa9a387c)

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** https://tinkfinalfinalfinale.vercel.app/

##### Endpoints

**GET /api/endpoint**

Description

Checks whether the Studoo backend server is running.

Parameters

None

Response
{
  "status": "success",
  "message": "Studoo backend running"
}
{
  "status": "success",
  "data": {}
}
```

{
  "status": "success",
  "message": "Operation completed"
}

AI Chat Endpoint

POST /api/ai

Description

Sends a user question to Gemini AI and returns the AI response.

Request Body

https://drive.google.com/drive/folders/1IrlMpHPpfILecoQfQDQ0x2lluhGJwMzj?usp=sharing



