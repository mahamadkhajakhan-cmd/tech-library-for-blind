// JavaScript for Medieval India Saints lesson page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeNavigation();
    initializeSaintSections();
    initializeExercises();
    initializeQASection();
    initializeAccessibility();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remove tabindex after focus
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 100);
            }
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', highlightActiveSection);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Saint sections expand/collapse functionality
function initializeSaintSections() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle expanded state
            this.setAttribute('aria-expanded', !isExpanded);
            targetElement.setAttribute('aria-hidden', isExpanded);
            
            // Update button text
            const expandText = this.querySelector('.expand-text');
            if (isExpanded) {
                expandText.textContent = 'Show Details';
            } else {
                expandText.textContent = 'Hide Details';
            }
            
            // Smooth animation by adjusting max-height
            if (!isExpanded) {
                targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
            } else {
                targetElement.style.maxHeight = '0px';
            }
        });
        
        // Keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Exercise functionality
function initializeExercises() {
    const checkAnswersBtn = document.querySelector('.check-answers-btn');
    const fillInputs = document.querySelectorAll('.fill-input');
    
    // Add input event listeners for real-time feedback
    fillInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Clear previous feedback when user starts typing
            const feedback = this.parentElement.querySelector('.feedback');
            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
            this.className = 'fill-input';
        });
        
        // Add keyboard support
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkSingleAnswer(this);
            }
        });
    });
    
    if (checkAnswersBtn) {
        checkAnswersBtn.addEventListener('click', checkAllAnswers);
        
        // Keyboard support
        checkAnswersBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkAllAnswers();
            }
        });
    }
}

function checkSingleAnswer(input) {
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
    const feedback = input.parentElement.querySelector('.feedback');
    
    if (userAnswer === correctAnswer) {
        input.className = 'fill-input correct';
        feedback.textContent = '✓ Correct!';
        feedback.className = 'feedback correct';
    } else if (userAnswer !== '') {
        input.className = 'fill-input incorrect';
        feedback.textContent = '✗ Try again. Hint: ' + correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1, 3) + '...';
        feedback.className = 'feedback incorrect';
    }
}

function checkAllAnswers() {
    const fillInputs = document.querySelectorAll('.fill-input');
    let allCorrect = true;
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    fillInputs.forEach(input => {
        totalQuestions++;
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.getAttribute('data-answer').toLowerCase();
        const feedback = input.parentElement.querySelector('.feedback');
        
        if (userAnswer === correctAnswer) {
            input.className = 'fill-input correct';
            feedback.textContent = '✓ Correct!';
            feedback.className = 'feedback correct';
            correctAnswers++;
        } else {
            input.className = 'fill-input incorrect';
            feedback.textContent = '✗ Correct answer: ' + input.getAttribute('data-answer');
            feedback.className = 'feedback incorrect';
            allCorrect = false;
        }
    });
    
    // Show overall results
    showResults(correctAnswers, totalQuestions);
    
    // Announce results for screen readers
    const resultsMessage = `Results: ${correctAnswers} out of ${totalQuestions} correct.`;
    announceToScreenReader(resultsMessage);
}

function showResults(correct, total) {
    // Remove any existing results
    const existingResults = document.querySelector('.results-summary');
    if (existingResults) {
        existingResults.remove();
    }
    
    // Create results summary
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'results-summary';
    resultsDiv.setAttribute('role', 'status');
    resultsDiv.setAttribute('aria-live', 'polite');
    
    const percentage = Math.round((correct / total) * 100);
    let resultClass = 'info';
    let resultIcon = 'ℹ️';
    
    if (percentage >= 80) {
        resultClass = 'success';
        resultIcon = '🎉';
    } else if (percentage >= 60) {
        resultClass = 'warning';
        resultIcon = '⚠️';
    } else {
        resultClass = 'error';
        resultIcon = '❌';
    }
    
    resultsDiv.innerHTML = `
        <div class="status status--${resultClass}">
            ${resultIcon} Score: ${correct}/${total} (${percentage}%)
            ${percentage >= 80 ? ' - Excellent work!' : 
              percentage >= 60 ? ' - Good job! Review the incorrect answers.' : 
              ' - Keep studying and try again!'}
        </div>
    `;
    
    // Insert results after the check button
    const checkBtn = document.querySelector('.check-answers-btn');
    checkBtn.parentNode.insertBefore(resultsDiv, checkBtn.nextSibling);
}

// Q&A section functionality
function initializeQASection() {
    const qaQuestions = document.querySelectorAll('.qa-question');
    
    qaQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle expanded state
            this.setAttribute('aria-expanded', !isExpanded);
            targetElement.setAttribute('aria-hidden', isExpanded);
            
            // Smooth animation
            if (!isExpanded) {
                targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
            } else {
                targetElement.style.maxHeight = '0px';
            }
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Accessibility enhancements
function initializeAccessibility() {
    // Skip link functionality
    addSkipLink();
    
    // Focus management for modals/expanded content
    manageFocusForExpandedContent();
    
    // Keyboard navigation enhancements
    enhanceKeyboardNavigation();
    
    // Announce page load to screen readers
    announceToScreenReader('Medieval India Saints lesson page loaded. Use navigation to jump to different sections.');
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function manageFocusForExpandedContent() {
    // When content expands, manage focus appropriately
    const expandButtons = document.querySelectorAll('.expand-btn, .qa-question');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    // Focus on first focusable element in expanded content
                    const targetId = this.getAttribute('data-target');
                    const targetElement = document.getElementById(targetId);
                    const firstFocusable = targetElement.querySelector('a, button, input, [tabindex]');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }
            }, 100); // Wait for animation
        });
    });
}

function enhanceKeyboardNavigation() {
    // Add arrow key navigation for saint sections
    const saintHeaders = document.querySelectorAll('.saint-header .expand-btn');
    
    saintHeaders.forEach((header, index) => {
        header.addEventListener('keydown', function(e) {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = (index + 1) % saintHeaders.length;
                    saintHeaders[targetIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = (index - 1 + saintHeaders.length) % saintHeaders.length;
                    saintHeaders[targetIndex].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    saintHeaders[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    saintHeaders[saintHeaders.length - 1].focus();
                    break;
            }
        });
    });
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add debounced scroll handler for better performance
window.addEventListener('scroll', debounce(highlightActiveSection, 100));

// Handle resize events for responsive behavior
window.addEventListener('resize', debounce(function() {
    // Reset any expanded content heights for proper responsive behavior
    const expandedContent = document.querySelectorAll('.saint-details[aria-hidden="false"], .qa-answer[aria-hidden="false"]');
    
    expandedContent.forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
}, 250));

// Service worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Only register if we had a service worker file (we don't in this case)
        console.log('Service worker support detected but not implemented for this lesson page.');
    });
}

// Add print functionality
function setupPrintStyles() {
    window.addEventListener('beforeprint', function() {
        // Expand all content before printing
        const allDetails = document.querySelectorAll('.saint-details, .qa-answer');
        allDetails.forEach(detail => {
            detail.style.maxHeight = 'none';
            detail.style.overflow = 'visible';
            detail.style.padding = '16px';
            detail.setAttribute('aria-hidden', 'false');
        });
    });
}

setupPrintStyles();

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkSingleAnswer,
        checkAllAnswers,
        announceToScreenReader
    };
}