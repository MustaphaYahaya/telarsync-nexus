document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const views = document.querySelectorAll('.view');
    const mainContent = document.querySelector('.main-content');

    function showView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            mainContent.scrollTop = 0; // Reset scroll position
        }
    }

    function handleNavClick(event) {
        event.preventDefault();
        const viewId = event.currentTarget.getAttribute('href').substring(1);
        
        // Update active class on nav links
        navLinks.forEach(link => link.classList.remove('active'));
        // We need to set active on both sidebar and bottom nav if they exist
        document.querySelectorAll(`nav a[href="#${viewId}"]`).forEach(link => link.classList.add('active'));

        showView(viewId);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Show initial view
    const initialViewId = 'dashboard';
    document.querySelectorAll(`nav a[href="#${initialViewId}"]`).forEach(link => link.classList.add('active'));
    showView(initialViewId);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }
});
