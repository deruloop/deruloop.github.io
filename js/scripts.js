function showContent(selectedIndex) {
    // Select all content sections
    const allContent = document.querySelectorAll('.content > div');

    // Loop through all sections and hide them
    allContent.forEach(section => {
        section.classList.add('hidden'); // Apply the hidden class
        section.classList.remove('visible'); // Remove the visible class
    });

    // Show the selected content section
    const selectedContent = document.getElementById(`content${selectedIndex}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden'); // Remove hidden class
        selectedContent.classList.add('visible'); // Apply visible class
    }

    // Get all buttons and their text spans
    const allButtons = document.querySelectorAll('.iconButtons button');
    const allTexts = document.querySelectorAll('.iconButtons span');

    // Loop through all buttons and text spans
    allButtons.forEach((button, index) => {
        const textSpan = allTexts[index];
        if (index === selectedIndex - 1) {
            // Show text for the selected button
            textSpan.classList.remove('hidden');
            textSpan.classList.add('visible');
        } else {
            // Hide text for unselected buttons
            textSpan.classList.remove('visible');
            textSpan.classList.add('hidden');
        }
    });
}

function sendEmail() {
    window.location.href = "mailto:cristiano@calicchia.dev?subject=[Company]&body=[Content]";
}