# Chess Coach

An AI-powered chess coaching tool that fetches your recent games from [Lichess](https://lichess.org) or [Chess.com](https://chess.com), identifies recurring weaknesses, and generates a focused 1-week improvement plan.

## How it works

Two AI agents run in sequence:

1. **Analyst** — fetches your recent games, parses the PGN, and sends the game data to Claude. It identifies your top 3 recurring structural patterns or weaknesses across all games, citing specific games with direct links so you can review them immediately.

2. **Coach** — takes the analyst's output and produces a concrete 1-week training plan tailored to those weaknesses. The plan includes daily Lichess puzzle themes, a concept to study, an opening adjustment, and a measurable goal for the week.

A ratings overview for all time controls is displayed at the start of every run.

## Requirements

- Python 3.9+
- An [Anthropic API key](https://console.anthropic.com/)
- A Lichess or Chess.com username (no API key needed — public games only)

## Installation

```bash
git clone https://github.com/ar0000n/chess-coach.git
cd chess-coach
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your-key-here
```

## Usage

### Full pipeline (recommended)

Runs the analyst and coach in sequence, displays ratings, and saves a markdown report:

```bash
# Lichess (default)
python main.py <username>
python main.py <username> --type Rapid
python main.py <username> --type Blitz --games 15

# Chess.com
python main.py <username> --platform chess.com
python main.py <username> --platform chess.com --type Rapid
python main.py <username> --platform chess.com --type Blitz --year 2026 --month 1
```

**Arguments:**

| Argument | Description | Default |
|---|---|---|
| `username` | Lichess or Chess.com username | required |
| `--platform` | `lichess` or `chess.com` | `lichess` |
| `--type` | Time control filter (see table below) | all types |
| `--games` | Number of recent games to fetch | 20 |
| `--year` | Chess.com only: filter by year (e.g. `2026`) | — |
| `--month` | Chess.com only: filter by month (`1`–`12`). Requires `--year`. | — |

**Valid `--type` values by platform:**

| Platform | Valid types |
|---|---|
| Lichess | `Bullet`, `Blitz`, `Rapid`, `Classical` |
| Chess.com | `Bullet`, `Blitz`, `Rapid`, `Daily` |

The report is saved to a markdown file in the same directory:
```
chess-<username>-<platform>-<type>-<YYYY-MM-DD>.md
```

### Analyst only

Run just the game analysis without generating a plan:

```bash
# Lichess
python analyst.py <username> --type Rapid --games 15

# Chess.com
python chess_com.py <username> --type Rapid
python chess_com.py <username> --type Blitz --year 2026 --month 1
```

### Coach only

Pipe analyst output into the coach:

```bash
python analyst.py <username> --type Rapid | python coach.py <username> --type Rapid
```

## Example output

```
Looking up ratings for 'ArunRamalingam' on lichess...

============================================================
 Player Ratings — ArunRamalingam
============================================================
  Bullet        1423   ↑12    (152 games)
  Blitz         1567   ↓5     (891 games)
  Rapid         1634           (234 games)
  Classical        —           (no games)
============================================================

Fetching last 20 Rapid games for 'ArunRamalingam' from lichess...

============================================================
 Chess Coach Analysis — ArunRamalingam
============================================================

**Pattern 1: Endgame technique breaks down**
This appeared in Game 3 (https://lichess.org/abc123) and Game 11
(https://lichess.org/xyz789), where a winning position was allowed
to slip into a draw...

...

============================================================
 1-Week Improvement Plan — ArunRamalingam
============================================================

## Primary Focus Area
...

## Daily Puzzle Practice
- **Monday:** [Rook Endgame](https://lichess.org/training/rookEndgame) — ...

Report saved to: chess-ArunRamalingam-lichess-rapid-2026-02-22.md
```

## Project structure

```
chess-coach/
├── analyst.py        # Lichess: fetches games, identifies weaknesses
├── chess_com.py      # Chess.com: fetches games, identifies weaknesses
├── coach.py          # Agent 2: generates the 1-week improvement plan
├── main.py           # Orchestrator: runs both agents and saves the report
├── requirements.txt
├── .env.example
└── .gitignore
```
