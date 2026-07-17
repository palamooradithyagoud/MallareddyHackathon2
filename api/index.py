import sys
import os

# Add the backend directory to the Python path so imports resolve as `from app.*`
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, os.path.abspath(_backend_dir))

from app.main import app
