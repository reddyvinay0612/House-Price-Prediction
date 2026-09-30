"""
Convenience launcher to run the House Price Prediction Website and auto-open browser.
"""

import os
import sys
import time
import webbrowser
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import uvicorn


def main():
    port = 8000
    host = "127.0.0.1"
    url = f"http://{host}:{port}"
    print("=" * 70)
    print("  🏡 ESTATEAI - HOUSE PRICE PREDICTION & VALUATION WEB SYSTEM")
    print("=" * 70)
    print(f"  Starting web server at: {url}")
    print("  Opening web browser...")
    print("=" * 70)

    # Open browser automatically after a short delay
    def open_browser():
        time.sleep(1.2)
        webbrowser.open(url)

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Run Uvicorn server
    uvicorn.run("web.server:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    main()
