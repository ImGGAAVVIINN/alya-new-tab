document.addEventListener('DOMContentLoaded', () => {
    const toggleBig = document.getElementById('metaToggleBig');

    // Restore toggle state from localStorage
    const toggleState = localStorage.getItem('metaToggleState');
    if (toggleState === 'true') {
        toggleBig.checked = true;
    }

    toggleBig.addEventListener('change', () => {
        const toggleChecked = toggleBig.checked;
        localStorage.setItem('metaToggleState', toggleChecked.toString());
        
        // Communicate with index.html
        if (toggleChecked) {
            localStorage.setItem('metaToggleState', 'true');
        } else {
            removeMetaTagFromIndex();
            localStorage.setItem('metaToggleState', 'false');
        }

        // Add meta tag to redirect to index.html
        addRedirectMetaTag();
    });
});

function removeMetaTagFromIndex() {
    // Assuming the index.html is still open, we'll use localStorage or other means
    // In a real-world scenario, consider using postMessage or other inter-page communication methods
    localStorage.setItem('removeMetaTag', 'true');
}

function addRedirectMetaTag() {
    const newMetaTag = document.createElement('meta');
    newMetaTag.setAttribute('http-equiv', 'Refresh');
    newMetaTag.setAttribute('content', "0; url='index.html'");
    document.head.appendChild(newMetaTag);

    // Quickly remove the meta tag after redirection is initiated
    setTimeout(() => {
        newMetaTag.remove();
    }, 100);
}

window.addEventListener('load', () => {
    const overlay = document.querySelector('.overlay');
    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 0.00001); // Adjust delay if needed
});








  

