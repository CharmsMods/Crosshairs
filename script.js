// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close');
const downloadBtn = document.getElementById('download-btn');

// State
let currentCrosshair = null;

// Load crosshairs from the manifest file
async function loadCrosshairs() {
    try {
        gallery.innerHTML = '<div class="loading">Loading crosshairs...</div>';
        
        const response = await fetch('crosshairs_manifest.json');
        if (!response.ok) throw new Error('Manifest not found');
        
        const data = await response.json();
        if (!data.crosshairs || data.crosshairs.length === 0) {
            throw new Error('No crosshairs found');
        }
        
        displayCrosshairs(data.crosshairs);
    } catch (error) {
        console.error('Error:', error);
        gallery.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Display crosshairs in the gallery
function displayCrosshairs(crosshairs) {
    gallery.innerHTML = '';
    
    crosshairs.forEach(crosshair => {
        const item = document.createElement('div');
        item.className = 'crosshair-item';
        item.innerHTML = `
            <div class="crosshair-preview">
                <img src="${crosshair.path}" alt="${crosshair.filename}">
            </div>
            <div class="crosshair-info">
                <p>${crosshair.filename}</p>
            </div>
        `;
        
        item.addEventListener('click', () => openModal(crosshair));
        gallery.appendChild(item);
    });
}

// Open modal with crosshair
function openModal(crosshair) {
    currentCrosshair = crosshair;
    modalImg.src = crosshair.path;
    modalTitle.textContent = crosshair.filename;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Download crosshair
function downloadCrosshair() {
    if (!currentCrosshair) return;
    const link = document.createElement('a');
    link.href = currentCrosshair.path;
    link.download = currentCrosshair.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listeners
closeBtn.addEventListener('click', closeModal);
downloadBtn.addEventListener('click', downloadCrosshair);

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Initial load
document.addEventListener('DOMContentLoaded', loadCrosshairs);