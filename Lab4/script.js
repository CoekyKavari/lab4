document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const cardsContainer = document.getElementById("profile-cards");
  const tableBody = document.querySelector("#summary-table tbody");
  const searchInput = document.getElementById("search");
  const feedback = document.getElementById("feedback");

  let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

  function saveProfiles() {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }

  function renderProfiles() {
    cardsContainer.innerHTML = "";
    tableBody.innerHTML = "";
    profiles.forEach((profile, index) => {
      const card = document.createElement("div");
      card.className = "profile-card";
      card.innerHTML = `
        <img src="${profile.photo || "https://via.placeholder.com/200"}" alt="${
        profile.firstName
      }">
        <h3>${profile.firstName} ${profile.lastName}</h3>
        <p>Email: ${profile.email}</p>
        <p>Programme: ${profile.programme}</p>
        <p>Year: ${profile.year}</p>
        <p>Interests: ${profile.interests || "N/A"}</p>
        <button onclick="editProfile(${index})">Edit</button>
        <button onclick="removeProfile(${index})">Remove</button>`;
      cardsContainer.appendChild(card);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${profile.firstName} ${profile.lastName}</td>
        <td>${profile.email}</td>
        <td>${profile.programme}</td>
        <td>${profile.year}</td>
        <td><button onclick="editProfile(${index})">Edit</button>
        <button onclick="removeProfile(${index})">Remove</button></td>`;
      tableBody.appendChild(row);
    });
  }

  function showError(inputId, message) {
    document.getElementById(inputId + "Error").textContent = message;
  }
  function clearErrors() {
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const programme = form.programme.value.trim();
    const year = form.year.value;
    const interests = form.interests.value.trim();
    const photo = form.photo.value.trim();

    let valid = true;
    if (!firstName) {
      showError("firstName", "First name required");
      valid = false;
    }
    if (!lastName) {
      showError("lastName", "Last name required");
      valid = false;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showError("email", "Valid email required");
      valid = false;
    }
    if (!programme) {
      showError("programme", "Programme required");
      valid = false;
    }
    if (!year) {
      showError("year", "Year required");
      valid = false;
    }

    if (!valid) {
      feedback.textContent = "Please correct the errors above.";
      return;
    }

    profiles.push({
      firstName,
      lastName,
      email,
      programme,
      year,
      interests,
      photo,
    });
    saveProfiles();
    renderProfiles();
    feedback.textContent = "Profile added successfully!";
    form.reset();
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".profile-card").forEach((card) => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(query) ? "block" : "none";
    });
  });

  window.removeProfile = (index) => {
    profiles.splice(index, 1);
    saveProfiles();
    renderProfiles();
    feedback.textContent = "Profile removed.";
  };
  window.editProfile = (index) => {
    const profile = profiles[index];
    form.firstName.value = profile.firstName;
    form.lastName.value = profile.lastName;
    form.email.value = profile.email;
    form.programme.value = profile.programme;
    form.year.value = profile.year;
    form.interests.value = profile.interests;
    form.photo.value = profile.photo;
    profiles.splice(index, 1);
    saveProfiles();
    renderProfiles();
    feedback.textContent = "Editing profile — submit to update.";
  };

  renderProfiles();
});
