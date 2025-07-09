from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Configuration
CROSSHAIRS_FOLDER = os.path.join(os.path.dirname(__file__), 'crosshairs')

# Ensure crosshairs folder exists
os.makedirs(CROSSHAIRS_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/crosshairs/<path:filename>')
def serve_crosshair(filename):
    return send_from_directory(CROSSHAIRS_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
