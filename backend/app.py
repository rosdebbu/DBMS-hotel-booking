from flask import Flask
from flask_cors import CORS
from config import Config
from routes.guest_routes import guest_bp
from routes.admin_routes import admin_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for the frontend origin
CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

# Register Blueprints
app.register_blueprint(guest_bp)
app.register_blueprint(admin_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
