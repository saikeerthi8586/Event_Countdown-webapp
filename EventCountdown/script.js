const form = document.getElementById("eventForm");
const eventsList = document.getElementById("eventsList");
let events = [];
let editEventId = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const datetime = document.getElementById("datetime").value;
  const email = document.getElementById("email").value.trim();
  const category = document.getElementById("category").value;

  if (!title || !description || !datetime || !category) {
    alert("Please fill all required fields.");
    return;
  }

  const eventTime = new Date(datetime);
  if (eventTime <= new Date()) {
    alert("Please select a future date and time.");
    return;
  }

  const event = {
    id: editEventId || Date.now(),
    title,
    description,
    eventTime,
    email,
    category
  };

  if (editEventId) {
    events = events.filter(e => e.id !== editEventId);
    editEventId = null;
  }

  events.push(event);
  renderEvents();
  form.reset();
});

function renderEvents() {
  eventsList.innerHTML = "";

  events.forEach((event) => {
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = `
      <h4>${event.title} (${event.category})</h4>
      <p>${event.description}</p>
      <p><strong>Event Time:</strong> ${event.eventTime.toLocaleString()}</p>
      <p><span class="countdown" id="countdown-${event.id}">Loading...</span></p>
      <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
      <button class="edit-btn" onclick="editEvent(${event.id})">Edit</button>
    `;
    eventsList.appendChild(div);

    startCountdown(event);
  });
}

function startCountdown(event) {
  const countdownEl = document.getElementById(`countdown-${event.id}`);

  const interval = setInterval(() => {
    const now = new Date();
    const diff = event.eventTime - now;

    if (diff <= 0) {
      countdownEl.innerHTML = "Event started!";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (event.email && days === 1 && hours === 0 && minutes === 0 && seconds === 0) {
      console.log(`Reminder: Sending email to ${event.email} for event "${event.title}"`);
    }
  }, 1000);
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  renderEvents();
}

function editEvent(id) {
  const eventToEdit = events.find(e => e.id === id);
  if (!eventToEdit) return;

  document.getElementById("title").value = eventToEdit.title;
  document.getElementById("description").value = eventToEdit.description;
  document.getElementById("datetime").value = new Date(eventToEdit.eventTime).toISOString().slice(0, 16);
  document.getElementById("email").value = eventToEdit.email;
  document.getElementById("category").value = eventToEdit.category;

  editEventId = id;
}
