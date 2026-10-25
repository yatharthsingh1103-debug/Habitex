# Habitex — Discover Where You Belong
## Commercial Property Enquiry & Listing Web Application

A commercial-grade, multi-page **Property Enquiry & Property Listing Web Platform** built strictly using **HTML5, CSS3, and Vanilla JavaScript (ES6+)**.
Brand: **Habitex** | Tagline: *"discover where you belong"*

Developed with an architectural editorial visual language using a bespoke 5-color palette:
- `#F8FAF8` — **Off White**: Page canvas foundation & clean surfaces
- `#163A36` — **Deep Teal**: Primary brand identity, major CTAs & structural elements
- `#5F8178` — **Sage**: Secondary complements, filter badges & subtle borders
- `#D19A5A` — **Sand Gold**: Accent highlights, pricing indicators & verified badges
- `#222624` — **Charcoal**: Typography foundation & dark footer surfaces
Completely devoid of generic purple gradients, glassmorphism blobs, or template dashboards.

---

## 1. Absolute Technology Compliance

* **HTML5**: Semantic document structure, ARIA accessibility attributes, form input types.
* **CSS3**: Custom CSS design tokens, modular stylesheets, responsive flexbox & CSS grid, hardware-accelerated transitions.
* **Vanilla JavaScript (ES6+)**: Clean, modular, event-driven JavaScript without frameworks.
* **STRICTLY ZERO DEPENDENCIES**:
  - ❌ No React / ReactDOM / Next.js
  - ❌ No Vue / Angular
  - ❌ No Tailwind CSS / Bootstrap / Material UI
  - ❌ No jQuery / TypeScript
  - ❌ No npm packages / build tools / external form libraries

Runs out-of-the-box in any modern desktop or mobile browser.

---

## 2. File & Directory Architecture

Every major page is a separate HTML file. Reusable components (Navbar and Footer) are isolated into independent component files.

```
/
├── index.html                  # Entry gateway & instant redirect to home.html
├── home.html                   # Commercial real-estate marketplace landing page
├── properties.html             # Full catalog with live filters, sorting, view toggles
├── property-details.html       # Editorial details page with photo mosaic, specs, agent card
├── enquiry.html                # Dedicated enquiry & site visit scheduling workflow
├── add-property.html           # 40+ field multi-section listing form with conditional logic
├── my-listings.html            # User's active listings management table
├── saved-properties.html       # Bookmarked/favorited properties collection
├── dashboard.html              # Commercial-grade user dashboard with metrics
├── performance.html            # Academic benchmarking suite measuring input latency
├── profile.html                # User profile settings & account category
├── login.html                  # Split-screen architectural login with password toggle
├── logout.html                 # Dedicated session termination page with auto-redirect
├── register.html               # Registration page with role selection (Buyer/Seller/Agent)
├── 404.html                    # Branded 404 error page
│
├── components/
│   ├── navbar.html             # Reusable global header with mobile navigation drawer
│   ├── footer.html             # Reusable multi-column commercial footer
│   └── property-card.html      # Reusable property card template
│
├── css/
│   ├── global.css              # Design tokens, variables, typography, buttons, toasts
│   ├── navbar.css              # Sticky navbar, profile dropdown, mobile drawer
│   ├── footer.css              # Multi-column editorial footer
│   ├── home.css                # Hero search tabs, categories, featured grid, trust stats
│   ├── properties.css          # Filter sidebar, view toggles, range sliders, chips
│   ├── property-details.css    # Hero mosaic gallery, quick-specs bar, sticky agent card
│   ├── forms.css               # Stepper progress, 8-section layout, inputs, custom pills
│   ├── dashboard.css           # Metric overview cards, listings table, enquiries panel
│   ├── auth.css                # Split-screen architectural hero & credentials form
│   ├── performance.css         # Latency meters, live charts, keystroke benchmark sandbox
│   └── responsive.css          # Breakpoints (Desktop >1200px, 1024px, 768px, <480px)
│
├── js/
│   ├── main.js                 # App init, component loader, toast notification system
│   ├── data.js                 # Realistic Indian real-estate dataset & local storage manager
│   ├── navbar.js               # Navbar mobile drawer, active links, auth session sync
│   ├── footer.js               # Footer dynamic subscription & copyright handling
│   ├── auth.js                 # Frontend authentication simulation in localStorage
│   ├── properties.js           # Multi-criteria filtering & sorting engine
│   ├── property-details.js     # Detail view population from URL query `id`, gallery modal
│   ├── enquiry.js              # Standalone enquiry submission & visit date/time scheduling
│   ├── listing-form.js         # 8-section form wizard, conditional visibility, publishing
│   ├── validation.js           # Standalone validation engine with accessible ARIA error states
│   ├── draft-storage.js        # Form autosave to localStorage with live elapsed timer
│   ├── image-upload.js         # Multi-image drag & drop, client-side dimension/size validation
│   ├── dashboard.js            # Dashboard metric counters, listing management, enquiry review
│   └── performance.js          # Latency tests (Raw DOM vs Debounced vs Batched) via performance.now()
│
└── assets/
    ├── images/                 # Local architectural imagery fallbacks
    └── icons/                  # Clean SVG assets (logo.svg)
```

---

## 3. Key Technical Highlights

### A. 40+ Field Multi-Section Listing Form (`add-property.html`)
Organized into 8 progressive stages with an interactive stepper:
1. **Basic Information**: Title, Listing Type (Sale vs Rent), Property Type (Apartment, Villa, Plot, Commercial, Penthouse), Purpose, Construction Status, Detailed Description.
2. **Location**: Flat/Unit No., Building/Society Name, Locality/Street, City, State, Pincode (6-digit validation), Landmark, Country.
3. **Structural Details**: Bedrooms (BHK pills), Bathrooms, Balconies, Floor No., Total Floors, Carpet Area, Super Built-Up Area, Property Age, Facing Direction.
4. **Valuation & Financials**: Price / Monthly Rent (with ₹ prefix), Price Negotiable, Maintenance charges & frequency, Security deposit (Rent only), Token booking amount.
5. **Curated Amenities**: 12+ selectable amenity cards with icons (Lift, Covered Parking, Security, Power Backup, Gym, Pool, Clubhouse, CCTV, Central AC, Piped Gas, Internet, Private Garden).
6. **Furnishing & Inventory**: Furnishing Status with quantity steppers for Modular Kitchen, Beds, Wardrobes, Air Conditioners, Geysers, Televisions, Sofa Sets, Dining Table.
7. **Owner / Representative Contact**: Representative Name, Phone (10 digits), Email, Preferred Contact Method (Call, WhatsApp, Email), Visiting Hours.
8. **High-Resolution Photography**: Multi-image drag & drop with dimension validation.

### B. Dynamic Conditional Field Logic
- **Property Type = Plot**: Automatically hides bedrooms, bathrooms, balconies, floors, and furnishing; displays Plot Dimensions, Facing Road Width, and Land Zoning Type.
- **Property Type = Villa / House**: Displays Total Floors, Private Garden, and Rooftop Terrace.
- **Listing Type = Rent**: Dynamically adjusts valuation fields to Monthly Rent, Security Deposit, and Lock-in Period.
- **Listing Type = Sale**: Adjusts to Expected Selling Price, Negotiability, and Possession Status.

### C. Live Draft Persistence & Autosave Engine (`js/draft-storage.js`)
- Automatically serializes and debounces form changes to `localStorage`.
- Live elapsed timestamp indicator: *"Draft saved 12 seconds ago"*.
- Detects existing drafts on page load with a "Restore Draft" option.
- Manual "Save Draft" and "Discard" actions with confirmation dialogs.

### D. Image Upload & Dimension Validation (`js/image-upload.js`)
- Client-side inspection using `new Image()` and `URL.createObjectURL`:
  - Enforces minimum dimensions of **800×500 px** for crisp property presentation.
  - Enforces maximum file size of **5MB**.
  - Restricts MIME types to `.jpg`, `.jpeg`, `.png`, and `.webp`.
- Live gallery previews with "Cover Photo" designation and remove buttons.

### E. Accessible Form Validation Engine (`js/validation.js`)
- Timing support: `onChange`, `onBlur`, and `onSubmit`.
- Accessible ARIA integration: sets `aria-invalid="true"` and programmatically associates error descriptions via `aria-describedby` pointing to the error container.
- Smooth scroll to the first invalid field upon form submission.

### F. Academic Performance Benchmarking Lab (`performance.html`)
Evaluates the performance cost of large forms using the browser's high-resolution `performance.now()` API:
- **Mode 1: Synchronous Raw DOM**: Direct layout writes and 40 dependent calculations on every keystroke.
- **Mode 2: Debounced Trailing**: Buffers heavy layout recalculations until the user pauses for 250ms.
- **Mode 3: requestAnimationFrame Batching**: Coordinates layout updates with the display refresh cycle.
- Displays Last Keystroke Latency, Mean Processing Time, Peak Latency Spike, and total DOM mutations in a live telemetry table.

### G. Resilient Component Loading (`js/main.js`)
- Dynamically loads `components/navbar.html` and `components/footer.html` into `<header id="navbar-mount">` and `<footer id="footer-mount">`.
- Includes built-in template fallbacks so the application runs seamlessly even when opened directly via `file:///` without a web server.

---

## 4. How to Run the Application

### Option 1: Direct File Open (Zero Setup)
Double-click `home.html` (or `index.html`) in your file explorer to open directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Option 2: Local HTTP Server (Recommended)
From the project root directory, run:
```bash
python -m http.server 8000
```
Then visit:
```
http://localhost:8000/home.html
```
