#!/usr/bin/env python3
"""
Chess improvement coach — takes a pattern analysis from the analyst agent and
produces a focused 1-week training plan.

Standalone usage (pipe analyst output in):
    python analyst.py <username> --type Rapid | python coach.py <username> --type Rapid

Programmatic usage (imported by main.py):
    import coach
    plan = coach.run(username, time_control, analysis_text)
"""

import sys
import argparse
import anthropic
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """\
You are an expert chess coach creating a personalised weekly improvement plan. \
You have just reviewed a pattern analysis of a student's recent games.

Your plan must be specific and directly tied to the weaknesses identified in the analysis \
— do not give generic advice that could apply to any player.

When recommending Lichess puzzle themes, use only real theme slugs that exist on \
https://lichess.org/training/. Valid slugs include: fork, pin, skewer, mateIn1, mateIn2, \
mateIn3, endgame, rookEndgame, queenEndgame, pawnEndgame, kingsideAttack, queensideAttack, \
backRankMate, discoveredAttack, doubleCheck, deflection, attraction, clearance, \
interference, xRayAttack, zugzwang, sacrifice, hangingPiece, advancedPawn, equality, \
trappedPiece, exposedKing, quietMove.

Be concrete and encouraging. Every recommendation must follow directly from the analysis.\
"""

PROMPT_TEMPLATE = """\
Here is a pattern analysis of {username}'s recent {time_control} games:

{analysis}

Based on this, create a focused 1-week improvement plan using exactly this structure \
with no additional sections:

## Primary Focus Area
[The single most impactful weakness to address this week. One paragraph explaining \
what it is, why it keeps costing this player, and what fixing it will unlock.]

## Daily Puzzle Practice
One Lichess puzzle theme per day, Monday–Friday, chosen to directly address the \
weaknesses found. Format each line exactly as shown:
- **Monday:** [Theme Name](https://lichess.org/training/[slug]) — [one sentence on what to look for while solving]
- **Tuesday:** [Theme Name](https://lichess.org/training/[slug]) — [one sentence]
- **Wednesday:** [Theme Name](https://lichess.org/training/[slug]) — [one sentence]
- **Thursday:** [Theme Name](https://lichess.org/training/[slug]) — [one sentence]
- **Friday:** [Theme Name](https://lichess.org/training/[slug]) — [one sentence]

## Concept to Study
**Topic:** [One chess concept to study in depth this week — name it precisely]
**YouTube search:** "[A specific search query. Include player names, opening names, or \
technique names to surface the best instructional content — e.g. \
'Silman endgame course rook endings' or 'Naroditsky French Defense middlegame plans']"

## Opening Adjustment
[One specific, concrete change to make to the opening repertoire based on the patterns \
found. Reference the actual opening lines observed in the games where possible.]

## Goal for the Week
[One measurable, verifiable goal. Must be specific enough to check at week's end — \
e.g. "Complete 15 rookEndgame puzzles daily and successfully convert at least 2 \
rook-and-pawn endgames in-game" or "Achieve 75%+ accuracy on mateIn2 puzzles timed \
under 60 seconds". Avoid vague goals like "improve endgame play".]
"""


def produce_plan(username: str, time_control: str, analysis: str) -> str:
    """Stream the improvement plan from Claude to stdout and return the full text."""
    client = anthropic.Anthropic()

    prompt = PROMPT_TEMPLATE.format(
        username=username,
        time_control=time_control,
        analysis=analysis,
    )

    print("\n" + "=" * 60)
    print(f" 1-Week Improvement Plan — {username}")
    print("=" * 60 + "\n")

    chunks: list[str] = []
    with client.messages.stream(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            chunks.append(text)

    print("\n\n" + "=" * 60)
    return "".join(chunks)


def run(username: str, time_control: str, analysis: str) -> str:
    """Programmatic entry point — returns the improvement plan text."""
    return produce_plan(username, time_control, analysis)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a 1-week chess improvement plan from analyst output.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python analyst.py magnus --type Rapid | python coach.py magnus --type Rapid\n"
            "  python coach.py magnus --type Blitz < analysis.txt"
        ),
    )
    parser.add_argument("username", help="Lichess username")
    parser.add_argument(
        "--type",
        choices=["Bullet", "Blitz", "Rapid", "Classical"],
        default=None,
        metavar="TYPE",
        help="Game type that was analysed (used for context)",
    )
    args = parser.parse_args()

    time_control = args.type or "all time controls"

    print("Reading analysis from stdin...")
    try:
        analysis = sys.stdin.read().strip()
    except KeyboardInterrupt:
        print()
        sys.exit(0)

    if not analysis:
        print("Error: no analysis provided on stdin.", file=sys.stderr)
        sys.exit(1)

    try:
        produce_plan(args.username, time_control, analysis)
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
