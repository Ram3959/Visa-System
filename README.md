# 🌐 Global Visa Processing & Management System

A web-based **Visa Application, Requirement Guide, Application Tracker, and Embassy Approval System** built using HTML5, CSS3, and JavaScript (ES6).

---

## 🌟 Key Features

1. **Visa Requirements Explorer**:
   - Interactive search and details for destinations including Japan, USA, UK, France (Schengen), UAE, Canada, and Australia.
   - Entry requirements, government fee structure, processing times, and document checklists.

2. **Online Multi-Step Application Form**:
   - **Step 1**: Personal Details (Name, DOB, Passport Number, Contact Info).
   - **Step 2**: Destination & Travel Details (Country, Visa Category, Travel Dates).
   - **Step 3**: Document Checklist & Upload Verification.
   - **Step 4**: Application Summary & Payment Submission (Generates tracking ID `VISA-2026-XXXX`).

3. **Real-time Status Tracker**:
   - Track application by Reference Tracking ID.
   - Interactive status progress timeline (`Submitted` ➔ `Verification` ➔ `Embassy Review` ➔ `Approved`).
   - Official **E-Visa Permit Certificate Card** display for approved applications.
   - Single-page **E-Visa PDF Printing & Saving**.

4. **Embassy Officer & Admin Portal**:
   - Real-time statistics counters (Total, Pending, Approved, Rejected).
   - Application requests table with filtering options.
   - One-click approval/rejection decision toggles.
   - Local storage data persistence with instant sample data reset.

---

## 🚀 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/Ram3959/Visa-System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Visa-System
   ```
3. Open `index.html` directly in any web browser, or run a local server:
   ```bash
   python -m http.server 5174
   ```
4. Visit `http://localhost:5174` in your browser.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic web structure
- **CSS3**: Responsive flexbox & grid design system, custom badges, print media styles
- **JavaScript (ES6)**: State management, local storage persistence, DOM manipulation
