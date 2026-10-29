const caseInput = document.getElementById("caseInput");
const investigateBtn = document.getElementById("investigateBtn");

function analyzeCase(text) {
  const lower = text.toLowerCase();
  const hasDigital = /laptop|computer|phone|email|account|password|file|data|camera|cctv/.test(lower);
  const location = lower.match(/(?:in|at|near|from)\s+(?:the\s+)?([a-z0-9 -]{3,30})/i)?.[1] || "reported location";
  const confidence = text.length > 120 ? 91 : text.length > 60 ? 84 : 76;

  const evidence = [
    {title:"Primary incident", desc:"The case description was converted into a structured incident record."},
    {title:"Key location", desc:`Potential location identified: ${location}.`},
    {title:"Digital trail", desc: hasDigital ? "Digital evidence may be relevant; preserve logs, access history and timestamps." : "No explicit digital artifact was detected in the case brief."},
    {title:"Time window", desc:"Establish the exact start/end time and compare it with access records."}
  ];

  const suspects = [
    {name:"Person A — Access holder", desc:"Prioritize anyone with legitimate access during the incident window.", risk:"HIGH"},
    {name:"Person B — Witness", desc:"Verify their timeline independently using available evidence.", risk:"MEDIUM"},
    {name:"Person C — External link", desc:"Check whether an outside person had opportunity or contact.", risk:"LOW"}
  ];

  const timeline = [
    ["T−30 min","Establish normal state before the incident."],
    ["T0","Incident is reported or first detected."],
    ["T+15 min","Collect physical and digital evidence without altering it."],
    ["T+30 min","Cross-check statements, access records and timestamps."],
    ["T+60 min","Rank hypotheses and identify the next evidence to collect."]
  ];

  const actions = [
    ["Preserve evidence","Secure devices, logs, CCTV and relevant files before they are overwritten."],
    ["Verify timeline","Compare every person's statement with independent timestamps."],
    ["Test hypotheses","Collect the next strongest piece of evidence for the top hypothesis."]
  ];

  return {confidence, evidence, suspects, timeline, actions};
}

function render(result) {
  document.getElementById("confidence").textContent = `${result.confidence}% CONFIDENCE`;
  document.getElementById("confidence").classList.remove("muted");

  document.getElementById("analysis").className = "";
  document.getElementById("analysis").innerHTML =
    `<div class="card"><strong>Investigation summary</strong><p>The case has been structured into evidence, people of interest, a timeline and recommended next actions. This demo prioritizes preservation and verification before drawing conclusions.</p></div>`;

  document.getElementById("evidence").className = "cards";
  document.getElementById("evidence").innerHTML = result.evidence.map(e =>
    `<div class="card"><strong>${e.title}</strong><p>${e.desc}</p></div>`).join("");

  document.getElementById("suspects").className = "cards";
  document.getElementById("suspects").innerHTML = result.suspects.map(s =>
    `<div class="card"><span class="risk">${s.risk}</span><strong>${s.name}</strong><p>${s.desc}</p></div>`).join("");

  document.getElementById("timeline").className = "timeline";
  document.getElementById("timeline").innerHTML = result.timeline.map(t =>
    `<div class="timeline-item"><b>${t[0]}</b><p>${t[1]}</p></div>`).join("");

  document.getElementById("actions").className = "actions";
  document.getElementById("actions").innerHTML = result.actions.map(a =>
    `<div class="action"><b>${a[0]}</b><span>${a[1]}</span></div>`).join("");
}

investigateBtn.addEventListener("click", () => {
  const text = caseInput.value.trim();
  if (!text) {
    caseInput.focus();
    caseInput.placeholder = "Please enter a case description first...";
    return;
  }
  investigateBtn.textContent = "🧠 Analyzing...";
  investigateBtn.disabled = true;
  setTimeout(() => {
    render(analyzeCase(text));
    investigateBtn.textContent = "⚡ Run AI Investigation";
    investigateBtn.disabled = false;
  }, 700);
});

caseInput.value = "A laptop disappeared from the college computer lab between 2 PM and 3 PM. Three people had access to the room, and the CCTV recording shows activity near the entrance.";
