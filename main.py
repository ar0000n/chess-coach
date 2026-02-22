#!/usr/bin/env python3
"""
Chess Coach — runs the analyst and coach agents in sequence and saves
the full output to a dated markdown file.

Usage:
    python main.py <username>
    python main.py <username> --type Rapid
    python main.py <username> --type Blitz --games 15
"""

import sys
import argparse
from datetime import date
from pathlib import Path

import requests
import anthropic
from dotenv import load_dotenv

import analyst
import coach

load_dotenv()

_PERF_LABEL = {
    "bullet":    "Bullet",
    "blitz":     "Blitz",
    "rapid":     "Rapid",
    "classical": "Classical",
}


# ── Ratings display ───────────────────────────────────────────────────────────

def display_ratings(username: str, ratings: dict) -> None:
    """Print a formatted ratings table to stdout."""
    print("\n" + "=" * 60)
    print(f" Player Ratings — {username}")
    print("=" * 60)

    for key in analyst.PERF_TYPES:
        r = ratings.get(key, {})
        label = _PERF_LABEL[key]
        if r.get("rating") is None:
            print(f"  {label:<12}    —        (no games)")
        else:
            prog = r["prog"]
            trend = f"↑{prog}" if prog > 0 else (f"↓{abs(prog)}" if prog < 0 else "")
            print(f"  {label:<12} {r['rating']:>4}   {trend:<6}  ({r['games']} games)")

    print("=" * 60 + "\n")


def format_ratings_markdown(ratings: dict) -> str:
    """Return a markdown table of the user's current ratings."""
    lines = [
        "| Time Control | Rating | Trend | Games |",
        "|---|---|---|---|",
    ]
    for key in analyst.PERF_TYPES:
        r = ratings.get(key, {})
        label = _PERF_LABEL[key]
        if r.get("rating") is None:
            lines.append(f"| {label} | — | — | 0 |")
        else:
            prog = r["prog"]
            trend = f"↑ {prog}" if prog > 0 else (f"↓ {abs(prog)}" if prog < 0 else "—")
            lines.append(f"| {label} | {r['rating']} | {trend} | {r['games']} |")
    return "\n".join(lines)


# ── Report saving ─────────────────────────────────────────────────────────────

def save_report(
    username: str,
    time_control: str,
    ratings: dict,
    analysis: str,
    plan: str,
) -> Path:
    """Save the combined ratings, analysis, and plan to a markdown file."""
    type_slug = time_control.lower().replace(" ", "-")
    filename = f"chess-{username}-{type_slug}-{date.today()}.md"
    output_path = Path(__file__).parent / filename

    ratings_md = format_ratings_markdown(ratings)

    content = f"""# Chess Coach Report — {username}

**Date:** {date.today()}
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
            "  python main.py ArunRamalingam --type Rapid\n"
            "  python main.py ArunRamalingam --type Blitz --games 15"
        ),
    )
    parser.add_argument("username", help="Lichess username to analyse")
    parser.add_argument(
        "--type",
        choices=["Bullet", "Blitz", "Rapid", "Classical"],
        default=None,
        metavar="TYPE",
        help="Filter by game type: Bullet, Blitz, Rapid, or Classical",
    )
    parser.add_argument(
        "--games",
        type=int,
        default=20,
        metavar="N",
        help="Number of recent games to fetch (default: 20)",
    )
    args = parser.parse_args()

    perf_type = args.type.lower() if args.type else None
    time_control = args.type if args.type else "all time controls"
    type_label = f" {args.type}" if args.type else ""

    # ── Ratings ───────────────────────────────────────────────────────────────
    print(f"Looking up ratings for '{args.username}'...")
    try:
        ratings = analyst.fetch_user_ratings(args.username)
    except requests.HTTPError as e:
        status = e.response.status_code
        if status == 404:
            print(f"Error: user '{args.username}' not found on Lichess.", file=sys.stderr)
            sys.exit(1)
        else:
            print(f"Warning: could not fetch ratings (HTTP {status}). Continuing...")
            ratings = {}
    except requests.RequestException as e:
        print(f"Warning: network error fetching ratings ({e}). Continuing...")
        ratings = {}

    display_ratings(args.username, ratings)

    # ── Step 1: Analyst ───────────────────────────────────────────────────────
    print(f"Fetching last {args.games}{type_label} games for '{args.username}'...")
    try:
        analysis = analyst.run(args.username, args.games, perf_type)
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
    output_path = save_report(args.username, time_control, ratings, analysis, plan)
    print(f"\nReport saved to: {output_path}")


if __name__ == "__main__":
    main()
