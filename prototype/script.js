// Prototype logic: weather + demand + activity => payout (static inputs for now)
const state = {
  worker: { name: "Asha Kumar", status: "Active" },
  hoursWorked: 6.5,
  weather: "Heavy Rain",
  demand: "Low",
  activity: "Active Today",
  eligibilityStatus: "Eligible",
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
}

function onCheckPayout() {
  const payoutResult = document.getElementById("payoutResult");
  const payoutReason = document.getElementById("payoutReason");
  const payoutAmount = document.getElementById("payoutAmount");

  const { amount, reason } = payoutFor({
    weather: state.weather,
    demand: state.demand,
    activity: state.activity,
  });

  payoutReason.textContent = reason;
  payoutAmount.textContent = formatINR(amount);
  payoutResult.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  syncDashboard();
  document.getElementById("checkPayoutBtn").addEventListener("click", onCheckPayout);
});

