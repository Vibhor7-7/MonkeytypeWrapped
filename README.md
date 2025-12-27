# MonkeyType Wrapped

Your year in typing, beautifully visualized. Upload your MonkeyType data and get a personalized "Spotify Wrapped" style breakdown of your typing stats.

![MonkeyType Wrapped Preview](preview.png)

## ✨ Features

- **11-slide animated presentation** of your typing year
- **ML-powered persona detection** — discover your typing "modes" using clustering
- **Warmup curve analysis** — see how your performance changes within sessions
- **Timing insights** — find your peak typing hours and best days
- **Shareable summary card** — flex your stats

## 🛠 Tech Stack

**Frontend**
- Next.js + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (visualizations)

**Backend**
- Python + FastAPI
- Pandas & NumPy (data processing)
- Scikit-learn (clustering/ML)

## 📊 Stats We Calculate

| Category | Examples |
|----------|----------|
| Core | Total tests, time spent, characters typed |
| Journey | Improvement over time, best month, longest streak |
| Peak Performance | All-time PB, perfect accuracy count |
| Timing | Best/worst hours, night owl vs early bird |
| Persona | Flow State, Burst Typer, Steady Eddie (via K-means) |
| Warmup | Cold start penalty, tests until peak |
| Quirks | Restart addiction level, time "wasted" |
| Accuracy | Error type breakdown, clutch factor |
| Comparison | Estimated global percentile |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A MonkeyType account with exported data

### Export Your MonkeyType Data

1. Go to [monkeytype.com](https://monkeytype.com)
2. Log in → Settings → Account → Export Data
3. Download the CSV file

### Run Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/monkeytype-wrapped.git
cd monkeytype-wrapped

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and upload your CSV.

## 📁 Project Structure

```
monkeytype-wrapped/
├── frontend/           # Next.js app
│   ├── app/
│   ├── components/
│   │   └── slides/     # 11 wrapped slides
│   └── lib/
└── backend/            # Python FastAPI
    ├── main.py
    └── analyzer/
        ├── parser.py       # CSV processing
        ├── clustering.py   # Scikit-learn personas
        ├── warmup.py       # Session analysis
        └── ...
```

## 🤖 How the ML Works

We use **K-means clustering** on three features (WPM, accuracy, consistency) to identify your typing "personas":

- **Flow State** — fast + accurate + consistent
- **Burst Typer** — fast but variable consistency  
- **Steady Eddie** — moderate speed, high consistency
- **Off Day** — slower, lower accuracy

The algorithm finds natural groupings in *your* data, so the personas are personalized to your typing patterns.

## 📝 License

MIT

## 🙏 Acknowledgments

- [MonkeyType](https://monkeytype.com) for being awesome
- Inspired by Spotify Wrapped
