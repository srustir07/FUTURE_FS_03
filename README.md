# FUTURE_FS_03: Auto Garage Website & Live Pitch

A responsive website for a local auto garage (bike and car service), built for **Future Interns, Full Stack Web Development, Task 3 (Local Business Website & Live Pitch Project)**.

**Live demo:** https://srustir07.github.io/FUTURE_FS_03/

## The problem
Most local garages quote prices over the phone, take bookings by calls, and customers keep calling to ask "is my vehicle ready?". This website solves that for the owner and the customer.

## Features
- **Instant price estimator**: pick vehicle and service, add pickup or wash, see the total
- **Online slot booking**: the form sends booking details straight to the garage's WhatsApp
- **Repair status tracker**: enter a job ID to see progress (received, inspection, in progress, ready, delivered)
- **Service history lookup**: search by vehicle number
- **Next service reminder**: calculates the due date from the last service
- **Rate card**: auto-generated table of prices for bikes, scooters and cars
- **Customer reviews slider**, **FAQ**, **Google Map**, working hours and an **Open now / Closed** badge
- **Dark mode**, floating WhatsApp button and a fully mobile-friendly layout

## Tech stack
- HTML5
- CSS3 (custom properties, grid, flexbox, responsive design)
- JavaScript (vanilla, no libraries)
- Hosted on GitHub Pages

## Project structure
```
FUTURE_FS_03/
├── index.html   # page structure
├── style.css    # styling, themes and responsive layout
├── script.js    # estimator, booking, tracker, reminder, reviews
└── README.md
```

## How to run locally
1. Clone the repo
   ```bash
   git clone https://github.com/srustir07/FUTURE_FS_03.git
   ```
2. Open the folder in VS Code
3. Open `index.html` in a browser (or use the Live Server extension)

## How to customise for another business
Edit the config block at the top of `script.js`:
- `WHATSAPP`: the business WhatsApp number
- `PRICES`: services and rates
- `JOBS` and `HISTORY`: sample data for tracker and history
- `HOURS`: opening hours

## How this helps the business grow
- Customers see clear prices, so more people walk in
- Booking on WhatsApp means no missed calls
- Repair tracking reduces repeated "is it ready?" calls
- Good Google visibility through SEO-friendly structure and a map
- Reviews and FAQs build trust with new customers

## Future improvements
- Node.js and MongoDB backend to store bookings and jobs
- Admin dashboard to update repair status
- SMS or WhatsApp alerts when a vehicle is ready


## Author
**Srusti Raghava** | Full Stack Web Development Intern at Future Interns
GitHub: [srustir07](https://github.com/srustir07)
