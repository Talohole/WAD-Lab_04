const form = document.getElementById("registrationForm");
const feedback = document.getElementById("feedback");
const cardsContainer = document.getElementById("cardsContainer");
const tableBody = document.querySelector("#summaryTable tbody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

let profiles = [];
let editIndex = null;

// Handle form submission
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const programme = document.getElementById("programme").value.trim();
  const year = document.getElementById("year").value;
  const interests = document.getElementById("interests").value.trim();
  const photo = document.getElementById("photo").value.trim();

  let valid = true;

  // Clear errors
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
  feedback.textContent = "";

  // Validation
  if (!firstName) {
    document.getElementById("firstNameError").textContent = "First name is required.";
    valid = false;
  }
  if (!lastName) {
    document.getElementById("lastNameError").textContent = "Last name is required.";
    valid = false;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("emailError").textContent = "Valid email is required.";
    valid = false;
  }
  if (!programme) {
    document.getElementById("programmeError").textContent = "Programme is required.";
    valid = false;
  }
  if (!year) {
    document.getElementById("yearError").textContent = "Please select a year.";
    valid = false;
  }
  if (photo && !/^https?:\/\//.test(photo)) {
    document.getElementById("photoError").textContent = "Photo URL must be valid.";
    valid = false;
  }

  if (!valid) {
    feedback.textContent = "Please fix the errors above.";
    return;
  }

  const profileData = { firstName, lastName, email, programme, year, interests, photo };

  if (editIndex !== null) {
    profiles[editIndex] = profileData;
    editIndex = null;
    feedback.textContent = "Profile updated successfully!";
  } else {
    profiles.push(profileData);
    feedback.textContent = "Profile successfully added!";
  }

  renderProfiles();
  form.reset();
});

// Render cards + table
function renderProfiles() {
  cardsContainer.innerHTML = "";
  tableBody.innerHTML = "";

  profiles.forEach((profile, index) => {
    // Card
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${profile.photo || 'https://via.placeholder.com/100'}" alt="Profile Photo">
      <h3>${profile.firstName} ${profile.lastName}</h3>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Programme:</strong> ${profile.programme}</p>
      <p><strong>Year:</strong> ${profile.year}</p>
      <p><strong>Interests:</strong> ${profile.interests || "N/A"}</p>
      <button class="remove-btn">Remove</button>
      <button class="edit-btn">Edit</button>
    `;
    cardsContainer.appendChild(card);

    // Table row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${profile.firstName} ${profile.lastName}</td>
      <td>${profile.email}</td>
      <td>${profile.programme}</td>
      <td>${profile.year}</td>
      <td>
        <button class="remove-btn">Remove</button>
        <button class="edit-btn">Edit</button>
      </td>
    `;
    tableBody.appendChild(row);

    // Remove
    const remove = () => {
      profiles.splice(index, 1);
      renderProfiles();
    };

    // Edit
    const edit = () => {
      document.getElementById("firstName").value = profile.firstName;
      document.getElementById("lastName").value = profile.lastName;
      document.getElementById("email").value = profile.email;
      document.getElementById("programme").value = profile.programme;
      document.getElementById("year").value = profile.year;
      document.getElementById("interests").value = profile.interests;
      document.getElementById("photo").value = profile.photo;
      editIndex = index;
      feedback.textContent = "Editing profile... make changes and submit.";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    card.querySelector(".remove-btn").addEventListener("click", remove);
    row.querySelector(".remove-btn").addEventListener("click", remove);
    card.querySelector(".edit-btn").addEventListener("click", edit);
    row.querySelector(".edit-btn").addEventListener("click", edit);
  });
}

// Search button
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
  document.querySelectorAll("#summaryTable tbody tr").forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(query) ? "" : "none";
  });
});

// Reset search
resetBtn.addEventListener("click", function () {
  searchInput.value = "";
  document.querySelectorAll(".card").forEach(card => card.style.display = "block");
  document.querySelectorAll("#summaryTable tbody tr").forEach(row => row.style.display = "");
});
