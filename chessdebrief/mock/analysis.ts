import type { AnalysisReport } from "@/types/analysis";
import { MOCK_RATINGS } from "./ratings";
import { config } from "@/config";

export const MOCK_REPORT_ID = "report-00000000-0000-0000-0000-000000000001";

export const MOCK_ANALYSIS_REPORT: AnalysisReport = {
  id: MOCK_REPORT_ID,
  user_id: config.mock.userId,
  platform: "lichess",
  username: config.mock.userName,
  time_control: "rapid",
  ratings: MOCK_RATINGS,
  games_analyzed: 15,
  status: "complete",
  created_at: "2026-02-28T10:05:00Z",
  updated_at: "2026-02-28T10:05:45Z",

  weaknesses: [
    {
      rank: 1,
      title: "Chronic Back-Rank Vulnerability",
      description:
        "Across your recent rapid games, your king consistently sits on the first rank with no escape square after castling short. You tend to prioritize piece activity over defensive structure, leaving the back rank unguarded as the position opens up. This pattern is systemic — it is not a one-off oversight but a recurring blind spot in your defensive calculation. In each of the three cited games, a back-rank motif (checkmate threat, skewer, or back-rank pin) directly decided the outcome.",
      game_citations: [
        { game_number: 3, url: "https://lichess.org/cd3jkl4m", game_id: "game-003" },
        { game_number: 7, url: "https://lichess.org/gh7mno8p", game_id: "game-007" },
        { game_number: 14, url: "https://lichess.org/no14pqr5", game_id: "game-014" },
      ],
      actionable_tip:
        "Before every rook trade or open-file operation, ask: \"Does my king have a luft square?\" Build the habit of playing h3/g3 (as White) or ...h6/...g6 (as Black) proactively whenever rooks remain on the board and the center is opening. This single habit prevents the entire pattern.",
    },
    {
      rank: 2,
      title: "Premature Queenside Pawn Advances",
      description:
        "In three separate games you pushed queenside pawns — specifically ...b5 or ...a5 as Black and b4 as White — before completing development or securing the center. Each time this created long-term structural weaknesses: backward pawns on c6, isolated a-pawns, and loose b5 pawns that your opponents exploited methodically over the following 15–20 moves. The advance looks ambitious but consistently weakens the structure at precisely the wrong moment in the game.",
      game_citations: [
        { game_number: 2, url: "https://lichess.org/bc2ghi3j", game_id: "game-002" },
        { game_number: 9, url: "https://lichess.org/ij9stu0v", game_id: "game-009" },
        { game_number: 14, url: "https://lichess.org/no14pqr5", game_id: "game-014" },
      ],
      actionable_tip:
        "Apply Silman's rule: only launch a queenside expansion once (1) the center is locked or you control it, (2) your pieces are fully developed, and (3) you have confirmed what square weakness you are creating and can defend it. Use 'can my opponent create a passed pawn or a target from this advance?' as your go/no-go checkpoint.",
    },
    {
      rank: 3,
      title: "Endgame Technique in Rook-and-Pawn Endings",
      description:
        "You reach rook endgames with a material advantage or structural edge but convert at a low rate. In Games 5, 11, and the drawn finale of Game 8, you held a winning position at move 40+ but allowed your opponent to activate their rook, reach a drawn fortress, or force a pawn race you could have avoided with precise play. The core technical gap is passive rook placement — your rook defends pawns from behind rather than cutting off the opposing king or attacking from the seventh rank.",
      game_citations: [
        { game_number: 5, url: "https://lichess.org/ef5klm6n", game_id: "game-005" },
        { game_number: 8, url: "https://lichess.org/hi8pqr9s", game_id: "game-008" },
        { game_number: 11, url: "https://lichess.org/kl11mno2", game_id: "game-011" },
      ],
      actionable_tip:
        "Study and internalize three positions: Lucena (winning with an extra pawn), Philidor (drawing without a pawn), and the 'Rook on the Seventh' principle. In your games, immediately after entering a rook endgame, ask: 'Can I seize the seventh rank?' That single question will convert 30–40% more of these positions.",
    },
  ],

  training_plan: {
    primary_focus:
      "Your back-rank vulnerability is the highest-priority weakness because it costs you full points in games you have otherwise played well. The other two patterns — queenside pawn timing and rook endgame technique — develop slowly over many moves, giving you time to correct course mid-game. Back-rank checkmates and back-rank tactics end games instantly with no recovery. Fixing this first will preserve the winning positions your improving play is already earning you.",

    daily_puzzles: [
      {
        day: "Monday",
        theme_name: "Back Rank Mate",
        theme_slug: "backRankMate",
        theme_url: "https://lichess.org/training/backRankMate",
        coaching_note:
          "Before each solve, identify both sides' back-rank escape squares — train your eye to spot the absence of luft before the tactic is triggered. This is exactly the pattern that decided Game 3.",
      },
      {
        day: "Tuesday",
        theme_name: "Rook Endgame",
        theme_slug: "rookEndgame",
        theme_url: "https://lichess.org/training/rookEndgame",
        coaching_note:
          "Focus on where the rook is placed in each puzzle — is it active on the seventh rank or passive and defensive? Practice placing it correctly before calculating specific moves.",
      },
      {
        day: "Wednesday",
        theme_name: "Hanging Piece",
        theme_slug: "hangingPiece",
        theme_url: "https://lichess.org/training/hangingPiece",
        coaching_note:
          "Connect this directly to your queenside pawn advances: pawns pushed without piece support frequently become hanging targets. Train your opponent's-eye view of the board.",
      },
      {
        day: "Thursday",
        theme_name: "Pawn Endgame",
        theme_slug: "pawnEndgame",
        theme_url: "https://lichess.org/training/pawnEndgame",
        coaching_note:
          "Your queenside pawn weaknesses often transition into losing pawn endgames. Use these puzzles to understand which structures are objectively losing before you enter them.",
      },
      {
        day: "Friday",
        theme_name: "Discovered Attack",
        theme_slug: "discoveredAttack",
        theme_url: "https://lichess.org/training/discoveredAttack",
        coaching_note:
          "Back-rank weakness is frequently exploited via discovered attacks along the e-file or d-file. Train pattern recognition for these double-threat setups — they are what your opponents found in Games 7 and 14.",
      },
    ],

    concept_topic: "Lucena and Philidor Positions in Rook Endgames",
    concept_youtube_search: "Silman endgame course rook endings Lucena Philidor technique",
    opening_adjustment:
      "In the Queen's Gambit Declined (your most frequent opening as White, seen in Game 3), add the preventive move h3 on move 10–12 before any rook exchange on the e-file. As Black in the Sicilian Najdorf (Games 2 and 10), delay ...a5 and ...b5 pawn advances until after move 12 and your queenside pieces are actively placed — specifically wait until Nc6 or Nd7 is fully developed before touching the a-pawn or b-pawn.",
    weekly_goal:
      "Complete 20 backRankMate puzzles per day on Monday and Wednesday. By Friday, play 5 rated rapid games and verify in each post-game review that you created at least one luft square before move 20. Separately, complete 10 rookEndgame puzzles daily on Tuesday and Thursday, targeting a 70%+ solve rate by the end of the week.",
  },
};
