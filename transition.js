document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-recognition').addEventListener('click', function() {
        var targetElement = document.getElementById('target-section');
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});
