# Use official Python lightweight image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Cloud Run expects the server to run on port 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]