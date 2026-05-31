import os
import json
import time
import threading
import urllib.request
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

def clear_leetcode_cache():
    try:
        req = urllib.request.Request("https://leetcard.jacoblin.cool/us/rudarsharma382-cell", method="DELETE")
        with urllib.request.urlopen(req, timeout=5) as response:
            response.read()
    except Exception:
        pass

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/stats')
def stats():
    threading.Thread(target=clear_leetcode_cache).start()
    return render_template('stats.html', timestamp=int(time.time()))

@app.route('/achievements')
def achievements():
    return render_template('achievements.html')

@app.route('/gallery')
def gallery():
    json_path = os.path.join(app.root_path, 'JSON', 'gallery.json')
    with open(json_path, 'r') as f:
        gallery_data = json.load(f)
    
    # Sort data: latest date first (Descending order)
    # Assuming Date format is YYYY-MM-DD
    sorted_gallery = sorted(gallery_data, key=lambda x: x['Date'], reverse=True)
    
    return render_template('gallery.html', gallery=sorted_gallery)

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/connect')
def connect():
    return render_template('connect.html')

@app.route('/coffee')
def coffee():
    return "Comming soon"

@app.route('/src/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(app.root_path, 'src', 'assets'), filename)

if __name__ == '__main__':
    app.run(debug=True)