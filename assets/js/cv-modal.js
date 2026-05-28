
// Event delegation for modal triggers (replaces onclick handlers)
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const trigger = e.target.closest('[data-modal][data-action]');
        if (!trigger) return;
        
        const modalId = trigger.getAttribute('data-modal');
        const action = trigger.getAttribute('data-action');
        
        if (action === 'open') {
            if (window.innerWidth <= 768) {
                const pdfUrl = modalId === 'cv-modal' ? '/files/reddy_cv.pdf' : '/files/reddy_resume.pdf';
                window.open(pdfUrl, '_blank');
                return;
            }
            const modal = document.getElementById(modalId);
            if (modal) {
                const iframe = modal.querySelector('iframe');
                if (iframe) {
                    const isDark = document.documentElement.classList.contains('theme-dark') || 
                                   (document.documentElement.getAttribute('data-active-theme') === 'device' && 
                                    window.matchMedia('(prefers-color-scheme: dark)').matches);
                    iframe.style.colorScheme = isDark ? 'dark' : 'light';
                    if (iframe.getAttribute('src') === 'about:blank') {
                        iframe.setAttribute('src', iframe.getAttribute('data-src'));
                    }
                }
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        } else if (action === 'close') {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                const iframe = modal.querySelector('iframe');
                if (iframe) iframe.setAttribute('src', 'about:blank');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function openModal(id) {
        if (window.innerWidth <= 768) {
            const pdfUrl = id === 'cv-modal' ? '/files/reddy_cv.pdf' : '/files/reddy_resume.pdf';
            window.open(pdfUrl, '_blank');
            return;
        }
        const modal = document.getElementById(id);
        if (modal) {
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                // Dynamically detect if dark mode is active
                const isDark = document.documentElement.classList.contains('theme-dark') || 
                               (document.documentElement.getAttribute('data-active-theme') === 'device' && 
                                window.matchMedia('(prefers-color-scheme: dark)').matches);
                iframe.style.colorScheme = isDark ? 'dark' : 'light';
                
                if (iframe.getAttribute('src') === 'about:blank') {
                    iframe.setAttribute('src', iframe.getAttribute('data-src'));
                }
            }
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                iframe.setAttribute('src', 'about:blank');
            }
        }
    }
    
    // Close on backdrop click
    document.querySelectorAll('.document-modal').forEach(modal => {
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                closeModal(modal.id);
            });
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.document-modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });

    // Spotlight cursor glow effect
    function setupSpotlight() {
        const cards = document.querySelectorAll('.spotlight-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
    
    // Initialize spotlight
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupSpotlight);
    } else {
        setupSpotlight();
    }
});
