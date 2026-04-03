#!/bin/bash

echo "🎮 Starting Plinko Game Server..."
echo ""

if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first:"
    echo "   python3 -m venv venv"
    echo "   source venv/bin/activate"
    echo "   pip install -r requirements.txt"
    exit 1
fi

source venv/bin/activate

echo "✅ Virtual environment activated"
echo "🚀 Starting FastAPI server on http://127.0.0.1:8000"
echo ""
echo "   Open http://127.0.0.1:8000 in your browser to play!"
echo ""
echo "   Press CTRL+C to stop the server"
echo ""

python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
