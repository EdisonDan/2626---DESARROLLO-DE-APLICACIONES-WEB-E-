// script.js - Proyecto Integrador
// Funcionalidades generales del sistema

document.addEventListener('DOMContentLoaded', function () {

    // Marcar enlace activo en el navbar segun la URL actual
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
            link.style.backgroundColor = 'rgba(255,255,255,0.15)';
        }
    });

    // Animacion de entrada para las tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });

    // Animacion de entrada para filas de tabla
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transition = `opacity 0.3s ease ${index * 0.05}s`;
        setTimeout(() => {
            row.style.opacity = '1';
        }, 100);
    });

});
