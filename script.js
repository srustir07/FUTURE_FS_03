// ---- Edit these for the real garage ----
const WHATSAPP = "919999999999"; // country code first, no +

const PRICES = {
  "Bike":      {"Basic service":499,"Full service":899,"Oil change":249,"Brake service":349},
  "Scooter":   {"Basic service":449,"Full service":799,"Oil change":249,"Brake service":349},
  "Hatchback": {"Basic service":1499,"Full service":2999,"Oil change":699,"Brake service":999,"Wheel alignment":599,"AC service":1299},
  "SUV":       {"Basic service":1999,"Full service":3999,"Oil change":899,"Brake service":1299,"Wheel alignment":799,"AC service":1699}
};

const HISTORY = {
  "KA09AB1234":[["12 Aug 2026","Full service","₹899"],["03 Feb 2026","Oil change","₹249"]],
  "KA01XY5678":[["28 Jul 2026","Brake service","₹999"],["10 Jan 2026","Basic service","₹1499"]]
};

// stage: 0=Received, 1=Inspection, 2=In progress, 3=Ready, 4=Delivered
const STAGES = ["Vehicle received","Inspection done","Work in progress","Ready for pickup","Delivered"];
const JOBS = {
  "SG1001":{vehicle:"KA09AB1234 (Bike)",service:"Full service",stage:2,updated:"Today, 11:40 am",note:"Engine tuning is going on. Expected ready by 4 pm."},
  "SG1002":{vehicle:"KA01XY5678 (Hatchback)",service:"Brake service",stage:3,updated:"Today, 10:15 am",note:"Your vehicle is ready. Please collect it before 7 pm and pay at the counter."},
  "SG1003":{vehicle:"KA05MN4321 (Scooter)",service:"Oil change",stage:0,updated:"Today, 9:05 am",note:"We have received your vehicle. Inspection starts shortly."}
};

// Service gap in months for the reminder
const GAP_MONTHS = {"Bike":3,"Scooter":3,"Hatchback":6,"SUV":6};

// Working hours (24h). closedDays: 0 = Sunday
const HOURS = {open:9, close:19, closedDays:[0]};

// Sample reviews. Replace with real ones from the garage's customers.
const REVIEWS = [
  {n:"Ravi K.",v:"Bike owner",s:5,t:"The price on the website was the price I paid. No surprises at the counter."},
  {n:"Meena S.",v:"Hatchback owner",s:5,t:"Pickup and drop saved me a lot of time, and I could check the repair status from my office."},
  {n:"Arjun P.",v:"Scooter owner",s:4,t:"Quick oil change and a clean finish. Booking on WhatsApp was easy."}
];
// -----------------------------------------

const $ = id => document.getElementById(id);
const veh = $("veh"), svc = $("svc"), bsvc = $("bsvc");

/* ---------- dark mode ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $("themeBtn").textContent = t === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
setTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("themeBtn").addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* ---------- open now badge ---------- */
function updateOpen() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const open = !HOURS.closedDays.includes(now.getDay()) && h >= HOURS.open && h < HOURS.close;
  const b = $("openBadge");
  b.textContent = open ? "Open now" : "Closed now";
  b.className = "badge " + (open ? "on" : "off");
}
updateOpen();
setInterval(updateOpen, 60000);

/* ---------- floating whatsapp ---------- */
$("waFloat").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi, I have a question about servicing my vehicle.")}`;

/* ---------- dropdowns ---------- */
Object.keys(PRICES).forEach(v => { veh.add(new Option(v)); $("rveh").add(new Option(v)); });
const allSvc = [...new Set(Object.values(PRICES).flatMap(o => Object.keys(o)))];
allSvc.forEach(s => bsvc.add(new Option(s)));

/* ---------- estimator ---------- */
function fillServices() {
  const keep = svc.value;
  svc.innerHTML = "";
  Object.keys(PRICES[veh.value]).forEach(s => svc.add(new Option(s)));
  if ([...svc.options].some(o => o.value === keep)) svc.value = keep;
  calc();
}
function calc() {
  let t = PRICES[veh.value][svc.value] || 0;
  if ($("pick").checked) t += 150;
  if ($("wash").checked) t += 100;
  $("total").textContent = "₹" + t.toLocaleString("en-IN");
}
veh.addEventListener("change", fillServices);
[svc, $("pick"), $("wash")].forEach(e => e.addEventListener("change", calc));
$("useEst").addEventListener("click", () => { bsvc.value = svc.value; });
fillServices();

/* ---------- rate card table ---------- */
(function buildRates() {
  const vehicles = Object.keys(PRICES);
  let html = "<thead><tr><th>Service</th>" + vehicles.map(v => `<th>${v}</th>`).join("") + "</tr></thead><tbody>";
  allSvc.forEach(s => {
    html += `<tr><td>${s}</td>` + vehicles.map(v => {
      const p = PRICES[v][s];
      return `<td>${p ? "₹" + p.toLocaleString("en-IN") : "-"}</td>`;
    }).join("") + "</tr>";
  });
  $("rateTable").innerHTML = html + "</tbody>";
})();

/* ---------- booking -> WhatsApp ---------- */
$("date").min = new Date().toISOString().split("T")[0];
$("bookForm").addEventListener("submit", e => {
  e.preventDefault();
  const text =
    `Hi, I'd like to book a service.\n` +
    `Name: ${$("name").value}\n` +
    `Vehicle: ${$("plate").value}\n` +
    `Service: ${bsvc.value}\n` +
    `Date: ${$("date").value}\n` +
    `Slot: ${$("slot").value}\n` +
    `Pickup needed: ${$("bpick").checked ? "Yes" : "No"}\n` +
    `Notes: ${$("notes").value || "None"}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
});

/* ---------- service history ---------- */
$("hbtn").addEventListener("click", () => {
  const key = $("hplate").value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const list = $("hlist"), msg = $("hmsg");
  list.innerHTML = "";
  if (!key) { msg.textContent = "Enter your vehicle number first."; return; }
  const rows = HISTORY[key];
  if (!rows) { msg.textContent = "No records found for " + key + ". Check the number or call us."; return; }
  msg.textContent = rows.length + " past jobs for " + key;
  rows.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${r[1]}<small>${r[0]}</small></span><strong>${r[2]}</strong>`;
    list.appendChild(li);
  });
});

/* ---------- repair tracker ---------- */
function trackJob() {
  const id = $("jobid").value.trim().toUpperCase();
  const msg = $("tmsg"), box = $("result");
  box.style.display = "none";
  msg.textContent = "";
  if (!id) { msg.textContent = "Enter your job ID first."; return; }
  const job = JOBS[id];
  if (!job) { msg.textContent = "No job found for " + id + ". Check your receipt or call us."; return; }

  $("rService").textContent = job.service + " (Job " + id + ")";
  $("rVehicle").textContent = job.vehicle;
  $("rUpdated").textContent = "Last updated: " + job.updated;
  $("rNote").textContent = job.note;

  const steps = $("steps");
  steps.innerHTML = "";
  STAGES.forEach((name, i) => {
    const li = document.createElement("li");
    li.textContent = name;
    if (i < job.stage || job.stage === STAGES.length - 1) li.className = "done";
    else if (i === job.stage) li.className = "current";
    steps.appendChild(li);
  });
  box.style.display = "block";
}
$("trackBtn").addEventListener("click", trackJob);
$("jobid").addEventListener("keydown", e => { if (e.key === "Enter") trackJob(); });

/* ---------- next service reminder ---------- */
$("lastDate").max = new Date().toISOString().split("T")[0];
$("remBtn").addEventListener("click", () => {
  const out = $("remOut"), last = $("lastDate").value;
  if (!last) { out.textContent = "Pick your last service date first."; return; }
  const due = new Date(last);
  due.setMonth(due.getMonth() + GAP_MONTHS[$("rveh").value]);
  const days = Math.round((due - new Date()) / 86400000);
  const when = due.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
  out.textContent = days >= 0
    ? `Next service is due on ${when}, in ${days} days.`
    : `Service was due on ${when}. You are ${-days} days overdue, please book soon.`;
});

/* ---------- reviews slider ---------- */
let ri = 0;
function showReview() {
  const r = REVIEWS[ri];
  $("rvStars").textContent = "★".repeat(r.s) + "☆".repeat(5 - r.s);
  $("rvText").textContent = "\u201C" + r.t + "\u201D";
  $("rvName").textContent = r.n + ", " + r.v;
}
function moveReview(step) {
  ri = (ri + step + REVIEWS.length) % REVIEWS.length;
  showReview();
}
$("rvPrev").addEventListener("click", () => moveReview(-1));
$("rvNext").addEventListener("click", () => moveReview(1));
showReview();
setInterval(() => moveReview(1), 7000);