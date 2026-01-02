/**
 * 💡 script.js - Gram Panchayat Naya Wathoda Website Improvements
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Accessibility: Focus Management for Mobile Navigation ---
    const navToggler = document.querySelector('.navbar-toggler');
    const navCollapse = document.getElementById('mainNavigation');

    if (navToggler && navCollapse) {
        navToggler.addEventListener('click', () => {
            const isExpanded = navToggler.getAttribute('aria-expanded') === 'true' || false;
            navToggler.setAttribute('aria-expanded', !isExpanded);

            // Set focus to the first element inside the dropdown when opened
            if (!isExpanded) {
                // Wait for Bootstrap transition to finish
                setTimeout(() => {
                    const firstLink = navCollapse.querySelector('.nav-link');
                    if (firstLink) {
                        firstLink.focus();
                    }
                }, 350); 
            }
        });
    }

    // --- 2. Performance: Lazy Loading for Images ---
    // Targets images with the 'lazy-load' class and the loading="lazy" attribute (set in HTML)
    
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px 0px 500px 0px', // Start loading 500px before reaching the viewport
            threshold: 0.01 // Start observing very early
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    // The src is already set in HTML with loading="lazy", 
                    // this observer mainly ensures the browser correctly prioritizes.
                    // For maximum compatibility, one might swap a data-src here,
                    // but modern loading="lazy" is sufficient for the requirement.
                    
                    // Simple example of removing the class once loaded (optional)
                    image.classList.remove('lazy-load'); 
                    
                    imageObserver.unobserve(image);
                }
            });
        }, observerOptions);

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }


    // --- 3. Animation: Simple Counter for Key Stats (Optional Enhancment) ---
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200; // The lower, the faster

    const startCounter = (target) => {
        const finalValue = +target.getAttribute('data-target');
        let current = 0;
        
        const updateCount = () => {
            const increment = finalValue / speed;
            if (current < finalValue) {
                current += increment;
                target.innerText = Math.ceil(current).toLocaleString('mr-IN'); // Marathi numbers
                setTimeout(updateCount, 1);
            } else {
                target.innerText = finalValue.toLocaleString('mr-IN');
            }
        };

        updateCount();
    };

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Starts when 50% of the stat is visible

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    } else {
         // Fallback for no IntersectionObserver (just set the final value)
         counters.forEach(counter => {
            counter.innerText = (+counter.getAttribute('data-target')).toLocaleString('mr-IN');
        });
    }

    // --- 4. Land Area Pie Chart using Chart.js ---
    const landAreaChartCanvas = document.getElementById('landAreaChart');
    if (landAreaChartCanvas) {
        const ctx = landAreaChartCanvas.getContext('2d');
        
        const landAreaData = {
            labels: ['पिकाखालील क्षेत्र 🌾', 'गावठाण क्षेत्र 🏘️', 'पोट खराब क्षेत्र ⛰️'],
            datasets: [{
                label: 'क्षेत्रफळ (हेक्टर मध्ये)',
                data: [497, 42.27, 4.35], // Values can be updated here
                backgroundColor: [
                    'rgba(40, 167, 69, 0.85)',  // Professional Green
                    'rgba(228, 119, 18, 0.85)', // Professional Blue
                    'rgba(125, 114, 108, 0.85)' // Professional Grey
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        };

        // Plugin to draw text in the center of the doughnut chart
        const centerTextPlugin = {
            id: 'centerText',
            afterDraw: (chart) => {
                if (chart.config.type !== 'doughnut') return;
                const ctx = chart.ctx;
                const { width, height } = chart;
                const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0).toFixed(2);

                ctx.restore();
                const font_size = (height / 150).toFixed(2);
                ctx.font = `${font_size}rem 'Inter', sans-serif`;
                ctx.textBaseline = 'middle';

                const text = total.toLocaleString('mr-IN');
                const text_x = Math.round((width - ctx.measureText(text).width) / 2);
                const text_y = height / 2 - 15;
                ctx.fillText(text, text_x, text_y);

                ctx.font = `${(font_size / 2).toFixed(2)}rem 'Inter', sans-serif`;
                const sub_text = 'एकूण क्षेत्र (हेक्टर)';
                const sub_text_x = Math.round((width - ctx.measureText(sub_text).width) / 2);
                const sub_text_y = height / 2 + 15;
                ctx.fillText(sub_text, sub_text_x, sub_text_y);
                ctx.save();
            }
        };

        const landAreaChart = new Chart(ctx, {
            type: 'doughnut',
            data: landAreaData,
            plugins: [centerTextPlugin],
            options: {
                cutout: '70%', // Makes the doughnut hole smaller/larger
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed.toLocaleString('mr-IN') + ' हेक्टर';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
});

// --- 5. Simple Image Slider for Homepage ---
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 6000); // 3000ms = 3 seconds mein slide badlegi
}
