function showSection(sectionId, clickedButton) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });


    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }


    // Remove active class from sidebar buttons
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    // Add active class to clicked button
    if (clickedButton) {
        clickedButton.classList.add("active");
    }


    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function refreshDashboard() {

    const button = document.querySelector(".refresh-btn");

    button.innerHTML = "↻ Refreshing...";

    setTimeout(() => {

        button.innerHTML = "✓ Updated";

        setTimeout(() => {
            button.innerHTML = "↻ Refresh";
        }, 1200);

    }, 700);
}