// Configuration
const MANIFEST_FILE = './crosshairs_manifest.json';

// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const downloadBtn = document.getElementById('download-btn');
const closeBtn = document.querySelector('.close');

// State
let crosshairs = [];
let currentCrosshair = null;

// Initialize the gallery
async function initGallery() {
    try {
        await loadCrosshairs();
        setupEventListeners();
    } catch (error) {
        showError('Failed to load crosshairs. Make sure the manifest file exists.');
        console.error('Error loading crosshairs:', error);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    downloadBtn.addEventListener('click', downloadCrosshair);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Load crosshairs from the manifest file
async function loadCrosshairs() {
    try {
        const response = await fetch(MANIFEST_FILE);
        if (!response.ok) {
            throw new Error('Manifest file not found. Run update_crosshairs.py to generate it.');
        }
        
        const manifest = await response.json();
        crosshairs = manifest.crosshairs || [];
        
        if (crosshairs.length === 0) {
            showError('No crosshairs found. Add images to the crosshairs folder and run update_crosshairs.py');
        } else {
            renderGallery();
        }
    } catch (error) {
        console.error('Error loading crosshairs:', error);
        showError('Failed to load crosshairs. Make sure update_crosshairs.py has been run.');
    }
}

// Render the gallery
function renderGallery() {
    if (crosshairs.length === 0) {
        gallery.innerHTML = '<div class="error">No crosshairs found in the crosshairs folder.</div>';
        return;
    }

    gallery.innerHTML = crosshairs.map(crosshair => `
        <div class="crosshair-item" data-crosshair="${crosshair.filename}">
            <div class="crosshair-preview">
                <img src="${crosshair.path}" alt="Crosshair" loading="lazy">
            </div>
            <div class="crosshair-info">
                <p>${crosshair.format.toUpperCase()}</p>
            </div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.crosshair-item').forEach(item => {
        item.addEventListener('click', () => {
            const filename = item.dataset.crosshair;
            const crosshair = crosshairs.find(c => c.filename === filename);
            if (crosshair) {
                openModal(crosshair);
            }
        });
    });
}

// Open modal with crosshair
function openModal(crosshair) {
    currentCrosshair = crosshair;
    modalImage.src = crosshair.path;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentCrosshair = null;
}

// Download crosshair
function downloadCrosshair() {
    if (!currentCrosshair) return;

    const link = document.createElement('a');
    
    if (currentCrosshair.isDemo) {
        // For demo crosshairs, create a downloadable blob
        const svgContent = atob(currentCrosshair.path.split(',')[1]);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        link.href = URL.createObjectURL(blob);
    } else {
        link.href = currentCrosshair.path;
    }
    
    link.download = currentCrosshair.filename;
    link.click();
    
    if (currentCrosshair.isDemo) {
        URL.revokeObjectURL(link.href);
    }
}

// Show error message
function showError(message) {
    gallery.innerHTML = `<div class="error">${message}</div>`;
}



// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGallery);