#!/usr/bin/env python3
"""
Chess game analyst — fetches a player's recent Lichess games and uses Claude
to identify recurring structural patterns and weaknesses across them.

Usage:
    python analyst.py <lichess-username>
    python analyst.py <lichess-username> --games 10
"""

import sys
import io
import argparse
from typing import Optional
import requests
import chess.pgn
import anthropic
from dotenv import load_dotenv

load_dotenv()

LICHESS_API = "https://lichess.org/api"
USER_AGENT  = "chess-coach/1.0 (https://github.com/ar0000n/chess-coach)"

SYSTEM_PROMPT = """\
You are an expert chess coach with decades of experience analysing games at all levels. \
A student has shared their recent games with you.

Your task is to identify the top 3 recurring patterns or weaknesses across all the games. \
Focus on structural, systemic issues — not one-off blunders. Look for things like:

- Phase-specific struggles (opening preparation, middlegame planning, endgame technique)
- Positional tendencies (weak pawn structures, poor piece coordination, bad trade decisions)
- Tactical vulnerabilities that appear repeatedly (back-rank weakness, undefended pieces)
- Strategic habits (premature attacks, passive play, neglecting development)
- Patterns tied to colour (performing differently as White vs Black)

For each of the three patterns provide:
1. A short, descriptive title (e.g. "Endgame technique breaks down")
2. Evidence — cite specific games by number and include the game URL directly next to the \
reference so the player can click straight to it, e.g. "Game 3 (https://lichess.org/abc123)"
3. A concrete, actionable improvement tip

Write in a direct but encouraging coaching voice. Be specific; avoid vague generalities.\
"""


# ── Lichess ───────────────────────────────────────────────────────────────────

PERF_TYPES = ["bullet", "blitz", "rapid", "classical"]


def fetch_user_ratings(username: str) -> dict:
    """
    Fetch the user's current ratings from Lichess for all standard time controls.
    Returns a dict keyed by perf type, e.g.:
      {"bullet": {"rating": 1500, "games": 120, "prog": 10}, ...}
    Only includes time controls where the user has played at least one game.
    Raises requests.HTTPError on a bad response.
    """
    url = f"{LICHESS_API}/user/{username}"
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()

    ratings = {}
    perfs = data.get("perfs", {})
    for key in PERF_TYPES:
        perf = perfs.get(key, {})
        ratings[key] = {
            "rating": perf.get("rating"),   # None means no games played
            "games":  perf.get("games", 0),
            "prog":   perf.get("prog", 0),
        }
    return ratings


def fetch_games(username: str, max_games: int, perf_type: Optional[str] = None) -> str:
    """
    Download the last `max_games` games for `username` from Lichess in PGN format.
    Optionally filter by `perf_type` (bullet, blitz, rapid, classical).
    Raises requests.HTTPError on a bad response.
    """
    url = f"{LICHESS_API}/games/user/{username}"
    params: dict = {
        "max":     max_games,
        "moves":   "true",
        "tags":    "true",
        "opening": "true",   # includes Opening header with full opening name
    }
    if perf_type:
        params["perfType"] = perf_type

    response = requests.get(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/x-chess-pgn",
        },
        params=params,
        timeout=30,
    )
    response.raise_for_status()
    return response.text


# ── PGN parsing ───────────────────────────────────────────────────────────────

def parse_games(pgn_text: str, username: str) -> list[dict]:
    """
    Parse a multi-game PGN string and return a list of structured game dicts.
    Each dict contains the metadata and full move list needed for coaching analysis.
    """
    games = []
    pgn_io = io.StringIO(pgn_text)

    while True:
        game = chess.pgn.read_game(pgn_io)
        if game is None:
            break

        headers = game.headers
        white   = headers.get("White", "")
        black   = headers.get("Black", "")
        result  = headers.get("Result", "*")

        # Determine which colour the target user played
        if white.lower() == username.lower():
            color       = "White"
            user_result = {"1-0": "Win", "0-1": "Loss", "1/2-1/2": "Draw"}.get(result, "?")
        else:
            color       = "Black"
            user_result = {"1-0": "Loss", "0-1": "Win", "1/2-1/2": "Draw"}.get(result, "?")

        # Build the move list in standard numbered notation
        board      = game.board()
        sans: list[str] = []
        for move in game.mainline_moves():
            sans.append(board.san(move))
            board.push(move)

        pairs: list[str] = []
        for i in range(0, len(sans), 2):
            n = i // 2 + 1
            pairs.append(f"{n}.{sans[i]} {sans[i + 1]}" if i + 1 < len(sans) else f"{n}.{sans[i]}")

        games.append({
            "color":        color,
            "result":       user_result,
            "opening":      headers.get("Opening", headers.get("ECO", "Unknown opening")),
            "time_control": headers.get("TimeControl", "?"),
            "move_count":   len(sans),
            "moves":        " ".join(pairs),
            "opponent":     black if color == "White" else white,
            "url":          headers.get("Site", ""),
        })

    return games


# ── Formatting ────────────────────────────────────────────────────────────────

def format_for_claude(games: list[dict], username: str) -> str:
    """
    Render the parsed game list as a compact text block to include in the
    Claude user message.
    """
    lines = [
        f"Player: {username}",
        f"Games provided: {len(games)}",
        "",
    ]

    for i, g in enumerate(games, 1):
        lines.append(
            f"Game {i:>2} | {g['color']:5} | {g['result']:4} | "
            f"Moves: {g['move_count']:>3} | TC: {g['time_control']:>8} | "
            f"Opening: {g['opening']} | URL: {g['url']}"
        )
        lines.append(f"         {g['moves']}")
        lines.append("")

    return "\n".join(lines)


# ── Analysis ──────────────────────────────────────────────────────────────────

def analyse(username: str, game_data: str) -> str:
    """Stream the coaching analysis from Claude to stdout and return the full text."""
    client = anthropic.Anthropic()

    user_message = (
        f"Please analyse these games and identify the top 3 recurring patterns "
        f"or weaknesses for {username}:\n\n{game_data}"
    )

    print("\n" + "=" * 60)
    print(f" Chess Coach Analysis — {username}")
    print("=" * 60 + "\n")

    chunks: list[str] = []
    with client.messages.stream(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            chunks.append(text)

    print("\n\n" + "=" * 60)
    return "".join(chunks)


def run(username: str, max_games: int, perf_type: Optional[str] = None) -> str:
    """
    Full analyst pipeline — fetch, parse, analyse.
    Returns the analysis text. Raises on network or API errors.
    """
    pgn_text = fetch_games(username, max_games, perf_type)
    games = parse_games(pgn_text, username)
    if not games:
        raise ValueError(f"No games found for '{username}'.")
    return analyse(username, format_for_claude(games, username))


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Analyse a Lichess player's recent games with an AI chess coach.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python analyst.py magnus\n"
            "  python analyst.py magnus --games 10\n"
            "  python analyst.py magnus --type Blitz\n"
            "  python analyst.py magnus --type Rapid --games 15"
        ),
    )
    parser.add_argument("username", help="Lichess username to analyse")
    parser.add_argument(
        "--games",
        type=int,
        default=20,
        metavar="N",
        help="Number of recent games to fetch (default: 20)",
    )
    parser.add_argument(
        "--type",
        choices=["Bullet", "Blitz", "Rapid", "Classical"],
        metavar="TYPE",
        help="Filter by game type: Bullet, Blitz, Rapid, or Classical",
    )
    args = parser.parse_args()

    # ── Fetch ─────────────────────────────────────────────────
    perf_type = args.type.lower() if args.type else None
    type_label = f" {args.type}" if args.type else ""
    print(f"Fetching last {args.games}{type_label} games for '{args.username}' from Lichess...")
    try:
        pgn_text = fetch_games(args.username, args.games, perf_type)
    except requests.HTTPError as e:
        status = e.response.status_code
        if status == 404:
            print(f"Error: user '{args.username}' not found on Lichess.", file=sys.stderr)
        else:
            print(f"Error: Lichess returned HTTP {status}.", file=sys.stderr)
        sys.exit(1)
    except requests.RequestException as e:
        print(f"Network error: {e}", file=sys.stderr)
        sys.exit(1)

    # ── Parse ─────────────────────────────────────────────────
    games = parse_games(pgn_text, args.username)
    if not games:
        print(f"No games found for '{args.username}'.", file=sys.stderr)
        sys.exit(1)
    print(f"Parsed {len(games)} game{'s' if len(games) != 1 else ''}. Sending to Claude...")

    game_data = format_for_claude(games, args.username)

    # ── Analyse ───────────────────────────────────────────────
    try:
        analyse(args.username, game_data)
    except anthropic.AuthenticationError:
        print(
            "Error: invalid or missing API key.\n"
            "Add it to a .env file: ANTHROPIC_API_KEY=your-key-here",
            file=sys.stderr,
        )
        sys.exit(1)
    except anthropic.APIConnectionError:
        print("Error: could not connect to the Anthropic API.", file=sys.stderr)
        sys.exit(1)
    except anthropic.APIStatusError as e:
        print(f"Anthropic API error {e.status_code}: {e.message}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
