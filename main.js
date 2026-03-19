/**
 * Checkout Studios - Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Scroll Animations --- */

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class that triggers the CSS animation
                entry.target.classList.add('is-visible');

                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Start observing
    animatedElements.forEach(el => observer.observe(el));


    /* --- Mouse Tracking for Glass Card --- */
    const mockupCard = document.querySelector('.mockup-card');
    let isMouseTrackingEnabled = false;

    if (mockupCard) {
        // Only track mouse when card is visible to save CPU
        const mouseObserver = new IntersectionObserver((entries) => {
            isMouseTrackingEnabled = entries[0].isIntersecting;
        }, { threshold: 0.1 });
        mouseObserver.observe(mockupCard);

        document.addEventListener('mousemove', (e) => {
            if (!isMouseTrackingEnabled) return;

            const rect = mockupCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x > -100 && x < rect.width + 100 && y > -100 && y < rect.height + 100) {
                const vaporOverlay = mockupCard.querySelector('.vapor-overlay');
                if (vaporOverlay) {
                    vaporOverlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 243, 255, 0.4) 0%, rgba(255, 0, 234, 0.1) 40%, transparent 70%)`;
                }
            } else {
                const vaporOverlay = mockupCard.querySelector('.vapor-overlay');
                if (vaporOverlay) {
                    vaporOverlay.style.background = `linear-gradient(135deg, rgba(0, 243, 255, 0.1), transparent, rgba(255, 0, 234, 0.1))`;
                }
            }
        });
    }

    /* --- Pricing Toggle (Optional) --- */
    const maintOptions = document.querySelectorAll('.maint-option');
    maintOptions.forEach(option => {
        option.addEventListener('click', () => {
            maintOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    /* --- WooCommerce Conversions Animation --- */
    const avatars = ['👨‍🚀', '👩‍🎤', '🧑‍💻', '👨‍💼', '👩‍🔬', '🧔‍♂️', '👱‍♀️', '👨‍🎓', '👩‍🏫', '🕵️‍♂️', '👨‍🎨', '👩‍🚀'];
    let wooAnimInterval;

    function spawnAvatar() {
        const container = document.querySelector('.animation-container');
        const layer = document.getElementById('avatarsLayer');
        if (!container || !layer) return;

        const avatar = document.createElement('div');
        avatar.className = 'moving-avatar';
        avatar.innerText = avatars[Math.floor(Math.random() * avatars.length)];

        layer.appendChild(avatar);

        const cw = container.clientWidth;

        // Center is now ~125px based on 250px container height
        const paths = [
            { startY: 125, endY: 75 },
            { startY: 125, endY: 125 },
            { startY: 125, endY: 175 }
        ];

        const path = paths[Math.floor(Math.random() * paths.length)];
        const jitter = Math.random() * 30 - 15;
        const startY = path.startY + jitter;
        const endY = path.endY;

        // Slowed down animation duration (4s to 6s)
        const duration = 4000 + Math.random() * 2000;

        const animation = avatar.animate([
            { transform: `translate(0px, ${startY}px) scale(0)`, opacity: 0 },
            { transform: `translate(${cw * 0.15}px, ${startY + (endY - startY) * 0.3}px) scale(1)`, opacity: 1, offset: 0.15 },
            { transform: `translate(${cw * 0.4}px, ${startY + (endY - startY) * 0.8}px) scale(1)`, opacity: 1, offset: 0.85 },
            { transform: `translate(${cw * 0.5}px, ${endY}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });

        // Trigger the order card slightly BEFORE the avatar finishes to remove the visual gap
        setTimeout(() => {
            spawnOrderCard(endY);
        }, duration * 0.92);

        animation.onfinish = () => {
            avatar.remove();

            // Pulse the WooCommerce logo slightly on impact
            const wooCenter = document.querySelector('.woo-center');
            if (wooCenter) {
                wooCenter.animate([
                    { transform: 'scale(1)', boxShadow: '0 0 40px rgba(150, 88, 138, 0.4)' },
                    { transform: 'scale(1.05)', boxShadow: '0 0 60px rgba(150, 88, 138, 0.8)', offset: 0.2 },
                    { transform: 'scale(1)', boxShadow: '0 0 40px rgba(150, 88, 138, 0.4)' }
                ], { duration: 300, easing: 'ease-out' });
            }
        };
    }

    function spawnOrderCard(centerY) {
        const container = document.querySelector('.animation-container');
        const layer = document.getElementById('ordersLayer');
        if (!container || !layer) return;

        const card = document.createElement('div');
        card.className = 'order-card';

        const price = (Math.random() * 150 + 20).toFixed(2);

        card.innerHTML = `
            <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" class="woo-icon-small" stroke="currentColor">
                    <path d="M21.5 5.5H2.5C1.67157 5.5 1 6.17157 1 7V17C1 17.8284 1.67157 18.5 2.5 18.5H7.5L12 23L16.5 18.5H21.5C22.3284 18.5 23 17.8284 23 17V7C23 6.17157 22.3284 5.5 21.5 5.5Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="card-details">
                <span class="card-title">Nuevo pedido</span>
                <span class="card-amount">WooCommerce • ${price}€</span>
            </div>
        `;

        layer.appendChild(card);

        const cw = container.clientWidth;

        const paths = [
            { startY: 125, endY: 75 },
            { startY: 125, endY: 125 },
            { startY: 125, endY: 175 }
        ];

        const path = paths[Math.floor(Math.random() * paths.length)];
        const jitter = Math.random() * 30 - 15;
        const endY = path.endY + jitter;

        // Even slower and smoother order card duration (5.5s to 7.5s)
        const duration = 5500 + Math.random() * 2000;

        const animation = card.animate([
            { transform: `translate(${cw * 0.5}px, ${centerY}px) scale(0)`, opacity: 0 },
            // Emerges much slower and smoother (offset 0.25)
            { transform: `translate(${cw * 0.65}px, ${centerY + (endY - centerY) * 0.25}px) scale(1)`, opacity: 1, offset: 0.25 },
            // Hangs around longer across the screen
            { transform: `translate(${cw * 0.85}px, ${centerY + (endY - centerY) * 0.75}px) scale(1)`, opacity: 1, offset: 0.8 },
            { transform: `translate(${cw}px, ${endY}px) scale(0.6)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out', // Smoother deceleration curve so it doesn't "shoot" out
            fill: 'forwards'
        });

        animation.onfinish = () => {
            card.remove();
        };
    }

    const wooSection = document.querySelector('.woo-animation-section');
    if (wooSection) {
        let isWooAnimRunning = true;

        function queueNextAvatar() {
            if (!isWooAnimRunning) return;
            // Organic random delay between 1.5s and 4.5s
            const nextDelay = 1500 + Math.random() * 3000;
            setTimeout(() => {
                spawnAvatar();
                queueNextAvatar();
            }, nextDelay);
        }

        // Spawn first one immediately so it's not empty
        setTimeout(spawnAvatar, 100);
        // Start the organic queue
        queueNextAvatar();
    }

    // --- ROI Calculator Logic ---
    const revenueInput = document.getElementById('calc-revenue');
    const ordersInput = document.getElementById('calc-orders');
    const improvementInput = document.getElementById('calc-improvement');

    // Number Input Nodes (formerly just text labels)
    const valRevenueNode = document.getElementById('val-revenue');
    const valOrdersNode = document.getElementById('val-orders');
    const valImprovementNode = document.getElementById('val-improvement');

    // Result Nodes
    const resultExtra = document.getElementById('calc-result-extra');
    const projectedConv = document.getElementById('calc-projected-conv');
    const totalRevenueNode = document.getElementById('calc-total-revenue');
    const roiMonthsNode = document.getElementById('calc-roi-months');

    if (revenueInput && ordersInput && improvementInput && resultExtra) {

        const currencyFormatter = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        });
        const numberFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });

        function updateSliderTrack(slider, isCyan = false) {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            const value = parseFloat(slider.value) || 0;

            // Protect against dividing by zero
            const range = max - min;
            let percent = 0;
            if (range > 0) {
                percent = ((value - min) / range) * 100;
            }
            // Cap percent between 0 and 100
            percent = Math.max(0, Math.min(100, percent));

            const color = isCyan ? 'rgba(39, 201, 237, 0.8)' : 'rgba(107, 98, 255, 0.8)';
            slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, rgba(255, 255, 255, 0.1) ${percent}%, rgba(255, 255, 255, 0.1) 100%)`;
        }

        // Synchronization logic
        function syncSliderToInput(slider, inputField) {
            inputField.value = slider.value;
        }

        function syncInputToSlider(inputField, slider) {
            let val = parseFloat(inputField.value) || 0;
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;

            // Only clamp the value if it exceeds bounds, but don't force a user typing "1" to immediately become "5000" while they are mid-typing.
            // For a smooth experience, we'll clamp it gently or let the slider reflect the partial state.
            if (val > max) val = max;
            if (val < min) val = min;

            slider.value = val;
            updateSliderTrack(slider, slider.id === 'calc-improvement');
            calculateROI();
        }

        function calculateROI() {
            // Priority given to the sliders
            const revenue = parseFloat(revenueInput.value) || 0;
            const orders = parseFloat(ordersInput.value) || 0;
            const improvementPct = parseFloat(improvementInput.value) || 0;

            // Math computations
            // Derived AOV
            let aov = 0;
            if (orders > 0) {
                aov = revenue / orders;
            }

            // The improvement means X% MORE revenue/orders.
            const liftMultiplier = improvementPct / 100;
            const extraRev = revenue * liftMultiplier;
            const extraOrders = orders * liftMultiplier;

            // Update the CSS Track Colors
            updateSliderTrack(revenueInput);
            updateSliderTrack(ordersInput);
            updateSliderTrack(improvementInput, true);

            // Update DOM Results
            resultExtra.textContent = currencyFormatter.format(extraRev);
            if (totalRevenueNode) {
                const totalRev = revenue + extraRev;
                totalRevenueNode.textContent = currencyFormatter.format(totalRev);
            }
            if (projectedConv) {
                // If they had a conversion rate displayed somewhere we could update it, 
                // but we removed the conversion input. We will hide or repurpose that node if still in HTML.
                // Just keeping it safe here in case you want to show AOV instead.
                projectedConv.textContent = currencyFormatter.format(aov);
            }

            if (roiMonthsNode) {
                let roiText = "";
                if (extraRev <= 0) {
                    roiText = "---";
                } else {
                    const monthsToPayback = 1999 / extraRev;
                    if (monthsToPayback <= 1) {
                        roiText = "Mes 1";
                    } else {
                        roiText = "Mes " + Math.ceil(monthsToPayback);
                    }
                }
                roiMonthsNode.textContent = roiText;
            }
        }

        // Attach listeners to Sliders
        revenueInput.addEventListener('input', () => {
            syncSliderToInput(revenueInput, valRevenueNode);
            calculateROI();
        });
        ordersInput.addEventListener('input', () => {
            syncSliderToInput(ordersInput, valOrdersNode);
            calculateROI();
        });
        improvementInput.addEventListener('input', () => {
            syncSliderToInput(improvementInput, valImprovementNode);
            calculateROI();
        });

        // Attach listeners to Number Inputs
        valRevenueNode.addEventListener('input', () => {
            syncInputToSlider(valRevenueNode, revenueInput);
        });
        valOrdersNode.addEventListener('input', () => {
            syncInputToSlider(valOrdersNode, ordersInput);
        });
        valImprovementNode.addEventListener('input', () => {
            syncInputToSlider(valImprovementNode, improvementInput);
        });

        // Initial calculation
        calculateROI();
    }

    /* --- Storage Helper --- */
    const safeStorage = {
        get: (key) => {
            try { return localStorage.getItem(key); }
            catch (e) { return null; }
        },
        set: (key, val) => {
            try { localStorage.setItem(key, val); return true; }
            catch (e) { return false; }
        }
    };

    /* --- Cookie Consent & DataLayer Logic --- */
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    const openSettingsBtn = document.getElementById('open-cookie-settings');

    function updateConsent(status) {
        safeStorage.set('cookieConsent', status);
        
        // Consent Mode v2 Update
        const consentData = status === 'accepted' ? {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'analytics_storage': 'granted'
        } : {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied'
        };
        
        if (typeof gtag === 'function') {
            gtag('consent', 'update', consentData);
        }

        // Push to Data Layer for GTM
        window.dataLayer.push({
            'event': 'cookie_consent',
            'consent_status': status,
            'timestamp': new Date().toISOString()
        });
        
        if (cookieBanner) cookieBanner.style.display = 'none';
    }

    if (cookieBanner) {
        const consent = safeStorage.get('cookieConsent');
        
        // Always push current state to dataLayer on load if it exists
        if (consent) {
            // Update consent mode if already accepted
            if (consent === 'accepted' && typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
            }
            
            window.dataLayer.push({
                'event': 'cookie_consent_loaded',
                'consent_status': consent
            });
        }

        // Show banner if no consent
        if (!consent) {
            setTimeout(() => {
                cookieBanner.style.display = 'block';
            }, 800);
        }

        if (acceptBtn) acceptBtn.addEventListener('click', () => updateConsent('accepted'));
        if (declineBtn) declineBtn.addEventListener('click', () => updateConsent('declined'));

        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                cookieBanner.style.display = 'block';
                cookieBanner.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });
        }
    }
});

/* === LIGHTBOX === */
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.src = src;
    lb.classList.add('lb-active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('lb-active');
    document.body.style.overflow = '';
}

// Close with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
