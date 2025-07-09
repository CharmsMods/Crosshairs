import os
import json
import glob
from pathlib import Path

def get_supported_formats():
    return ['.png', '.jpg', '.jpeg', '.webp']

def update_crosshairs():
    # Configuration
    crosshairs_dir = os.path.join(os.path.dirname(__file__), 'crosshairs')
    manifest_path = os.path.join(os.path.dirname(__file__), 'crosshairs_manifest.json')
    
    # Create crosshairs directory if it doesn't exist
    os.makedirs(crosshairs_dir, exist_ok=True)
    
    # Get all image files in the directory
    image_files = []
    for ext in get_supported_formats():
        image_files.extend(glob.glob(os.path.join(crosshairs_dir, f'*{ext}')))
    
    # Sort files by name for consistent ordering
    image_files.sort()
    
    # Create manifest data
    manifest = {
        'version': '1.0',
        'last_updated': None,
        'crosshairs': []
    }
    
    # Rename files and update manifest
    for idx, old_path in enumerate(image_files, 1):
        ext = os.path.splitext(old_path)[1].lower()
        new_filename = f'crosshair{idx}{ext}'
        new_path = os.path.join(crosshairs_dir, new_filename)
        
        # Only rename if the filename is different
        if os.path.basename(old_path) != new_filename:
            # Handle potential name conflicts
            counter = 1
            while os.path.exists(new_path):
                new_filename = f'crosshair{idx}_{counter}{ext}'
                new_path = os.path.join(crosshairs_dir, new_filename)
                counter += 1
            
            os.rename(old_path, new_path)
        
        # Add to manifest
        manifest['crosshairs'].append({
            'id': idx,
            'filename': new_filename,
            'path': f'./crosshairs/{new_filename}'
        })
    
    # Update timestamp
    from datetime import datetime
    manifest['last_updated'] = datetime.utcnow().isoformat()
    
    # Save manifest
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"Updated {len(manifest['crosshairs'])} crosshairs in manifest.")
    return manifest

if __name__ == "__main__":
    update_crosshairs()
