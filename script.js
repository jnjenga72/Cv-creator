document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, textarea, select');
    const previewElements = {
        'input-name': document.getElementById('preview-name'),
        'input-title': document.getElementById('preview-title'),
        'input-email': document.getElementById('preview-email'),
        'input-phone': document.getElementById('preview-phone'),
        'input-summary': document.getElementById('preview-summary'),
        'input-skills': document.getElementById('preview-skills'),
        'input-languages': document.getElementById('preview-languages'),
        'input-experience': document.getElementById('preview-experience'),
        'input-projects': document.getElementById('preview-projects'),
        'input-education': document.getElementById('preview-education')
    };

    // Update Preview Function
    function updatePreview(id, value) {
        const preview = previewElements[id];
        if (!preview) return;

        if (['input-skills', 'input-languages', 'input-experience', 'input-projects', 'input-education'].includes(id)) {
            preview.innerHTML = '';
            const items = value.includes(',') ? value.split(',') : value.split('\n');
            items.filter(item => item.trim() !== '').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                preview.appendChild(li);
            });
        } else {
            preview.textContent = value || preview.dataset.placeholder;
        }
        localStorage.setItem(id, value);
    }

    // Event Listeners for inputs
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.id === 'input-color') {
                document.documentElement.style.setProperty('--primary-color', e.target.value);
                localStorage.setItem('theme-color', e.target.value);
            } else if (e.target.id === 'input-template') {
                const cvPaper = document.getElementById('cv-preview');
                cvPaper.className = `cv-paper ${e.target.value}`;
                localStorage.setItem('template', e.target.value);
            } else if (e.target.type !== 'file') {
                updatePreview(e.target.id, e.target.value);
            }
        });
    });

    // Photo Upload
    document.getElementById('input-photo').addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.getElementById('preview-photo');
            img.src = reader.result;
            img.style.display = 'block';
            localStorage.setItem('saved-photo', reader.result);
        }
        if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
    });

    // Print & Reset
    document.getElementById('print-btn').addEventListener('click', () => window.print());
    document.getElementById('reset-btn').addEventListener('click', () => {
        if(confirm('Clear all data?')) {
            localStorage.clear();
            location.reload();
        }
    });

    // Load Saved Data
    Object.keys(previewElements).forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved) {
            document.getElementById(id).value = saved;
            updatePreview(id, saved);
        }
    });
    
    const savedPhoto = localStorage.getItem('saved-photo');
    if(savedPhoto) {
        const img = document.getElementById('preview-photo');
        img.src = savedPhoto;
        img.style.display = 'block';
    }
});