document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
});

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Here you would typically send the form data to your backend
    alert('Thank you for your message! I will get back to you soon.');
    event.target.reset();
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
} 