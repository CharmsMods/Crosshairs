// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close');
const downloadBtn = document.getElementById('download-btn');
const tabButtons = document.querySelectorAll('.tab-button');

// State
let currentAsset = null;
let currentTab = 'crosshairs';

// Load assets from the manifest file
async function loadAssets(type = 'crosshairs') {
    try {
        gallery.innerHTML = `<div class="loading">Loading ${type}...</div>`;
        
        const manifestFile = type === 'crosshairs' ? 'crosshairs_manifest.json' : 'scopes_manifest.json';
        const response = await fetch(manifestFile);
        if (!response.ok) throw new Error(`${type} manifest not found`);
        
        const data = await response.json();
        const assets = data[type] || [];
        if (assets.length === 0) {
            throw new Error(`No ${type} found`);
        }
        
        displayAssets(assets);
    } catch (error) {
        console.error('Error:', error);
        gallery.innerHTML = `<div class="error">${error.message}</div>`;
    }
}

// Display assets in the gallery
function displayAssets(assets) {
    gallery.innerHTML = '';
    
    assets.forEach(asset => {
        const item = document.createElement('div');
        item.className = 'crosshair-item';
        item.innerHTML = `
            <div class="crosshair-preview">
                <img src="${asset.path}" alt="${asset.filename}">
            </div>
        `;
        
        item.addEventListener('click', () => openModal(asset));
        gallery.appendChild(item);
    });
}

// Open modal with asset
function openModal(asset) {
    currentAsset = asset;
    modalImg.src = asset.path;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Download asset
function downloadAsset() {
    if (!currentAsset) return;
    const link = document.createElement('a');
    link.href = currentAsset.path;
    
    // Get file extension from original filename
    const extension = currentAsset.filename.split('.').pop();
    const prefix = currentTab === 'crosshairs' ? 'Crosshair-charm' : 'Scope-charm';
    link.download = `${prefix}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Tab switching
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Load assets for the selected tab
    loadAssets(tabName);
}

// Event listeners
closeBtn.addEventListener('click', closeModal);
downloadBtn.addEventListener('click', downloadAsset);

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => loadAssets('crosshairs'));