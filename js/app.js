/* ==========================================================================
   Global Visa Portal - Application JavaScript
   ========================================================================== */

// Sample Data for Initial Load
const SAMPLE_APPLICATIONS = [
  {
    id: "VISA-2026-8812",
    fullName: "Payal",
    passportNo: "Z9482710",
    dob: "1998-05-14",
    nationality: "Indian",
    email: "payal@example.com",
    phone: "+91 9876543210",
    destination: "Japan",
    visaType: "Tourist",
    travelDate: "2026-10-15",
    durationDays: "15",
    fee: "$90.00",
    status: "Approved",
    submittedAt: "2026-08-10",
    approvedAt: "2026-08-14",
    validUntil: "2027-08-14"
  },
  {
    id: "VISA-2026-4391",
    fullName: "Sarah Jenkins",
    passportNo: "A8392014",
    dob: "1994-11-22",
    nationality: "American",
    email: "sarah.j@example.com",
    phone: "+1 415-555-0199",
    destination: "United Kingdom",
    visaType: "Business",
    travelDate: "2026-09-01",
    durationDays: "30",
    fee: "$160.00",
    status: "Pending",
    submittedAt: "2026-08-12",
    approvedAt: "-",
    validUntil: "-"
  },
  {
    id: "VISA-2026-7205",
    fullName: "Carlos Mendez",
    passportNo: "P4920183",
    dob: "1991-03-08",
    nationality: "Mexican",
    email: "carlos.m@example.com",
    phone: "+52 55-5555-1234",
    destination: "United States",
    visaType: "Student",
    travelDate: "2026-12-01",
    durationDays: "365",
    fee: "$185.00",
    status: "Rejected",
    submittedAt: "2026-08-05",
    approvedAt: "-",
    validUntil: "-"
  }
];

// Country Visa Fee Mapping
const VISA_FEES = {
  "United States": { Tourist: "$185.00", Business: "$210.00", Student: "$185.00" },
  "United Kingdom": { Tourist: "$140.00", Business: "$160.00", Student: "$490.00" },
  "Japan": { Tourist: "$90.00", Business: "$120.00", Student: "$90.00" },
  "Canada": { Tourist: "$100.00", Business: "$150.00", Student: "$150.00" },
  "France (Schengen)": { Tourist: "$95.00", Business: "$130.00", Student: "$110.00" },
  "Australia": { Tourist: "$130.00", Business: "$175.00", Student: "$450.00" },
  "United Arab Emirates": { Tourist: "$110.00", Business: "$180.00", Student: "$250.00" }
};

// Initialize Application State
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  initFormStepper();
  renderAdminTable();
  updateAdminStats();
  setupEventListeners();
});

// Storage Management
function getApplications() {
  const data = localStorage.getItem("visa_applications");
  return data ? JSON.parse(data) : [];
}

function saveApplications(apps) {
  localStorage.setItem("visa_applications", JSON.stringify(apps));
}

function initStorage() {
  let apps = getApplications();
  if (!apps || apps.length === 0) {
    saveApplications(SAMPLE_APPLICATIONS);
  } else {
    // Automatically replace any previous stored "Ramanand Yadav" entries with "Payal"
    let modified = false;
    apps = apps.map(app => {
      if (app.fullName && (app.fullName.includes("Ramanand") || app.fullName.includes("Yadav"))) {
        app.fullName = "Payal";
        if (app.email && app.email.includes("ramanand")) {
          app.email = app.email.replace("ramanand", "payal");
        }
        modified = true;
      }
      return app;
    });
    if (modified) {
      saveApplications(apps);
    }
  }
}

// Reset sample data for live demo
function resetSampleData() {
  if (confirm("Reset all applications to initial sample data?")) {
    saveApplications(SAMPLE_APPLICATIONS);
    renderAdminTable();
    updateAdminStats();
    alert("Sample data restored successfully!");
  }
}

// Form Stepper Logic
let currentStep = 1;
const totalSteps = 4;

function initFormStepper() {
  const destinationSelect = document.getElementById("formDestination");
  const typeSelect = document.getElementById("formVisaType");
  
  if (destinationSelect && typeSelect) {
    destinationSelect.addEventListener("change", updateFeeSummary);
    typeSelect.addEventListener("change", updateFeeSummary);
  }
}

function resetFormStepper() {
  document.querySelectorAll(".step-item").forEach(item => {
    item.classList.remove("active", "completed");
  });
  document.querySelectorAll(".form-step").forEach(step => {
    step.classList.remove("active");
  });
  currentStep = 1;
  document.querySelector(`.form-step[data-step="1"]`).classList.add("active");
  document.querySelector(`.step-item[data-step="1"]`).classList.add("active");
}

function goToStep(step) {
  if (step > currentStep && !validateStep(currentStep)) {
    return;
  }
  
  // Hide current step
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove("active");
  document.querySelector(`.step-item[data-step="${currentStep}"]`).classList.remove("active");
  if (step > currentStep) {
    document.querySelector(`.step-item[data-step="${currentStep}"]`).classList.add("completed");
  }

  // Show target step
  currentStep = step;
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add("active");
  document.querySelector(`.step-item[data-step="${currentStep}"]`).classList.add("active");

  if (currentStep === 4) {
    populateReviewStep();
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    goToStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

function validateStep(step) {
  const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
  const requiredInputs = stepElement.querySelectorAll("[required]");
  
  for (let input of requiredInputs) {
    if (input.type === "file") {
      if (input.files.length === 0) {
        alert("Please select a sample document/image to upload before proceeding.");
        return false;
      }
    } else if (!input.value.trim()) {
      alert(`Please fill out: ${input.previousElementSibling ? input.previousElementSibling.innerText : 'all required fields'}`);
      input.focus();
      return false;
    }
  }
  return true;
}

function updateFeeSummary() {
  const country = document.getElementById("formDestination").value;
  const type = document.getElementById("formVisaType").value;
  const feeDisplay = document.getElementById("calculatedFee");
  
  if (VISA_FEES[country] && VISA_FEES[country][type]) {
    feeDisplay.innerText = VISA_FEES[country][type];
  } else {
    feeDisplay.innerText = "$120.00";
  }
}

function populateReviewStep() {
  document.getElementById("reviewName").innerText = document.getElementById("fullName").value;
  document.getElementById("reviewPassport").innerText = document.getElementById("passportNo").value;
  document.getElementById("reviewNationality").innerText = document.getElementById("nationality").value;
  document.getElementById("reviewCountry").innerText = document.getElementById("formDestination").value;
  document.getElementById("reviewVisaType").innerText = document.getElementById("formVisaType").value;
  document.getElementById("reviewDate").innerText = document.getElementById("travelDate").value;
  document.getElementById("reviewFee").innerText = document.getElementById("calculatedFee").innerText;
}

// Select Country from Requirements Cards
function selectCountryForApply(countryName) {
  const countrySelect = document.getElementById("formDestination");
  if (countrySelect) {
    countrySelect.value = countryName;
    updateFeeSummary();
  }
  const applySection = document.getElementById("apply");
  if (applySection) {
    applySection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Application Submission
function submitApplication(event) {
  event.preventDefault();
  
  const idNumber = Math.floor(1000 + Math.random() * 9000);
  const appId = `VISA-2026-${idNumber}`;
  const today = new Date().toISOString().split('T')[0];
  
  const newApp = {
    id: appId,
    fullName: document.getElementById("fullName").value,
    passportNo: document.getElementById("passportNo").value,
    dob: document.getElementById("dob").value,
    nationality: document.getElementById("nationality").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    destination: document.getElementById("formDestination").value,
    visaType: document.getElementById("formVisaType").value,
    travelDate: document.getElementById("travelDate").value,
    durationDays: document.getElementById("durationDays").value || "30",
    fee: document.getElementById("calculatedFee").innerText,
    status: "Pending",
    submittedAt: today,
    approvedAt: "-",
    validUntil: "-"
  };

  const apps = getApplications();
  apps.unshift(newApp);
  saveApplications(apps);

  // Show Success Modal
  document.getElementById("modalTrackingId").innerText = appId;
  document.getElementById("successModal").classList.add("active");

  // Reset Form
  document.getElementById("visaApplicationForm").reset();
  resetFormStepper();

  // Refresh Admin table
  renderAdminTable();
  updateAdminStats();
}

function closeModal() {
  document.getElementById("successModal").classList.remove("active");
}

function trackFromModal() {
  const appId = document.getElementById("modalTrackingId").innerText;
  closeModal();
  document.getElementById("trackerInput").value = appId;
  trackApplication();
  document.getElementById("tracker").scrollIntoView({ behavior: 'smooth' });
}

// Status Tracker Logic
function quickTrack(appId) {
  document.getElementById("trackerInput").value = appId;
  trackApplication();
  document.getElementById("tracker").scrollIntoView({ behavior: 'smooth' });
}

function trackApplication() {
  const searchInput = document.getElementById("trackerInput").value.trim().toUpperCase();
  const trackerResult = document.getElementById("trackerResult");
  const noResult = document.getElementById("noResult");

  if (!searchInput) {
    alert("Please enter a valid Application Tracking Reference ID!");
    return;
  }

  const apps = getApplications();
  const app = apps.find(a => a.id.toUpperCase() === searchInput);

  if (!app) {
    trackerResult.style.display = "none";
    noResult.style.display = "block";
    return;
  }

  noResult.style.display = "none";
  trackerResult.style.display = "block";

  // Populate Details
  document.getElementById("trackAppId").innerText = app.id;
  document.getElementById("trackName").innerText = app.fullName;
  document.getElementById("trackPassport").innerText = app.passportNo;
  document.getElementById("trackCountry").innerText = app.destination;
  document.getElementById("trackType").innerText = app.visaType;
  document.getElementById("trackDate").innerText = app.submittedAt;
  
  // Status Badge
  const statusBadge = document.getElementById("trackStatusBadge");
  statusBadge.className = `badge badge-${app.status.toLowerCase().replace(' ', '')}`;
  statusBadge.innerText = app.status;

  // Timeline Progress
  const step1 = document.getElementById("timelineStep1");
  const step2 = document.getElementById("timelineStep2");
  const step3 = document.getElementById("timelineStep3");
  const step4 = document.getElementById("timelineStep4");

  // Reset steps
  [step1, step2, step3, step4].forEach(s => s.className = "timeline-step");

  step1.classList.add("completed");
  if (app.status === "Pending") {
    step2.classList.add("active");
  } else if (app.status === "Under Review") {
    step2.classList.add("completed");
    step3.classList.add("active");
  } else if (app.status === "Approved") {
    step2.classList.add("completed");
    step3.classList.add("completed");
    step4.classList.add("completed");
  } else if (app.status === "Rejected") {
    step2.classList.add("completed");
    step3.classList.add("completed");
    document.getElementById("timelineTitle4").innerText = "Rejected";
  }

  // Render E-Visa Permit if Approved
  const evisaSection = document.getElementById("evisaSection");
  if (app.status === "Approved") {
    evisaSection.style.display = "block";
    document.getElementById("evisaName").innerText = app.fullName.toUpperCase();
    document.getElementById("evisaPassport").innerText = app.passportNo;
    document.getElementById("evisaCountry").innerText = app.destination.toUpperCase();
    document.getElementById("evisaType").innerText = app.visaType.toUpperCase();
    document.getElementById("evisaIssueDate").innerText = app.approvedAt || app.submittedAt;
    document.getElementById("evisaValidDate").innerText = app.validUntil || "2027-08-14";
    document.getElementById("evisaRef").innerText = app.id;
  } else {
    evisaSection.style.display = "none";
  }
}

// Admin Panel Logic
function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  const filter = document.getElementById("adminFilter") ? document.getElementById("adminFilter").value : "All";
  const apps = getApplications();

  if (!tbody) return;
  tbody.innerHTML = "";

  const filteredApps = apps.filter(a => filter === "All" || a.status === filter);

  if (filteredApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No applications found.</td></tr>`;
    return;
  }

  filteredApps.forEach(app => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${app.id}</strong></td>
      <td>${app.fullName}</td>
      <td>${app.passportNo}</td>
      <td>${app.destination} (${app.visaType})</td>
      <td>${app.submittedAt}</td>
      <td><span class="badge badge-${app.status.toLowerCase().replace(' ', '')}">${app.status}</span></td>
      <td>
        <div style="display: flex; gap: 0.4rem;">
          <button onclick="changeAppStatus('${app.id}', 'Approved')" class="btn btn-sm btn-success" title="Approve Visa">Approve</button>
          <button onclick="changeAppStatus('${app.id}', 'Rejected')" class="btn btn-sm btn-danger" title="Reject Visa">Reject</button>
          <button onclick="quickTrack('${app.id}')" class="btn btn-sm btn-primary" title="View Details">View</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function changeAppStatus(appId, newStatus) {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === appId);

  if (index !== -1) {
    apps[index].status = newStatus;
    if (newStatus === "Approved") {
      const today = new Date().toISOString().split('T')[0];
      const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      apps[index].approvedAt = today;
      apps[index].validUntil = nextYear;
    }
    saveApplications(apps);
    renderAdminTable();
    updateAdminStats();
    
    // If currently tracking this ID, refresh view
    const currentTrackId = document.getElementById("trackAppId").innerText;
    if (currentTrackId === appId) {
      trackApplication();
    }
  }
}

function updateAdminStats() {
  const apps = getApplications();
  const total = apps.length;
  const pending = apps.filter(a => a.status === "Pending" || a.status === "Under Review").length;
  const approved = apps.filter(a => a.status === "Approved").length;
  const rejected = apps.filter(a => a.status === "Rejected").length;

  if (document.getElementById("statTotal")) document.getElementById("statTotal").innerText = total;
  if (document.getElementById("statPending")) document.getElementById("statPending").innerText = pending;
  if (document.getElementById("statApproved")) document.getElementById("statApproved").innerText = approved;
  if (document.getElementById("statRejected")) document.getElementById("statRejected").innerText = rejected;
}

// Print E-Visa Pass
function printEVisa() {
  window.print();
}

// General Event Listeners
function setupEventListeners() {
  // Mobile Nav Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
