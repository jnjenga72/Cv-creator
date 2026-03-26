document.addEventListener('DOMContentLoaded', () => {
    const textInputs = ['name', 'title', 'email', 'phone', 'summary', 'skills', 'languages'];
    const listInputs = ['experience', 'education', 'projects'];

    // Function to save data to localStorage
    const saveData = () => {
        const data = {
            text: {},
            lists: {},
            template: document.getElementById('input-template').value,
            color: document.getElementById('input-color').value,
            photo: document.getElementById('preview-photo').style.display !== 'none' ? document.getElementById('preview-photo').src : null
        };
        textInputs.forEach(id => data.text[id] = document.getElementById(`input-${id}`).value);
        listInputs.forEach(id => data.lists[id] = document.getElementById(`input-${id}`).value);
        localStorage.setItem('cvData', JSON.stringify(data));
    };

    // Auto-summary mapping
    const summaries = {
        'frontend': 'Detail-oriented Frontend Developer with a passion for building responsive and performant web applications using modern JavaScript frameworks.',
        'backend': 'Scalable Backend Engineer focused on API design, database optimization, and high-availability server architecture.',
        'fullstack': 'Versatile Full Stack Developer experienced in both client-side and server-side development, bridging the gap between design and implementation.',
        'manager': 'Results-driven Project Manager with a track record of leading cross-functional teams and delivering complex software projects on time.',
        'designer': 'Creative UI/UX Designer dedicated to crafting intuitive digital experiences through research-driven design and rapid prototyping.'
    };
    
    textInputs.forEach(id => {
        document.getElementById(`input-${id}`).addEventListener('input', (e) => {
            const val = e.target.value;
            
            // Real-time summary generation based on title
            if (id === 'title') {
                const lowerVal = val.toLowerCase();
                for (const key in summaries) {
                    if (lowerVal.includes(key) && !document.getElementById('input-summary').value) {
                        document.getElementById('input-summary').value = summaries[key];
                        document.getElementById('preview-summary').innerText = summaries[key];
                    }
                }
            }

            const previewEl = document.getElementById(`preview-${id}`);
            if (id === 'skills' || id === 'languages') {
                const items = val.split(',').filter(item => item.trim() !== '');
                previewEl.innerHTML = items.map(i => `<li>${i.trim()}</li>`).join('');
            } else {
                previewEl.innerText = val || (id === 'name' ? 'Your Name' : id === 'title' ? 'Professional Title' : '');
            }
            saveData();
        });
    });

    listInputs.forEach(id => {
        document.getElementById(`input-${id}`).addEventListener('input', (e) => {
            const listElement = document.getElementById(`preview-${id}`);
            const lines = e.target.value.split('\n').map(line => line.trim()).filter(line => line !== '');
            listElement.innerHTML = lines.map(line => `<li>${line}</li>`).join('');
            saveData();
        });
    });

    // Photo Upload
    document.getElementById('input-photo').addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function() {
            const img = document.getElementById('preview-photo');
            img.src = reader.result;
            img.style.display = 'block';
            saveData();
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // Color Picker
    document.getElementById('input-color').addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
        saveData();
    });

    // Template Switcher
    document.getElementById('input-template').addEventListener('change', (e) => {
        const cv = document.getElementById('cv-preview');
        cv.className = 'cv-paper ' + e.target.value;
        saveData();
    });

    // Load data from localStorage
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // 1. Populate values first (prevents auto-summary overwriting loaded data)
        textInputs.forEach(id => {
            if (data.text[id]) document.getElementById(`input-${id}`).value = data.text[id];
        });
        listInputs.forEach(id => {
            if (data.lists[id]) document.getElementById(`input-${id}`).value = data.lists[id];
        });

        // 2. Trigger UI updates via events
        textInputs.forEach(id => document.getElementById(`input-${id}`).dispatchEvent(new Event('input')));
        listInputs.forEach(id => document.getElementById(`input-${id}`).dispatchEvent(new Event('input')));

        if (data.template) {
            const select = document.getElementById('input-template');
            select.value = data.template;
            select.dispatchEvent(new Event('change'));
        }
        if (data.color) {
            const picker = document.getElementById('input-color');
            picker.value = data.color;
            picker.dispatchEvent(new Event('input'));
        }
        if (data.photo && data.photo.startsWith('data:image')) {
            const img = document.getElementById('preview-photo');
            img.src = data.photo;
            img.style.display = 'block';
        }
    }

    // Reset CV Data Logic
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all progress and start over? This action cannot be undone.')) {
            localStorage.removeItem('cvData');
            window.location.reload();
        }
    });

    // PWA Installation Logic
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'block';
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });
});

// Register Service Worker for Deployment
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log("SW failed", err));
}