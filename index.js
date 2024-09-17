document.getElementById("mobile-menu").addEventListener("click", function () {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
});

// JavaScript to load more images when clicking the down arrow
document
  .getElementById("load-more-arrow")
  .addEventListener("click", function () {
    const galleryContainer = document.getElementById("gallery-container");

    // Create new rows of images (simulated for placeholders)
    const newRow = document.createElement("div");
    newRow.className = "row";
    newRow.innerHTML = `
      <div class="column">
          <img src="https://via.placeholder.com/200" alt="Placeholder 10">
          <img src="https://via.placeholder.com/200" alt="Placeholder 11">
          <img src="https://via.placeholder.com/200" alt="Placeholder 12">
      </div>
      <div class="column">
          <img src="https://via.placeholder.com/200" alt="Placeholder 13">
          <img src="https://via.placeholder.com/200" alt="Placeholder 14">
          <img src="https://via.placeholder.com/200" alt="Placeholder 15">
      </div>
      <div class="column">
          <img src="https://via.placeholder.com/200" alt="Placeholder 16">
          <img src="https://via.placeholder.com/200" alt="Placeholder 17">
          <img src="https://via.placeholder.com/200" alt="Placeholder 18">
      </div>
  `;

    // Append new row to the gallery
    galleryContainer.appendChild(newRow);

    // Optionally, hide the load more arrow after loading more photos
    // this.style.display = 'none';
  });

//Backend code

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: function (fetchInfo, successCallback, failureCallback) {
      fetch("http://localhost:5500/admin/appointments")
        .then((response) => response.json())
        .then((data) => {
          const events = data.map((appointment) => ({
            title: appointment.name,
            start: `${appointment.date}T${appointment.time}`,
            description: `Phone: ${appointment.phone}`,
          }));
          successCallback(events);
        });
    },
  });

  calendar.render();
});
