import os
import json
import glob
from pathlib import Path
from datetime import datetime

def get_supported_formats():
    return ['.png', '.jpg', '.jpeg', '.webp']

def update_assets(asset_type):
    """Update assets for a specific type (crosshairs or scopes)"""
    # Configuration
    assets_dir = os.path.join(os.path.dirname(__file__), asset_type)
    manifest_path = os.path.join(os.path.dirname(__file__), f'{asset_type}_manifest.json')
    
    # Create assets directory if it doesn't exist
    os.makedirs(assets_dir, exist_ok=True)
    
    # Get all image files in the directory
    image_files = []
    for ext in get_supported_formats():
        image_files.extend(glob.glob(os.path.join(assets_dir, f'*{ext}')))
    
    # Sort files by name for consistent ordering
    image_files.sort()
    
    # Create manifest data
    manifest = {
        'version': '1.0',
        'last_updated': None,
        asset_type: []
    }
    
    # Rename files and update manifest
    singular_name = asset_type[:-1]  # Remove 's' from plural (crosshairs -> crosshair)
    for idx, old_path in enumerate(image_files, 1):
        ext = os.path.splitext(old_path)[1].lower()
        new_filename = f'{singular_name}{idx}{ext}'
        new_path = os.path.join(assets_dir, new_filename)
        
        # Only rename if the filename is different
        if os.path.basename(old_path) != new_filename:
            # Handle potential name conflicts
            counter = 1
            while os.path.exists(new_path):
                new_filename = f'{singular_name}{idx}_{counter}{ext}'
                new_path = os.path.join(assets_dir, new_filename)
                counter += 1
            
            os.rename(old_path, new_path)
        
        # Add to manifest
        manifest[asset_type].append({
            'id': idx,
            'filename': new_filename,
            'path': f'./{asset_type}/{new_filename}'
        })
    
    # Update timestamp
    manifest['last_updated'] = datetime.utcnow().isoformat()
    
    # Save manifest
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"Updated {len(manifest[asset_type])} {asset_type} in manifest.")
    return manifest

def update_all_assets():
    """Update both crosshairs and scopes"""
    crosshairs_manifest = update_assets('crosshairs')
    scopes_manifest = update_assets('scopes')
    
    print("\n=== Summary ===")
    print(f"Crosshairs: {len(crosshairs_manifest['crosshairs'])} files")
    print(f"Scopes: {len(scopes_manifest['scopes'])} files")

if __name__ == "__main__":
    update_all_assets()
