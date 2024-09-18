document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const scpImage = document.getElementById('scp-image');
    const scpSubject = document.getElementById('scp-subject');
    const scpClass = document.getElementById('scp-class');
    const scpContainment = document.getElementById('scp-containment');
    const readMoreContent = document.querySelector('.read-more-content');
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    const homeLink = document.getElementById('home-link');
    const readAloudButton = document.querySelector('.read-aloud-button');
    const readMoreButton = document.querySelector('.read-more-button');
    let isSpeaking = false;
    let speech = null;

    // Home link click event listener
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadHomePage();
    });

    // Navigation click event listener
    navbar.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.scp) {
            e.preventDefault();
            const scpId = e.target.getAttribute('data-scp');
            loadSCPData(scpId);
        }
    });

    function loadHomePage() {
        // Restore the original home page content
        scpImage.src = 'images/Entrance.webp';
        scpImage.alt = 'Hidden Bunker Entrance';
        scpSubject.innerText = '';
        scpClass.innerText = '';
        scpContainment.innerText = '';
        pageTitle.innerText = 'Welcome to the SCP Archive';
        pageDescription.innerText = 'Click on an SCP link above to view details.';
        readMoreContent.style.display = 'none';
        readAloudButton.style.display = 'none';
        readMoreButton.style.display = 'none';
        resetReadMoreButton();
    }

    function loadSCPData(scpId) {
        fetch('scp-data.json')
            .then(response => response.json())
            .then(data => {
                const scpDetails = data[scpId];

                if (scpDetails) {
                    // Update image, subject, class, and containment content
                    scpImage.src = scpDetails.image;
                    scpImage.alt = scpDetails.subject;
                    scpSubject.innerText = `Subject: ${scpDetails.subject}`;
                    scpClass.innerText = `Class: ${scpDetails.class}`;
                    scpContainment.innerText = `Containment: ${scpDetails.containment}`;

                    // Set the title and description for the SCP page
                    pageTitle.innerText = scpDetails.subject;
                    pageDescription.innerText = `Details about ${scpDetails.subject}:`;

                    // Show the buttons on SCP entry pages
                    readAloudButton.style.display = 'inline-block';
                    readMoreButton.style.display = 'inline-block';

                    // Set up text-to-speech for summary with toggle
                    readAloudButton.onclick = () => {
                        if (!isSpeaking) {
                            speech = new SpeechSynthesisUtterance(scpDetails.summary);
                            speechSynthesis.speak(speech);
                            isSpeaking = true;
                            readAloudButton.innerText = "Stop Reading";
                        } else {
                            speechSynthesis.cancel();
                            isSpeaking = false;
                            readAloudButton.innerText = "Read Aloud";
                        }
                    };

                    // "Read More" functionality to toggle content visibility
                    readMoreButton.onclick = () => {
                        if (readMoreContent.style.display === 'block') {
                            // Collapse the content
                            readMoreContent.style.display = 'none';
                            readMoreButton.innerText = "Read More";
                        } else {
                            // Expand the content
                            fetch(scpDetails.content_file)
                                .then(response => response.text())
                                .then(text => {
                                    readMoreContent.innerHTML = text;
                                    readMoreContent.style.display = 'block';
                                    readMoreButton.innerText = "Read Less";  // Change to "Read Less"
                                    styleReadMoreImages();
                                });
                        }
                    };
                } else {
                    console.error(`SCP entry with ID ${scpId} not found in the data.`);
                }
            })
            .catch(error => {
                console.error('Error loading SCP data:', error);
            });
    }

    // Function to style images in "Read More" section
    function styleReadMoreImages() {
        const images = readMoreContent.querySelectorAll('img');
        images.forEach(image => {
            image.style.maxWidth = '60%';
            image.style.margin = '20px auto';
            image.style.display = 'block';
            image.style.border = '2px solid green';
            image.style.borderRadius = '8px';
        });
    }

    // Function to reset the "Read More" button
    function resetReadMoreButton() {
        readMoreButton.innerText = 'Read More';
        readMoreContent.style.display = 'none';
    }

    // Load the home page initially
    loadHomePage();
});
