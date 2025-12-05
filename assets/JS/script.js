let currentSection = 'hero';
let isAnimating = false;

/* INICIALIZACIÓN DE LA APLICACIÓN */

$(document).ready(function() {
    console.log('Portafolio cargado correctamente');
    initializeApp();
});

function initializeApp() {
    // Inicializar todas las funcionalidades
    setupNavigation();
    setupBackButton();
    setupAccordion();
    setupScrollAnimations();
    setupSmoothScroll();
    setupFormValidation();
    setupParallaxEffect();
    setupTypingEffect();
    setupSidebarAutoHide();
    
    // Mostrar hero section por defecto
    showSection('hero');
}

/* 1. NAVEGACIÓN ENTRE SECCIONES */

function setupNavigation() {
    // Event listeners con jQuery para botones de navegación
    $('.nav-btn').on('click', function(e) {
        e.preventDefault();
        
        if (isAnimating) return;
        
        const targetSection = $(this).data('section');
        navigateToSection(targetSection);
        
        // Agregar efecto de click
        $(this).addClass('clicked');
        setTimeout(() => {
            $(this).removeClass('clicked');
        }, 300);
    });
    
    // Navegación desde la barra lateral
    $('.social-link').on('click', function(e) {
        const href = $(this).attr('href');
        
        // Si es un enlace interno (hash)
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = href.substring(1);
            navigateToSection(section);
        }
    });
    
    // Navegación desde el footer
    $('.footer-links a').on('click', function(e) {
        const href = $(this).attr('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = href.substring(1);
            navigateToSection(section);
        }
    });
}

function navigateToSection(sectionId) {
    if (isAnimating || currentSection === sectionId) return;
    
    isAnimating = true;
    
    // Ocultar sección actual con fadeOut
    $(`#${currentSection}`).fadeOut(400, function() {
        // Mostrar nueva sección con fadeIn
        $(`#${sectionId}`).fadeIn(400, function() {
            isAnimating = false;
            currentSection = sectionId;
            
            // Actualizar visibilidad del botón de regreso
            updateBackButtonVisibility();
            
            // Scroll suave al top
            $('html, body').animate({ scrollTop: 0 }, 300);
        });
    });
    
    // Actualizar estado activo de botones
    $('.nav-btn').removeClass('active');
    $(`.nav-btn[data-section="${sectionId}"]`).addClass('active');
}

function showSection(sectionId) {
    $('section').hide();
    $(`#${sectionId}`).fadeIn(600);
    currentSection = sectionId;
}

/* BOTÓN DE REGRESO A HERO */

function setupBackButton() {
    // Crear botón de regreso si no existe
    if (!$('.back-to-hero').length) {
        const backButton = $(`
            <button class="back-to-hero" title="Volver al inicio">
                <i class="fas fa-home"></i>
                <span>Inicio</span>
            </button>
        `);
        
        $('body').append(backButton);
        
        // Event listener para el botón
        backButton.on('click', function() {
            navigateToSection('hero');
            
            // Efecto de click
            $(this).addClass('clicked');
            setTimeout(() => {
                $(this).removeClass('clicked');
            }, 300);
        });
    }
    
    // Mostrar/ocultar según la sección actual
    updateBackButtonVisibility();
}

function updateBackButtonVisibility() {
    if (currentSection !== 'hero') {
        $('.back-to-hero').fadeIn(300);
    } else {
        $('.back-to-hero').fadeOut(300);
    }
}

/* 2. ACORDEÓN DE PROYECTOS */

function setupAccordion() {
    $('.accordion-header').on('click', function() {
        const accordionItem = $(this).parent('.accordion-item');
        const content = accordionItem.find('.accordion-content');
        const icon = $(this).find('.accordion-icon');
        
        // Si ya está abierto, cerrarlo
        if (accordionItem.hasClass('active')) {
            accordionItem.removeClass('active');
            content.slideUp(400);
            icon.css('transform', 'rotate(0deg)');
        } else {
            // Cerrar todos los demás acordeones
            $('.accordion-item').removeClass('active');
            $('.accordion-content').slideUp(400);
            $('.accordion-icon').css('transform', 'rotate(0deg)');
            
            // Abrir el seleccionado
            accordionItem.addClass('active');
            content.slideDown(400);
            icon.css('transform', 'rotate(180deg)');
        }
        
        // Efecto de hover
        accordionItem.css('transform', 'scale(1.02)');
        setTimeout(() => {
            accordionItem.css('transform', 'scale(1)');
        }, 200);
    });
    
    // Hover effects con jQuery
    $('.accordion-header').hover(
        function() {
            $(this).css('background', 'rgba(212, 165, 116, 0.15)');
        },
        function() {
            if (!$(this).parent().hasClass('active')) {
                $(this).css('background', '');
            }
        }
    );
}

/* 3. ANIMACIONES AL SCROLL */

function setupScrollAnimations() {
    // Función para verificar si elemento está visible
    function isInViewport(element) {
        const elementTop = $(element).offset().top;
        const elementBottom = elementTop + $(element).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        
        return elementBottom > viewportTop && elementTop < viewportBottom;
    }
    
    // Animación al hacer scroll
    $(window).on('scroll', function() {
        // Animar skill tags
        $('.skill-tag').each(function() {
            if (isInViewport(this) && !$(this).hasClass('animated')) {
                $(this).addClass('animated');
                $(this).css('opacity', '0').animate({ opacity: 1 }, 600);
            }
        });
        
        // Animar stat items
        $('.stat-item').each(function() {
            if (isInViewport(this) && !$(this).hasClass('animated')) {
                $(this).addClass('animated');
                animateCounter(this);
            }
        });
        
        // Animar timeline items
        $('.timeline-item').each(function(index) {
            if (isInViewport(this) && !$(this).hasClass('animated')) {
                $(this).addClass('animated');
                $(this).css('opacity', '0').delay(index * 200).animate({ opacity: 1 }, 600);
            }
        });
    });
}

/* 4. CONTADOR ANIMADO PARA ESTADÍSTICAS */

function animateCounter(element) {
    const $element = $(element);
    const $number = $element.find('h3');
    const targetText = $number.text();
    
    // Extraer número del texto (ejemplo: "50+" → 50)
    const numberMatch = targetText.match(/\d+/);
    if (!numberMatch) return;
    
    const targetNumber = parseInt(numberMatch[0]);
    const prefix = targetText.match(/^\+/) ? '+' : '';
    const suffix = targetText.match(/\+$/) ? '+' : '';
    
    let currentNumber = 0;
    const increment = targetNumber / 30;
    const duration = 1500;
    const steps = 30;
    const stepDuration = duration / steps;
    
    const counter = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(counter);
        }
        $number.text(prefix + Math.floor(currentNumber) + suffix);
    }, stepDuration);
}

/* 5. SMOOTH SCROLL */

function setupSmoothScroll() {
    // Scroll suave para enlaces internos
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this).attr('href');
        
        if (target !== '#' && $(target).length) {
            e.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(target).offset().top - 80
            }, 800, 'swing');
        }
    });
}

/* 6. VALIDACIÓN DE FORMULARIO */

function setupFormValidation() {
    // Validación del formulario con jQuery
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Limpiar mensajes de error
        $('.error-message').text('').hide();
        
        // Validar nombre
        const name = $('#name').val().trim();
        if (name.length < 3) {
            showError('#name', 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        }
        
        // Validar email
        const email = $('#email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('#email', 'Por favor ingresa un email válido');
            isValid = false;
        }
        
        // Validar mensaje
        const message = $('#message').val().trim();
        if (message.length < 10) {
            showError('#message', 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }
        
        // Si es válido, simular envío
        if (isValid) {
            submitForm({ name, email, message });
        }
    });
    
    // Validación en tiempo real
    $('#contact-form input, #contact-form textarea').on('blur', function() {
        validateField($(this));
    });
}

function showError(fieldSelector, message) {
    const field = $(fieldSelector);
    const errorSpan = field.next('.error-message');
    
    field.addClass('error');
    errorSpan.text(message).fadeIn(300);
}

function validateField($field) {
    const fieldId = $field.attr('id');
    const value = $field.val().trim();
    
    $field.removeClass('error');
    $field.next('.error-message').fadeOut(300);
    
    if (fieldId === 'name' && value.length < 3) {
        showError(`#${fieldId}`, 'Nombre muy corto');
        return false;
    }
    
    if (fieldId === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(`#${fieldId}`, 'Email inválido');
            return false;
        }
    }
    
    if (fieldId === 'message' && value.length < 10) {
        showError(`#${fieldId}`, 'Mensaje muy corto');
        return false;
    }
    
    return true;
}

function submitForm(data) {
    // Ya no necesitamos simular el envío
    // FormSpree se encargará de enviar el email
    // El formulario se enviará normalmente después de pasar la validación
    console.log('Formulario enviado:', data);
}

/* 7. EFECTO PARALLAX SUTIL */

function setupParallaxEffect() {
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        
        // Parallax en waves
        $('.wave').each(function(index) {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            $(this).css('transform', `translateY(${yPos}px)`);
        });
        
        // Parallax en golden lines
        $('.golden-line').each(function(index) {
            const speed = 0.3 + (index * 0.05);
            const yPos = -(scrollTop * speed);
            $(this).css('transform', `translateY(${yPos}px) rotate(${-12 + index * 3}deg)`);
        });
    });
}

/* 8. EFECTO DE ESCRITURA EN HERO */

function setupTypingEffect() {
    const roleText = $('.role-text');
    if (roleText.length) {
        const originalText = roleText.text();
        roleText.text('');
        
        let charIndex = 0;
        const typingSpeed = 100;
        
        function typeChar() {
            if (charIndex < originalText.length) {
                roleText.text(roleText.text() + originalText.charAt(charIndex));
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            }
        }
        
        // Iniciar después de un delay
        setTimeout(typeChar, 1000);
    }
}

/* 9. FILTRO DINÁMICO DE PROYECTOS */

function setupProjectFilter() {
    // Agregar botones de filtro si no existen
    if (!$('.project-filter').length) {
        const filterButtons = $(`
            <div class="project-filter" style="text-align: center; margin-bottom: 2rem;">
                <button class="filter-btn active" data-filter="all">Todos</button>
                <button class="filter-btn" data-filter="web">Web</button>
                <button class="filter-btn" data-filter="mobile">Mobile</button>
                <button class="filter-btn" data-filter="fullstack">Fullstack</button>
            </div>
        `);
        
        $('.projects-accordion').before(filterButtons);
    }
    
    // Event listener para filtros
    $('.filter-btn').on('click', function() {
        const filter = $(this).data('filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filter === 'all') {
            $('.accordion-item').fadeIn(400);
        } else {
            $('.accordion-item').each(function() {
                const projectType = $(this).data('type');
                if (projectType === filter) {
                    $(this).fadeIn(400);
                } else {
                    $(this).fadeOut(400);
                }
            });
        }
    });
}

/* 10. MODO OSCURO/CLARO */

function setupThemeToggle() {
    // Crear botón de tema si no existe
    if (!$('.theme-toggle').length) {
        const themeBtn = $(`
            <button class="theme-toggle" title="Cambiar tema">
                <i class="fas fa-moon"></i>
            </button>
        `);
        
        $('body').append(themeBtn);
    }
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'dark';
    $('body').attr('data-theme', savedTheme);
    
    // Toggle tema
    $('.theme-toggle').on('click', function() {
        const currentTheme = $('body').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('body').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Cambiar ícono
        const icon = $(this).find('i');
        if (newTheme === 'light') {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    });
}

/* 11. TOOLTIP PERSONALIZADO */

function setupTooltips() {
    // Crear tooltip dinámico
    if (!$('.custom-tooltip').length) {
        $('body').append('<div class="custom-tooltip"></div>');
    }
    
    const tooltip = $('.custom-tooltip');
    
    // Elementos con título
    $('[title]').hover(
        function(e) {
            const title = $(this).attr('title');
            $(this).data('original-title', title);
            $(this).removeAttr('title');
            
            tooltip.text(title).fadeIn(200);
            updateTooltipPosition(e);
        },
        function() {
            const title = $(this).data('original-title');
            $(this).attr('title', title);
            tooltip.fadeOut(200);
        }
    ).on('mousemove', function(e) {
        updateTooltipPosition(e);
    });
    
    function updateTooltipPosition(e) {
        tooltip.css({
            left: e.pageX + 15,
            top: e.pageY + 15
        });
    }
}

/* 12. LAZY LOADING DE IMÁGENES */

function setupLazyLoading() {
    // Observador de intersección para lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = $(entry.target);
                    const src = img.data('src');
                    
                    if (src) {
                        img.attr('src', src).removeAttr('data-src');
                        img.addClass('loaded');
                        observer.unobserve(entry.target);
                    }
                }
            });
        });
        
        $('img[data-src]').each(function() {
            imageObserver.observe(this);
        });
    }
}

/* 13. DETECTAR SCROLL PARA HEADER STICKY */

$(window).on('scroll', function() {
    const scrollTop = $(window).scrollTop();
    
    // Mostrar/ocultar botón de scroll to top
    if (scrollTop > 300) {
        if (!$('.scroll-to-top').length) {
            const scrollBtn = $(`
                <button class="scroll-to-top">
                    <i class="fas fa-arrow-up"></i>
                </button>
            `);
            $('body').append(scrollBtn);
            
            scrollBtn.on('click', function() {
                $('html, body').animate({ scrollTop: 0 }, 600);
            });
        }
        $('.scroll-to-top').fadeIn(300);
    } else {
        $('.scroll-to-top').fadeOut(300);
    }
});

// Función para auto-hide sidebar en scroll
function setupSidebarAutoHide() {
    let lastScrollTop = 0;
    let scrollTimeout;
    
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        const sidebar = $('.sidebar');
        
        clearTimeout(scrollTimeout);
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - ocultar sidebar
            sidebar.addClass('hidden');
        } else {
            // Scrolling up - mostrar sidebar
            sidebar.removeClass('hidden');
        }
        
        // Auto-hide después de 2 segundos sin scroll
        scrollTimeout = setTimeout(() => {
            if (scrollTop > 100) {
                sidebar.addClass('hidden');
            }
        }, 2000);
        
        lastScrollTop = scrollTop;
    });
    
    // Mostrar al hover en desktop
    $('.sidebar').on('mouseenter', function() {
        $(this).removeClass('hidden');
    });
}

/* 14. MANEJO DE ERRORES */

window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.message);
});

// Log de inicialización
console.log('%c🚀 Portafolio Iván Jaque', 'color: #D4A574; font-size: 20px; font-weight: bold;');
console.log('%cJavaScript y jQuery cargados correctamente', 'color: #4CAF50;');