// Prototype logic: weather + demand + activity + anti-spoof signals => payout (static inputs for now)
const state = {
  worker: { name: "Asha Kumar", status: "Active" },
  hoursWorked: 6.5,
  weather: "Heavy Rain",
  demand: "Low",
  activity: "Active Today",
  eligibilityStatus: "Eligible",
  antiSpoofSignals: {
    appActivityTimeMinutes: 210,
    ordersCount: 12,
    movementConsistency: "Consistent", // Try "Jumping / Teleporting" to see the flag
    weatherActivityMismatch: "Match", // Try "Mismatch"
    repeatedClaims: "Normal", // Try "Repeated"
  },
};

function payoutFor({ weather, demand, activity }) {
  const isActive = activity.toLowerCase().includes("active");
  const badWeather = weather.toLowerCase().includes("rain") || weather.toLowerCase().includes("storm");
  const lowDemand = demand.toLowerCase() === "low";
  const mediumDemand = demand.toLowerCase() === "medium";

  // Small, predictable prototype payouts
  if (isActive && badWeather && lowDemand) return { amount: 300, reason: "Rain + Low Demand" };
  if (isActive && badWeather && mediumDemand) return { amount: 200, reason: "Rain + Medium Demand" };
  if (isActive && lowDemand) return { amount: 170, reason: "Low Demand" };
  if (isActive) return { amount: 90, reason: "Conditions Improved" };

  return { amount: 0, reason: "Not Active" };
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function evaluateAntiSpoof(antiSpoofSignals) {
  let risk = 0;
  const reasons = [];

  const movement = String(antiSpoofSignals.movementConsistency).toLowerCase();
  const weatherMismatch = String(antiSpoofSignals.weatherActivityMismatch).toLowerCase();
  const repeated = String(antiSpoofSignals.repeatedClaims).toLowerCase();

  if (movement.includes("jump") || movement.includes("teleport")) {
    risk += 35;
    reasons.push("Unusual movement pattern");
  }

  if (weatherMismatch.includes("mismatch")) {
    risk += 30;
    reasons.push("Weather vs activity mismatch");
  }

  if (repeated.includes("repeated")) {
    risk += 25;
    reasons.push("Repeated area/group claims");
  }

  if (antiSpoofSignals.appActivityTimeMinutes < 120) {
    risk += 10;
    reasons.push("Low app activity time");
  }

  if (antiSpoofSignals.ordersCount < 5 && state.hoursWorked >= 5) {
    risk += 10;
    reasons.push("Low orders for the hours worked");
  }

  risk = Math.max(0, Math.min(100, risk));

  let outcome = "Trusted";
  let riskLabel = "Low";
  let handling = "Proceed normally";

  if (risk >= 80) {
    outcome = "Flagged (High Risk)";
    riskLabel = "High";
    handling = "Payout paused pending verification";
  } else if (risk >= 60) {
    outcome = "Flagged (Medium Risk)";
    riskLabel = "Medium";
    handling = "Reduced payout; re-check later";
  }

  return { risk, outcome, riskLabel, handling, reasons };
}

function formatINR(amount) {
  return amount === 0 ? "₹0" : `₹${amount}`;
}

function syncDashboard() {
  document.getElementById("workerName").textContent = state.worker.name;
  document.getElementById("workerStatus").textContent = state.worker.status;
  document.getElementById("hoursWorked").textContent = String(state.hoursWorked);
  document.getElementById("weatherCondition").textContent = state.weather;
  document.getElementById("demandLevel").textContent = state.demand;
  document.getElementById("eligibilityStatus").textContent = state.eligibilityStatus;

  document.getElementById("tWeather").textContent = state.weather;
  document.getElementById("tDemand").textContent = state.demand;
  document.getElementById("tActivity").textContent = state.activity;

  const anti = evaluateAntiSpoof(state.antiSpoofSignals);
  document.getElementById("antiSpoofStatus").textContent = anti.outcome;
  document.getElementById("antiSpoofRisk").textContent = anti.riskLabel;

  document.getElementById("tAppActivityTime").textContent = formatMinutes(state.antiSpoofSignals.appActivityTimeMinutes);
  document.getElementById("tOrdersCount").textContent = String(state.antiSpoofSignals.ordersCount);
  document.getElementById("tMovementConsistency").textContent = state.antiSpoofSignals.movementConsistency;
  document.getElementById("tWeatherActivityMismatch").textContent = state.antiSpoofSignals.weatherActivityMismatch;
  document.getElementById("tRepeatedClaims").textContent = state.antiSpoofSignals.repeatedClaims;
  document.getElementById("tAntiSpoofOutcome").textContent = anti.outcome;
}

function onCheckPayout() {
  const payoutResult = document.getElementById("payoutResult");
  const payoutReason = document.getElementById("payoutReason");
  const payoutAmount = document.getElementById("payoutAmount");
  const antiSpoofHandling = document.getElementById("antiSpoofHandling");

  const base = payoutFor({
    weather: state.weather,
    demand: state.demand,
    activity: state.activity,
  });

  const anti = evaluateAntiSpoof(state.antiSpoofSignals);

  let finalAmount = base.amount;
  let finalReason = base.reason;

  // UX balance: suspicious cases should be handled gently (delay/reduce) instead of blind rejection.
  if (base.amount > 0) {
    if (anti.risk >= 80) {
      finalAmount = 0;
      finalReason = "Suspicious signals detected; payout paused for verification";
    } else if (anti.risk >= 60) {
      finalAmount = Math.max(50, Math.round(base.amount * 0.5));
      finalReason = `${base.reason} (after anti-spoof re-check)`;
    }
  }

  payoutReason.textContent = finalReason;
  payoutAmount.textContent = formatINR(finalAmount);
  antiSpoofHandling.textContent = base.amount > 0 ? anti.handling : "No payout (not active)";
  payoutResult.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  syncDashboard();
  document.getElementById("checkPayoutBtn").addEventListener("click", onCheckPayout);
});

