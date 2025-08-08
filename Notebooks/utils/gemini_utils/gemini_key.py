import os
from pathlib import Path

from dotenv import load_dotenv

script_dir: Path = Path(__file__)
rood_dir: Path = script_dir.parent.parent.parent.parent
dotenv_path = rood_dir / "final-project-next" / ".env"
load_dotenv(dotenv_path=dotenv_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
