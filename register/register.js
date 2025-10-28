import { participantTemplate, successTemplate } from "./templates.js";

let participantCount = 1;

document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add");
  const form = document.getElementById("registrationForm");

  addButton.addEventListener("click", addParticipant);
  form.addEventListener("submit", submitForm);
});

function addParticipant() {
  participantCount++;
  const addButton = document.getElementById("add");
  addButton.insertAdjacentHTML("beforebegin", participantTemplate(participantCount));
}

function totalFees() {
  let feeElements = document.querySelectorAll("[id^=fee]");
  feeElements = [...feeElements];
  return feeElements.reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);
}

function submitForm(event) {
  event.preventDefault();

  const name = document.getElementById("adult_name").value;
  const total = totalFees();
  const summary = document.getElementById("summary");
  const form = document.getElementById("registrationForm");

  const info = {
    name: name || "Parent/Guardian",
    participants: participantCount,
    total: total.toFixed(2),
  };

  form.classList.add("hide");
  summary.classList.remove("hide");
  summary.innerHTML = successTemplate(info);
}
