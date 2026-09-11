# Personal Daily Expense Tracker 💰

A mobile-first personal daily expense tracking web app designed to replace manual note-taking (e.g. phone Notes app). Log spending across three time slots (**Morning**, **Afternoon**, **Night**), record payment methods (**GPay**, **Cash**, **Other**) and what was eaten, and view instant auto-calculated totals by day, month, and year.

---

## 🌟 Key Features

1. **Passwordless OTP Authentication**:
   - Enter your Gmail / email address to receive a 6-digit numeric OTP.
   - OTP is hashed with SHA-256 and salted; never stored in plaintext.
   - Expires in 10 minutes.
   - Protected with rate limiting (max 5 requests per hour per email).
   - Instant dev-mode auto-fill chip for fast testing when SMTP credentials are not configured.

2. **Dashboard & Calendar**:
   - **Year Picker Dropdown**: Range from 2000 to 2100 (defaults to current year).
   - **12-Month Interactive Grid**: Visual cards for January through December showing monthly totals, log count, and spending progress bars. Tapping any month navigates to that month's day calendar.

3. **Month View & Calendar Grid**:
   - Day-by-day calendar grid showing day numbers, logged spend badges, and active dots.
   - Sequential Day List View toggle optimized for mobile phones.
   - Tap any date to open the Day Entry Form.

4. **Day Entry Form (Morning, Afternoon, Night)**:
   - **Morning** 🌅: Amount, Payment Method (`GPay` / `Cash` / `Other`), What was eaten.
   - **Afternoon** ☀️: Amount, Payment Method, What was eaten.
   - **Night** 🌙: Amount, Payment Method, What was eaten.
   - Quick preset chips (`+50`, `+100`, `+200`) for rapid entry.
   - **Live Auto-Calculated Daily Total**: Instantly updates as you type (`Morning + Afternoon + Night`).
   - Edit past entries or delete a day's entries with one click.

5. **Monthly Summary & Visual Analytics**:
   - Monthly grand total and daily average spend.
   - **Payment Method Breakdown**: Visual distribution comparing total via GPay vs total via Cash vs Other with percentage pills.
   - **Time Slot Breakdown**: Total spent on breakfast/morning vs lunch/afternoon vs dinner/night.
   - **Interactive Daily Spend Bar Chart**: Day 1 through 28/30/31 with hover tooltips; tap any bar to open that day's entry.

6. **Yearly Summary**:
   - Month-by-month bar chart and list with percentage contribution to the year.
   - Grand total and monthly average.

7. **Multi-User Safe Architecture**:
   - All expenses and analytics are strictly scoped to the logged-in user (`user_id`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons (mobile-first responsive, PWA viewport settings, glassmorphism design tokens)
- **Backend**: Node.js + Express + JWT in `httpOnly` cookie + rate-limiter
- **Database**: NeDB persistent file-based datastore (`/backend/data/*.db`) strictly following the required schema, types, and indexes with zero external daemon dependencies.
- **Email/OTP**: Nodemailer with SMTP support (e.g. Gmail) + fallback developer console logger and UI preview.

---

## 🚀 Running the Application

### 1. Backend Server
```bash
cd backend
npm install
npm start
```
> Running at: `http://localhost:5000`

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
> Running at: `http://localhost:5173` (proxies `/api` requests to backend at 5000)

---

## ⚙️ Environment Variables (`backend/.env`)

```env
PORT=5000
JWT_SECRET=super_secret_jwt_key_expense_tracker_change_in_prod
OTP_SECRET=secure_otp_salt_secret_key_change_in_prod
NODE_ENV=development

# Optional: Real SMTP email delivery (Gmail App Password)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-google-app-password
# SMTP_FROM=your-email@gmail.com
```
*Note: If SMTP credentials are not set, the OTP is automatically printed to the terminal and provided in the UI as an Auto-fill button for immediate developer testing.*
