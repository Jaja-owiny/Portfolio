// Mocking DOM elements for testing
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Portfolio Functionality', () => {
    let dom, document, window;

    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: "dangerously" });
        document = dom.window.document;
        window = dom.window;
    });

    test('Terminal tab switching should update classes', () => {
        // Logic from switchTab()
        const aboutTab = document.getElementById('tab-about');
        const skillsTab = document.getElementById('tab-skills');
        
        // Initial state check
        expect(aboutTab.classList.contains('border-luxury-gold')).toBe(true);
        
        // Mock switchTab call
        window.switchTab('skills');
        
        expect(aboutTab.classList.contains('border-luxury-gold')).toBe(false);
        expect(skillsTab.classList.contains('border-luxury-gold')).toBe(true);
    });

    test('Contact form validation should fail with wrong captcha', () => {
        const form = document.getElementById('contact-form');
        const captchaInput = document.getElementById('captcha-input');
        const formStatus = document.getElementById('form-status');

        // Set wrong value
        captchaInput.value = 'WRONG';
        
        // Dispatch submit event
        form.dispatchEvent(new window.Event('submit'));

        expect(formStatus.classList.contains('hidden')).toBe(false);
        expect(formStatus.textContent).toMatch(/Verification Failure/);
    });
});
