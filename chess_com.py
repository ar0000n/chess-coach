#!/usr/bin/env python3
"""
Chess.com game analyst — fetches a player's recent Chess.com games and uses Claude
to identify recurring structural patterns and weaknesses across them.

Standalone usage:
    python chess_com.py <username>
    python chess_com.py <username> --type Rapid
    python chess_com.py <username> --type Blitz --year 2026 --month 1

Programmatic usage (imported by main.py):
    import chess_com
    analysis = chess_com.run(username, time_class="rapid", year=2026, month=1)
"""

import sys
import io
import time
import argparse
from typing import Optional

import requests
import chess.pgn
import anthropic
from dotenv import load_dotenv

from analyst import SYSTEM_PROMPT, analyse

load_dotenv()

CHESS_COM_API = "https://api.chess.com/pub"
USER_AGENT    = "chess-coach/1.0 (https://github.com/ar0000n/chess-coach)"

PERF_TYPES = ["bullet", "blitz", "rapid", "daily"]

_RATING_KEY = {
    "bullet": "chess_bullet",
    "blitz":  "chess_blitz",
    "rapid":  "chess_rapid",
    "daily":  "chess_daily",
}


# ── Ratings ───────────────────────────────────────────────────────────────────

def fetch_user_ratings(username: str) -> dict:
    """
    Fetch the user's current ratings from Chess.com for all standard time controls.
    Returns a dict keyed by perf type (bullet/blitz/rapid/daily).
    Each entry has: rating (None if unplayed), games, prog (always 0 — not in public API).
    Raises requests.HTTPError on a bad response.
    """
    url = f"{CHESS_COM_API}/player/{username}/stats"
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=10,
    )
    response.raise_for_status()
    data = response.json()

    ratings = {}
    for key in PERF_TYPES:
        perf   = data.get(_RATING_KEY[key], {})
        last   = perf.get("last", {})
        record = perf.get("record", {})
        games  = record.get("win", 0) + record.get("loss", 0) + record.get("draw", 0)
        ratings[key] = {
            "rating": last.get("rating") if games > 0 else None,
            "games":  games,
            "prog":   0,   # Chess.com doesn't expose recent trend via public API
        }
    return ratings


# ── Game fetching ─────────────────────────────────────────────────────────────

def _fetch_archive(url: str) -> list:
    """Fetch one monthly archive and return the raw game list."""
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=30,
    )
    response.raise_for_status()
    return response.json().get("games", [])


def fetch_games(
    username: str,
    time_class: Optional[str] = None,
    year: Optional[int] = None,
    month: Optional[int] = None,
    max_games: int = 20,
) -> list:
    """
    Fetch games from Chess.com archives.
    - year + month: fetch that specific month only.
    - year only:    fetch each month of that year, most recent first.
    - neither:      work backwards through archives until max_games reached.
    time.sleep(0.5) is applied between every archive request after the first.
    Optionally filters by time_class (bullet/blitz/rapid/daily).
    Returns up to max_games games, most recent first.
    Raises requests.HTTPError on a bad response.
    """
    if year and month:
        archive_urls = [f"{CHESS_COM_API}/player/{username}/games/{year}/{month:02d}"]
    else:
        resp = requests.get(
            f"{CHESS_COM_API}/player/{username}/games/archives",
            headers={"User-Agent": USER_AGENT},
            timeout=10,
        )
        resp.raise_for_status()
        all_urls = resp.json().get("archives", [])
        if year:
            all_urls = [u for u in all_urls if f"/{year}/" in u]
        archive_urls = list(reversed(all_urls))   # most recent first

    collected: list = []
    for i, url in enumerate(archive_urls):
        if i > 0:
            time.sleep(0.5)
        games = _fetch_archive(url)
        # Each archive is oldest-first; reverse so newest is collected first
        if time_class:
            games = [g for g in games if g.get("time_class") == time_class.lower()]
        collected.extend(reversed(games))
        if len(collected) >= max_games:
            break

    return collected[:max_games]


# ── PGN parsing ───────────────────────────────────────────────────────────────

def parse_games(raw_games: list, username: str) -> list:
    """
    Convert Chess.com game JSON into the standard format used across the pipeline.
    Uses python-chess to parse the embedded PGN for a clean, numbered move list.
    """
    games = []
    for g in raw_games:
        pgn_text = g.get("pgn", "")
        if not pgn_text:
            continue

        parsed = chess.pgn.read_game(io.StringIO(pgn_text))
        if parsed is None:
            continue

        headers    = parsed.headers
        white_info = g.get("white", {})
        black_info = g.get("black", {})
        white      = white_info.get("username", "")
        black      = black_info.get("username", "")

        if white.lower() == username.lower():
            color    = "White"
            user_res = white_info.get("result", "")
            opp_res  = black_info.get("result", "")
        else:
            color    = "Black"
            user_res = black_info.get("result", "")
            opp_res  = white_info.get("result", "")

        if user_res == "win":
            user_result = "Win"
        elif opp_res == "win":
            user_result = "Loss"
        else:
            user_result = "Draw"

        # Build numbered move list via python-chess
        board      = parsed.board()
        sans: list[str] = []
        for move in parsed.mainline_moves():
            sans.append(board.san(move))
            board.push(move)

        pairs: list[str] = []
        for i in range(0, len(sans), 2):
            n = i // 2 + 1
            pairs.append(
                f"{n}.{sans[i]} {sans[i + 1]}" if i + 1 < len(sans) else f"{n}.{sans[i]}"
            )

        # Opening: prefer the [Opening] tag; fall back to ECOUrl slug
        opening = headers.get("Opening", "")
        if not opening:
            eco_url = headers.get("ECOUrl", "")
            if eco_url:
                opening = eco_url.rstrip("/").split("/")[-1].replace("-", " ")
        opening = opening or "Unknown opening"

        games.append({
            "color":        color,
            "result":       user_result,
            "opening":      opening,
            "time_control": g.get("time_control", "?"),
            "move_count":   len(sans),
            "moves":        " ".join(pairs),
            "opponent":     black if color == "White" else white,
            "url":          g.get("url", ""),
        })

    return games


# ── Formatting ────────────────────────────────────────────────────────────────

def format_for_claude(games: list, username: str) -> str:
    """Render the parsed game list as a compact text block for Claude."""
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


# ── Pipeline ──────────────────────────────────────────────────────────────────

def run(
    username: str,
    time_class: Optional[str] = None,
    year: Optional[int] = None,
    month: Optional[int] = None,
    max_games: int = 20,
) -> str:
    """
    Full Chess.com analyst pipeline — fetch, parse, format, analyse.
    Returns the analysis text. Raises on network or API errors.
    """
    raw_games = fetch_games(username, time_class, year, month, max_games)
    if not raw_games:
        raise ValueError(f"No Chess.com games found for '{username}'.")
    games = parse_games(raw_games, username)
    if not games:
        raise ValueError(f"No parseable games found for '{username}'.")
    return analyse(username, format_for_claude(games, username))


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Analyse a Chess.com player's recent games with an AI chess coach.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python chess_com.py magnus\n"
            "  python chess_com.py magnus --type Rapid\n"
            "  python chess_com.py magnus --type Blitz --year 2026 --month 1"
        ),
    )
    parser.add_argument("username", help="Chess.com username to analyse")
    parser.add_argument(
        "--type",
        choices=["Bullet", "Blitz", "Rapid", "Daily"],
        default=None,
        metavar="TYPE",
        help="Filter by time control: Bullet, Blitz, Rapid, or Daily",
    )
    parser.add_argument(
        "--year",
        type=int,
        default=None,
        metavar="YEAR",
        help="Filter games from this year (e.g. 2026)",
    )
    parser.add_argument(
        "--month",
        type=int,
        default=None,
        metavar="MONTH",
        help="Filter games from this month (1–12). Requires --year.",
    )
    parser.add_argument(
        "--games",
        type=int,
        default=20,
        metavar="N",
        help="Maximum number of games to analyse (default: 20)",
    )
    args = parser.parse_args()

    if args.month and not args.year:
        parser.error("--month requires --year")

    time_class = args.type.lower() if args.type else None
    type_label = f" {args.type}" if args.type else ""

    print(f"Fetching last {args.games}{type_label} games for '{args.username}' from Chess.com...")
    try:
        raw_games = fetch_games(args.username, time_class, args.year, args.month, args.games)
    except requests.HTTPError as e:
        status = e.response.status_code
        if status == 404:
            print(f"Error: user '{args.username}' not found on Chess.com.", file=sys.stderr)
        else:
            print(f"Error: Chess.com returned HTTP {status}.", file=sys.stderr)
        sys.exit(1)
    except requests.RequestException as e:
        print(f"Network error: {e}", file=sys.stderr)
        sys.exit(1)

    if not raw_games:
        print(f"No games found for '{args.username}'.", file=sys.stderr)
        sys.exit(1)

    games = parse_games(raw_games, args.username)
    if not games:
        print(f"No parseable games found for '{args.username}'.", file=sys.stderr)
        sys.exit(1)

    print(f"Parsed {len(games)} game{'s' if len(games) != 1 else ''}. Sending to Claude...")
    try:
        analyse(args.username, format_for_claude(games, args.username))
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
