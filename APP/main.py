import os
import sys
import http.server
import socketserver

# Determine paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__)) # APP folder
BASE_DIR = os.path.dirname(ROOT_DIR) # Root folder
DIRECTORY = os.path.join(BASE_DIR, "frontend", "dist")

# If the React dist folder is not generated yet, let's gracefully create a placeholder
if not os.path.exists(DIRECTORY):
    os.makedirs(DIRECTORY, exist_ok=True)
    with open(os.path.join(DIRECTORY, "index.html"), "w") as f:
        f.write("<h1>Compiling React Frontend... Please wait a few seconds and reload the page!</h1>")

# Run simple HTTP Server on port 8081 serving the React Vite build
PORT = 8081
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Allow port reuse to avoid '[Errno 98] Address already in use'
socketserver.TCPServer.allow_reuse_address = True
print(f"Serving React Frontend from {DIRECTORY} at port {PORT}")
try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except Exception as e:
    print(f"Server error: {e}")
    sys.exit(1)
