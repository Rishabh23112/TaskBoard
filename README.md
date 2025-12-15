# Task Board

A minimalist, "Zen"-style task board app with a celebration mode.

###Video


https://github.com/user-attachments/assets/91597110-70d4-4107-9ba9-d78ea2184d02






### Local (Two Terminals)

1.  **Backend (Terminal 1)**:
    ```bash
    pip install -r requirements.txt
    python main.py
    ```
    *Runs on http://localhost:8000*

2.  **Frontend (Terminal 2)**:
    ```bash
    npm install
    npm run dev
    ```
    *Runs on http://localhost:5173 (or similar)*



## 🛠️ Features

- **FastAPI Backend**: In-memory task management.
- **React + Tailwind Frontend**: Beautiful, clean UI.
- **Zen Mode**: Hit 100% completion for a confetti celebration and zen quote.
- **CORS Configured**: Ready for separate frontend/backend hosts.

## 📂 Project Structure

- `main.py`: Backend entry point.
- `src/App.jsx`: Frontend logic and UI.
- `src/index.css`: Tailwind styles.
