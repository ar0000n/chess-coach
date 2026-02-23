#!/usr/bin/env python3
"""
Chess Coach — runs the analyst and coach agents in sequence and saves
the full output to a dated markdown file.

Usage:
    python main.py <username>
    python main.py <username> --platform chess.com --type Rapid
    python main.py <username> --platform lichess --type Blitz --games 15
    python main.py <username> --platform chess.com --type Rapid --year 2026 --month 1
"""

import sys
import argparse
from datetime import date
from pathlib import Path

import requests
import anthropic
from dotenv import load_dotenv

import analyst
import chess_com as chess_com_module
import coach

load_dotenv()

_PERF_LABEL = {
    "bullet":    "Bullet",
    "blitz":     "Blitz",
    "rapid":     "Rapid",
    "classical": "Classical",
    "daily":     "Daily",
}


# ── Ratings ───────────────────────────────────────────────────────────────────

def display_ratings(username: str, ratings: dict, perf_types: list) -> None:
    """Print a formatted ratings table to stdout."""
    print("\n" + "=" * 60)
    print(f" Player Ratings — {username}")
    print("=" * 60)

    for key in perf_types:
        r     = ratings.get(key, {})
        label = _PERF_LABEL[key]
        if r.get("rating") is None:
            print(f"  {label:<12}    —        (no games)")
        else:
            prog  = r["prog"]
            trend = f"↑{prog}" if prog > 0 else (f"↓{abs(prog)}" if prog < 0 else "")
            print(f"  {label:<12} {r['rating']:>4}   {trend:<6}  ({r['games']} games)")

    print("=" * 60 + "\n")


def format_ratings_markdown(ratings: dict, perf_types: list) -> str:
    """Return a markdown table of the user's current ratings."""
    lines = [
        "| Time Control | Rating | Trend | Games |",
        "|---|---|---|---|",
    ]
    for key in perf_types:
        r     = ratings.get(key, {})
        label = _PERF_LABEL[key]
        if r.get("rating") is None:
            lines.append(f"| {label} | — | — | 0 |")
        else:
            prog  = r["prog"]
            trend = f"↑ {prog}" if prog > 0 else (f"↓ {abs(prog)}" if prog < 0 else "—")
            lines.append(f"| {label} | {r['rating']} | {trend} | {r['games']} |")
    return "\n".join(lines)


# ── Report saving ─────────────────────────────────────────────────────────────

def save_report(
    username: str,
    platform: str,
    time_control: str,
    ratings: dict,
    perf_types: list,
    analysis: str,
    plan: str,
) -> Path:
    """Save the combined ratings, analysis, and plan to a markdown file."""
    platform_slug = platform.replace(".", "")          # chess.com → chesscom
    type_slug     = time_control.lower().replace(" ", "-")
    filename      = f"chess-{username}-{platform_slug}-{type_slug}-{date.today()}.md"
    output_path   = Path(__file__).parent / filename

    ratings_md = format_ratings_markdown(ratings, perf_types)

    content = f"""# Chess Coach Report — {username}

**Date:** {date.today()}
**Platform:** {platform}
**Time Control:** {time_control}

## Current Ratings

{ratings_md}

---

## Game Analysis

{analysis}

---

## 1-Week Improvement Plan

{plan}
"""
    output_path.write_text(content, encoding="utf-8")
    return output_path


# ── Entry point ───────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run the chess analyst and coach agents in sequence.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python main.py ArunRamalingam\n"
            "  python main.py ArunRamalingam --platform chess.com --type Rapid\n"
            "  python main.py ArunRamalingam --platform lichess --type Blitz --games 15\n"
            "  python main.py ArunRamalingam --platform chess.com --type Rapid --year 2026 --month 1"
        ),
    )
    parser.add_argument("username", help="Lichess or Chess.com username")
    parser.add_argument(
        "--platform",
        choices=["lichess", "chess.com"],
        default="lichess",
        help="Platform to fetch games from (default: lichess)",
    )
    parser.add_argument(
        "--type",
        choices=["Bullet", "Blitz", "Rapid", "Classical", "Daily"],
        default=None,
        metavar="TYPE",
        help=(
            "Filter by time control. "
            "Lichess: Bullet, Blitz, Rapid, Classical. "
            "Chess.com: Bullet, Blitz, Rapid, Daily."
        ),
    )
    parser.add_argument(
        "--games",
        type=int,
        default=20,
        metavar="N",
        help="Number of recent games to fetch (default: 20)",
    )
    parser.add_argument(
        "--year",
        type=int,
        default=None,
        metavar="YEAR",
        help="Chess.com only: fetch games from this year (e.g. 2026)",
    )
    parser.add_argument(
        "--month",
        type=int,
        default=None,
        metavar="MONTH",
        help="Chess.com only: fetch games from this month (1–12). Requires --year.",
    )
    args = parser.parse_args()

    # Validate arg combinations
    if args.month and not args.year:
        parser.error("--month requires --year")
    if args.platform == "lichess" and args.type == "Daily":
        parser.error("--type Daily is only valid for Chess.com. Use Classical for Lichess.")
    if args.platform == "chess.com" and args.type == "Classical":
        parser.error("--type Classical is only valid for Lichess. Use Daily for Chess.com.")
    if args.platform == "lichess" and (args.year or args.month):
        parser.error("--year and --month are only supported for Chess.com.")

    # Resolve platform-specific settings
    if args.platform == "lichess":
        platform_mod = analyst
        perf_types   = analyst.PERF_TYPES
        time_control = args.type if args.type else "all time controls"
        perf_type    = args.type.lower() if args.type else None
    else:
        platform_mod = chess_com_module
        perf_types   = chess_com_module.PERF_TYPES
        time_control = args.type if args.type else "all time controls"
        time_class   = args.type.lower() if args.type else None

    type_label = f" {args.type}" if args.type else ""

    # ── Ratings ───────────────────────────────────────────────────────────────
    print(f"Looking up ratings for '{args.username}' on {args.platform}...")
    try:
        ratings = platform_mod.fetch_user_ratings(args.username)
    except requests.HTTPError as e:
        status = e.response.status_code
        if status == 404:
            print(f"Error: user '{args.username}' not found on {args.platform}.", file=sys.stderr)
            sys.exit(1)
        print(f"Warning: could not fetch ratings (HTTP {status}). Continuing...")
        ratings = {}
    except requests.RequestException as e:
        print(f"Warning: network error fetching ratings ({e}). Continuing...")
        ratings = {}

    display_ratings(args.username, ratings, perf_types)

    # ── Step 1: Analyst ───────────────────────────────────────────────────────
    print(f"Fetching last {args.games}{type_label} games for '{args.username}' from {args.platform}...")
    try:
        if args.platform == "lichess":
            analysis = analyst.run(args.username, args.games, perf_type)
        else:
            analysis = chess_com_module.run(
                args.username,
                time_class=time_class,
                year=args.year,
                month=args.month,
                max_games=args.games,
            )
    except requests.HTTPError as e:
        status = e.response.status_code
        if status == 404:
            print(f"Error: user '{args.username}' not found on {args.platform}.", file=sys.stderr)
        else:
            print(f"Error: {args.platform} returned HTTP {status}.", file=sys.stderr)
        sys.exit(1)
    except requests.RequestException as e:
        print(f"Network error: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
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

    # ── Step 2: Coach ─────────────────────────────────────────────────────────
    try:
        plan = coach.run(args.username, time_control, analysis)
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

    # ── Step 3: Save ─────────────────────────────────────────────────────────
    output_path = save_report(
        args.username, args.platform, time_control, ratings, perf_types, analysis, plan
    )
    print(f"\nReport saved to: {output_path}")


if __name__ == "__main__":
    main()
