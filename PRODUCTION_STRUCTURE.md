# ==============================================================================
# TATA STEEL AI HACKATHON 2026 - PRODUCTION FOLDER STRUCTURE
# ==============================================================================
# This file serves as an index of the production folder architecture.
#
# steel-defect-detection-ai/
# ├── .env.example                 # Environment variable configurations
# ├── requirements.txt             # High-performance industrial ML dependencies
# ├── Dockerfile                   # Multi-stage production container
# ├── docker-compose.yml           # Local multi-service orchestration (FastAPI + Postgres)
# ├── README.md                    # Comprehensive executive summary & quickstart
# ├── backend/
# │   ├── Dockerfile
# │   └── app/
# │       ├── __init__.py
# │       ├── main.py              # FastAPI High-Performance async engine
# │       ├── database.py          # PostgreSQL enterprise logger schemas
# │       ├── schemas.py           # Strict Pydantic payload models
# │       └── config.py            # Hardware-accelerated configuration (CUDA/ONNX)
# ├── ml/
# │   ├── __init__.py
# │   ├── model.py                # ResNet defect classifier architecture
# │   ├── train.py                # PyTorch training, evaluation & metrics logger
# │   ├── preprocess.py           # Industrial OpenCV filtering & contour analysis
# │   └── export.py               # Optimized ONNX runtime export script
# └── frontend/
#     └── app.py                  # Live Streamlit industrial operator control panel
# ==============================================================================
