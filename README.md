# DoctorFlow — Doctor Appointment Booking & Clinic Management Demo

**DoctorFlow** is a modern, responsive, commercial-grade clinic management and appointment booking demo built for doctors, medical specialists, and outpatient clinics. 

Demonstrated with **Dr. Ahmed Khan** (Consultant Cardiologist & Physician, MBBS, FCPS Cardiology, Lahore, Pakistan).

---

## 🌟 Features Included

### 1. Public Doctor Website
- **Doctor Profile:** Dr. Ahmed Khan's qualifications, clinical specializations, verified PMDC registration (`#38492-P`), and 15+ years experience.
- **Clinic Location & Contact:** Al-Razi Healthcare Complex, Gulberg III, Lahore with direct Google Maps integration, phone lines, and one-tap WhatsApp booking button.
- **Service Catalog & Transparent Fees:** Detailed cardiovascular consultations and diagnostic tests (ECG, 2D Echo, Lipid screenings) with clear pricing in Pakistani Rupees (PKR).

### 2. Interactive Appointment Booking
- Real-time slot selection with **duplicate booking prevention** (slots already taken in the current browser are automatically disabled and grayed out).
- Form validation for patient name, phone number, age, gender, and consultation symptoms.
- **Booking Confirmation Screen:** Instant unique reference ID (e.g., `DF-8924`), consultation summary, and direct "View in Doctor Admin Dashboard" shortcut.
- Demo notice clarifying that records are preserved in local storage.

### 3. Doctor Admin Dashboard & Clinic Management
- **Key Metrics:** Total demo appointments, today's schedule, pending requests, completed consultations, and daily/monthly cash collections (PKR).
- **Appointment Queue:** Interactive list view and hourly calendar schedule view.
- **Search & Filters:** Search by patient name, phone, or reference ID; filter by status (Pending, Confirmed, Completed, Cancelled), date range, and service.
- **Quick Status Actions:** Confirm, Mark Completed, Reschedule (with slot availability check), Cancel, and Print Consultation Slip.
- **Walk-in Booking Modal:** Rapidly register in-person patients directly from the dashboard.

### 4. Patient Directory
- Sample patient records with visit histories, total lifetime spending, blood groups, emergency contacts, known allergies, and clinical background notes.

### 5. Financial Reports & Export
- Revenue totals (Total Billed, Cash Collected, Pending Receivables).
- Date filtering (All, Today, Past 7 Days, Past 30 Days, Custom Date Range).
- **Export to CSV:** In-browser RFC-compliant CSV generation with one click.
- **Printable Consultation Receipts:** Formatted clinic slips with doctor letterhead, itemized fees, payment tags, and printer-ready layouts (`window.print()`).

### 6. Clinic Settings
- Fully editable doctor profile, clinic name, address, contact numbers, consultation fees, and consulting hours.
- Service management: Add new services, edit fees, and remove services.
- **Persistent Data:** Automatically synced to `localStorage`.
- **Reset Demo Data:** One-click restore to original sample appointments and settings.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🌐 Deploy to Vercel

This application is 100% client-side and requires **zero external databases, zero paid APIs, and zero environment variables**.

### Quick Steps:
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial DoctorFlow demo commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New Project"** and select your GitHub repository.
   - Framework Preset: **Vite** (automatically detected).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**.

3. **Routing Configuration:**
   A `vercel.json` file is already included in the root directory to handle single-page application (SPA) routing:
   ```json
   {
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
