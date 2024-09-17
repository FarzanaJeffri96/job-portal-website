document.addEventListener('DOMContentLoaded', () => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/test", true);
    xhr.onload = function() {
        console.log('Test endpoint response:', xhr.responseText);
    };
    xhr.send();
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const contact = { name, email, subject, message };

        xhr.open("PUT", "http://localhost:3000/api/contacts", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                const response = JSON.parse(this.responseText);
                alert(response.message);
            } else {
                console.error('Error:', this.responseText);
                console.error('Error:', this.statusText);
                alert(`Error: ${this.responseText}`);
            }
        };

        xhr.onerror = function() {
            console.error('Request failed. Status:', xhr.status);
            console.error('Request response:', xhr.responseText);
            alert('Request failed. Please check your network connection or try again later.');
        };

        xhr.send(JSON.stringify(contact));
    });
});
