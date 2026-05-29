import type { GoalKey } from "./mockData";

/**
 * Overridable fields on the Do (feedback) stage for a given training goal.
 * All fields are optional — any field not set falls through to the base session copy.
 */
export type SessionVariantOverrides = {
  promptTitle?: string;
  promptBody?: string;
  constraint?: string;
  preRecordMeta?: string;
  closingLine?: string;
  badge?: string;
  headerMeta?: string;
};

/**
 * Per-session, per-goal prompt/constraint overrides.
 * Only sessions that need variants are listed.
 * Keys: session number → training goal → field overrides.
 */
export const sessionVariants: Partial<Record<number, Record<GoalKey, SessionVariantOverrides>>> & Record<number, Partial<Record<GoalKey, SessionVariantOverrides>>> = {
  // ───────────────────────────────────────────────────────────────────
  // SPRINT 01 — NOTICE (Light variant)
  // ───────────────────────────────────────────────────────────────────

  /** Session 2 — First Notice (Pace) */
  2: {
    "Interview prep": {
      promptTitle: "Walk me through your career story so far.",
    },
    "New manager": {
      promptTitle: "Walk me through how you ran your last team meeting.",
    },
    "Client-facing": {
      promptTitle: "Walk me through how you handled a recent objection.",
    },
    "Promotion-ready": {
      promptTitle: "Walk me through a strategic decision you influenced.",
    },
    General: {
      promptTitle: "What was the best part of your weekend?",
    },
  },

  /** Session 5 — Where You Trail Off (Sentence endings) */
  5: {
    "Interview prep": {
      promptTitle: "Tell me about your biggest achievement in your current role.",
    },
    "New manager": {
      promptTitle: "Tell me about a win that changed how your team works.",
    },
    "Client-facing": {
      promptTitle: "Tell me about a deal or relationship you turned around.",
    },
    "Promotion-ready": {
      promptTitle: "Tell me about a result you delivered that went beyond expectations.",
    },
    General: {
      promptTitle: "Tell me about a recent win. Something at work or in life.",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // SPRINT 02 — STEADY (Light variant)
  // ───────────────────────────────────────────────────────────────────

  /** Session 7 — Cutting Fillers */
  7: {
    "Interview prep": {
      promptTitle: "Tell me about why you are excited about your next career step.",
    },
    "New manager": {
      promptTitle: "Tell me about a change you want to make on your team.",
    },
    "Client-facing": {
      promptTitle: "Tell me about a service you are excited to share with a client.",
    },
    "Promotion-ready": {
      promptTitle: "Tell me about a project you are looking forward to leading.",
    },
    General: {
      promptTitle: "Tell me about something you are looking forward to this week.",
    },
  },

  /** Session 8 — Finding Your Pace */
  8: {
    "Interview prep": {
      promptTitle: "Walk me through how you approach solving a complex problem.",
    },
    "New manager": {
      promptTitle: "Walk me through how you run your one-on-one meetings.",
    },
    "Client-facing": {
      promptTitle: "Walk me through your client onboarding process.",
    },
    "Promotion-ready": {
      promptTitle: "Walk me through how you evaluate a strategic opportunity.",
    },
    General: {
      promptTitle: "Walk me through a process you do well.",
    },
  },

  /** Session 9 — Power Pauses */
  9: {
    "Interview prep": {
      promptTitle: "Explain a difficult career decision you made and how you arrived at it.",
    },
    "New manager": {
      promptTitle: "Explain a team decision you made and the trade-offs involved.",
    },
    "Client-facing": {
      promptTitle: "Explain a pricing or scoping decision and why it was right for the client.",
    },
    "Promotion-ready": {
      promptTitle: "Explain a strategic decision and the data that informed it.",
    },
    General: {
      promptTitle: "Explain a recent decision you made and what informed it.",
    },
  },

  /** Session 10 — Downward Inflection */
  10: {
    "Interview prep": {
      promptTitle: "Make a recommendation about a practice every team should adopt.",
    },
    "New manager": {
      promptTitle: "Make a recommendation on how to improve team communication.",
    },
    "Client-facing": {
      promptTitle: "Make a recommendation for how a client could improve their results.",
    },
    "Promotion-ready": {
      promptTitle: "Make a recommendation for a change your organisation should make.",
    },
    General: {
      promptTitle: "Make a recommendation. Anything — a book, a tool, a way of working.",
    },
  },

  /** Session 11 — Brevity */
  11: {
    "Interview prep": {
      promptTitle: "What is the single most important quality you look for in a role?",
    },
    "New manager": {
      promptTitle: "What is the single most important thing a manager can do for their team?",
    },
    "Client-facing": {
      promptTitle: "What is the single most important thing clients need to hear from you?",
    },
    "Promotion-ready": {
      promptTitle: "What is the single most important lesson your career has taught you?",
    },
    General: {
      promptTitle: "What is the single most important thing you have learned in your career?",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // SPRINT 03 — LEAD (Light variant)
  // ───────────────────────────────────────────────────────────────────

  /** Session 13 — BLUF */
  13: {
    "Interview prep": {
      promptTitle: "What is the most important skill you bring to this role? Lead with it.",
      constraint: "BLUF only. 30 seconds. Conclusion in the first 8.",
    },
    "New manager": {
      promptTitle: "What is the most important change your team needs right now? State it first.",
      constraint: "BLUF only. 30 seconds. Conclusion in the first 8.",
    },
    "Client-facing": {
      promptTitle: "What is the most important thing a client should know about working with you?",
      constraint: "BLUF only. 30 seconds. Conclusion in the first 8.",
    },
    "Promotion-ready": {
      promptTitle: "What is the most important investment your organisation should make? State your position in 8 seconds.",
      constraint: "BLUF only. 30 seconds. Conclusion in the first 8.",
    },
    General: {
      promptTitle: "Should your company invest more in remote work, in-office work, or hybrid? Your view, with reasoning.",
      constraint: "BLUF only. 30 seconds. Conclusion in the first 8.",
    },
  },

  /** Session 14 — Rule of 3 */
  14: {
    "Interview prep": {
      promptTitle: "What are the three most important qualities for success in this field?",
    },
    "New manager": {
      promptTitle: "What are the three things you want your team to know about your leadership approach?",
    },
    "Client-facing": {
      promptTitle: "What are the three reasons a client should choose working with you?",
    },
    "Promotion-ready": {
      promptTitle: "What are the three metrics that best define success in your role?",
    },
    General: {
      promptTitle: "What makes a good manager? Three things.",
    },
  },

  /** Session 15 — Signposting */
  15: {
    "Interview prep": {
      promptTitle: "Compare two previous roles you have held. Tell me which taught you more and why.",
    },
    "New manager": {
      promptTitle: "Compare two management approaches you have tried. Tell me which works better and why.",
    },
    "Client-facing": {
      promptTitle: "Compare two ways of working with clients. Tell me which drives better outcomes and why.",
    },
    "Promotion-ready": {
      promptTitle: "Compare two strategies your team could pursue. Tell me which you would back and why.",
    },
    General: {
      promptTitle: "Compare two things you have used recently — two tools, two approaches, two anything. Tell me which is better and why.",
    },
  },

  /** Session 16 — Stacked Constraints */
  16: {
    "Interview prep": {
      promptTitle: "What is the most important trend shaping your profession right now?",
    },
    "New manager": {
      promptTitle: "What is the most important shift in how teams work today?",
    },
    "Client-facing": {
      promptTitle: "What is the most important change in what clients expect from you?",
    },
    "Promotion-ready": {
      promptTitle: "What is the most important strategic shift happening in your industry?",
    },
    General: {
      promptTitle: "What is the most important change your industry will see in the next five years?",
    },
  },

  /** Session 17 — Master Answer */
  17: {
    "Interview prep": {
      promptTitle: "(Master answer plays first.) Describe your professional journey to someone considering a similar path.",
    },
    "New manager": {
      promptTitle: "(Master answer plays first.) Describe your leadership approach to someone new to your field.",
    },
    "Client-facing": {
      promptTitle: "(Master answer plays first.) Describe what you deliver to someone who has never used a service like yours.",
    },
    "Promotion-ready": {
      promptTitle: "(Master answer plays first.) Describe your strategic impact to someone outside your organisation.",
    },
    General: {
      promptTitle: "(Master answer plays first.) How would you describe what you do to someone outside your field?",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // SPRINT 04 — HOLD (Context-critical)
  // ───────────────────────────────────────────────────────────────────

  /** Session 18 — First Hot Seat */
  18: {
    "Interview prep": {
      promptTitle: "What is one career decision you made that others questioned?",
      preRecordMeta: "AI plays a skeptical interview panel. Three follow-ups.",
    },
    "New manager": {
      promptTitle: "What is one team decision you made that was unpopular but necessary?",
      preRecordMeta: "AI plays a skeptical senior stakeholder. Three follow-ups.",
    },
    "Client-facing": {
      promptTitle: "What is one negotiation stance you defended against internal pushback?",
      preRecordMeta: "AI plays a skeptical procurement lead. Three follow-ups.",
    },
    "Promotion-ready": {
      promptTitle: "What is one strategic bet you made that was not obvious to others?",
      preRecordMeta: "AI plays a skeptical board member. Three follow-ups.",
    },
    General: {
      promptTitle: "What is one decision you have made in the past year that you would defend, even if your team disagreed?",
      preRecordMeta: "60-second opener. Three AI follow-ups.",
    },
  },

  /** Session 19 — Calibrated Questions */
  19: {
    "Interview prep": {
      promptTitle: '(Audio plays: "I don\'t think you\'re the right fit for this role.") 15 seconds to respond.',
    },
    "New manager": {
      promptTitle: '(Audio plays: "I don\'t think the team is ready for this change.") 15 seconds to respond.',
    },
    "Client-facing": {
      promptTitle: '(Audio plays: "I don\'t think we can justify the cost for this.") 15 seconds to respond.',
    },
    "Promotion-ready": {
      promptTitle: '(Audio plays: "I don\'t think this is the right time for this initiative.") 15 seconds to respond.',
    },
    General: {
      promptTitle: '(Audio plays: "I don\'t think this approach is going to work for us.") 15 seconds to respond.',
    },
  },

  /** Session 20 — Tactical Empathy */
  20: {
    "Interview prep": {
      promptTitle: '(Audio: "I have had three interviews this week and I am exhausted by the process.") Mirror the last three significant words. Downward tone.',
    },
    "New manager": {
      promptTitle: '(Audio: "I feel like my voice does not matter in leadership meetings.") Mirror the last three significant words. Downward tone.',
    },
    "Client-facing": {
      promptTitle: '(Audio: "We have been burned before by vendors who promised too much.") Mirror the last three significant words. Downward tone.',
    },
    "Promotion-ready": {
      promptTitle: '(Audio: "I am not sure the board has the appetite for another big bet right now.") Mirror the last three significant words. Downward tone.',
    },
    General: {
      promptTitle: "(Audio clip plays — emotionally weighted statement.) 15 seconds. Mirror the last three significant words. Downward tone.",
    },
  },

  /** Session 21 — Accusation Audit */
  21: {
    "Interview prep": {
      promptTitle: "You are about to tell an interviewer you left your last role after only eight months. Name three objections they will have. Address one before it surfaces. 60 seconds.",
    },
    "New manager": {
      promptTitle: "You are about to tell your team their quarterly goals are being cut by 30%. Name three objections they will have. Address one before it surfaces. 60 seconds.",
    },
    "Client-facing": {
      promptTitle: "You are about to tell a long-time client their fees are increasing by 15%. Name three objections they will have. Address one before it surfaces. 60 seconds.",
    },
    "Promotion-ready": {
      promptTitle: "You are about to propose killing a legacy project your predecessor championed. Name three objections. Address one before it surfaces. 60 seconds.",
    },
    General: {
      promptTitle: "You are about to propose a six-month delay on the project to your team. 60 seconds. Name three objections. Address one before it surfaces.",
    },
  },

  /** Session 22 — The Aikido Pivot */
  22: {
    "Interview prep": {
      promptTitle: "Defend why you are the right person for this role. The interruption will come.",
    },
    "New manager": {
      promptTitle: "Defend a resource allocation decision your team disagreed with. The interruption will come.",
    },
    "Client-facing": {
      promptTitle: "Defend a recommendation a client initially pushed back on. The interruption will come.",
    },
    "Promotion-ready": {
      promptTitle: "Defend a strategic priority that was questioned by leadership. The interruption will come.",
    },
    General: {
      promptTitle: "Defend a recent decision you stand behind. The interruption will come.",
    },
  },

  /** Session 23 — Label and Pause */
  23: {
    "Interview prep": {
      promptTitle: '(Audio: "I applied for three roles last year and did not even get an interview.") Label the emotion. Hold silence for 3 seconds. No more words.',
    },
    "New manager": {
      promptTitle: '(Audio: "I have been a manager for six months and I still feel like I am pretending.") Label the emotion. Hold silence for 3 seconds. No more words.',
    },
    "Client-facing": {
      promptTitle: '(Audio: "We chose a competitor last quarter and it was a disaster.") Label the emotion. Hold silence for 3 seconds. No more words.',
    },
    "Promotion-ready": {
      promptTitle: '(Audio: "I have been passed over for promotion twice now.") Label the emotion. Hold silence for 3 seconds. No more words.',
    },
    General: {
      promptTitle: "(Audio clip plays — emotionally charged statement.) Label the emotion. Hold silence for 3 seconds. No more words.",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // SPRINT 05 — COMPOSE (Light variant)
  // ───────────────────────────────────────────────────────────────────

  /** Session 25 — Audience-Aware Framing */
  25: {
    "Interview prep": {
      promptTitle: "Recommend a change you would make in your first 90 days at a new company. Deliver it once to a CEO, once to a peer, once to a customer.",
    },
    "New manager": {
      promptTitle: "Recommend a team structure change. Deliver it once to a CEO, once to a peer, once to a customer.",
    },
    "Client-facing": {
      promptTitle: "Recommend a new service offering. Deliver it once to a CEO, once to a peer, once to a customer.",
    },
    "Promotion-ready": {
      promptTitle: "Recommend a strategic initiative. Deliver it once to a CEO, once to a peer, once to a customer.",
    },
    General: {
      promptTitle: "Recommend a meaningful change at your workplace. Deliver it once to a CEO, once to a peer, once to a customer.",
    },
  },

  /** Session 26 — Data to Story */
  26: {
    "Interview prep": {
      preRecordMeta: "Use the numbers to tell a story about a quarter where you balanced growth against quality.",
    },
    "New manager": {
      preRecordMeta: "Use the numbers to tell a story about leading a team through mixed results.",
    },
    "Client-facing": {
      preRecordMeta: "Use the numbers to tell a story about managing expectations through uneven performance.",
    },
    "Promotion-ready": {
      preRecordMeta: "Use the numbers to tell a story about making strategic trade-offs.",
    },
    General: {
      preRecordMeta: undefined,
    },
  },

  /** Session 27 — Energy Calibration */
  27: {
    "Interview prep": {
      promptTitle: "Tell the story of a moment that changed how you approach your career.",
    },
    "New manager": {
      promptTitle: "Tell the story of a moment that changed how you lead.",
    },
    "Client-facing": {
      promptTitle: "Tell the story of a moment that changed how you work with clients.",
    },
    "Promotion-ready": {
      promptTitle: "Tell the story of a moment that changed how you think about your impact.",
    },
    General: {
      promptTitle: "Tell the story of a moment that changed how you think about your work.",
    },
  },

  /** Session 28 — Hypothesis-Driven */
  28: {
    "Interview prep": {
      promptTitle: "What is the most overrated qualification in hiring right now?",
    },
    "New manager": {
      promptTitle: "What is the most overrated management practice in your organisation?",
    },
    "Client-facing": {
      promptTitle: "What is the most overrated approach in client relationships today?",
    },
    "Promotion-ready": {
      promptTitle: "What is the most overrated strategy in your industry right now?",
    },
    General: {
      promptTitle: "What is the most over-rated skill in your industry?",
    },
  },

  /** Session 29 — Full Pyramid */
  29: {
    "Interview prep": {
      promptTitle: "What is the most important investment you could make in your career right now?",
    },
    "New manager": {
      promptTitle: "What is the most important investment your team should make next year?",
    },
    "Client-facing": {
      promptTitle: "What is the most important investment your client portfolio needs?",
    },
    "Promotion-ready": {
      promptTitle: "What is the most important investment your organisation should make?",
    },
    General: {
      promptTitle: "What is the most important investment your team should make next year?",
    },
  },

  // ───────────────────────────────────────────────────────────────────
  // SPRINT 06 — PERFORM (Context-critical)
  // ───────────────────────────────────────────────────────────────────

  /** Session 31 — Hero's Journey */
  31: {
    "Interview prep": {
      promptTitle: "Tell me about a time you failed and what you learned from it.",
    },
    "New manager": {
      promptTitle: "Tell me about a team initiative that went wrong and how you got it back on track.",
    },
    "Client-facing": {
      promptTitle: "Tell me about a client relationship that started badly and ended well.",
    },
    "Promotion-ready": {
      promptTitle: "Tell me about a strategic bet that almost failed and what turned it around.",
    },
    General: {
      promptTitle: "Tell me about a project where things went wrong and you recovered.",
    },
  },

  /** Session 32 — Executive Presence */
  32: {
    "Interview prep": {
      promptTitle: "Deliver a 90-second update on your career trajectory to a skeptical executive panel.",
      preRecordMeta: "Executive panel interview. AI panelist interjects twice. Do not match the interjection.",
    },
    "New manager": {
      promptTitle: "Deliver a 90-second update on a team you lead to a skeptical senior leader.",
      preRecordMeta: "Leadership offsite. AI senior leader interjects twice. Do not match the interjection.",
    },
    "Client-facing": {
      promptTitle: "Deliver a 90-second quarterly business review update to a skeptical client executive.",
      preRecordMeta: "Quarterly business review. AI client executive interjects twice. Do not match the interjection.",
    },
    "Promotion-ready": {
      promptTitle: "Deliver a 90-second strategic update to a skeptical board member.",
      preRecordMeta: "Board presentation. AI board member interjects twice. Do not match the interjection.",
    },
    General: {
      promptTitle: "Deliver a 90-second update on a project you own to a skeptical CFO.",
      preRecordMeta: "Boardroom update. AI CFO interjects twice. Do not match the interjection.",
    },
  },

  /** Session 33 — Influence Without Authority */
  33: {
    "Interview prep": {
      promptTitle: "Convince a hiring manager that a non-traditional background brings unique value to the role.",
    },
    "New manager": {
      promptTitle: "Convince a peer in another department to adopt a process change that would help your team.",
    },
    "Client-facing": {
      promptTitle: "Convince a client stakeholder to adopt a recommendation that requires upfront effort on their side.",
    },
    "Promotion-ready": {
      promptTitle: "Convince a senior leader to sponsor an initiative you do not directly own.",
    },
    General: {
      promptTitle: "Convince a peer to adopt a change you genuinely believe would help them.",
    },
  },

  /** Session 34 — Memorable Closes */
  34: {
    "Interview prep": {
      promptTitle: "What is the most important quality you will bring to this role? 60-second body. One sentence close.",
    },
    "New manager": {
      promptTitle: "What is the most important change your team needs to make in the next year? 60-second body. One sentence close.",
    },
    "Client-facing": {
      promptTitle: "What is the most important thing your clients will need from you in the next five years? 60-second body. One sentence close.",
    },
    "Promotion-ready": {
      promptTitle: "What is the most important strategic shift your organisation must make? 60-second body. One sentence close.",
    },
    General: {
      promptTitle: "What is the most important change your industry will need to make in the next decade? 60-second body. One sentence close.",
    },
  },

  /** Session 35 — Brand Voice */
  35: {
    "Interview prep": {
      promptTitle: 'Your 60-second answer to "tell me about yourself" for a hiring manager.',
      preRecordMeta: "Open prompt. No constraints. This is your pitch.",
    },
    "New manager": {
      promptTitle: "Your 60-second introduction to a new team you are leading for the first time.",
      preRecordMeta: "Open prompt. No constraints. This is your introduction.",
    },
    "Client-facing": {
      promptTitle: "Your 60-second pitch to a new enterprise prospect in an initial meeting.",
      preRecordMeta: "Open prompt. No constraints. This is your pitch.",
    },
    "Promotion-ready": {
      promptTitle: "Your 60-second positioning statement to a senior leader who does not know your work.",
      preRecordMeta: "Open prompt. No constraints. This is your positioning.",
    },
    General: {
      promptTitle: "Deliver your 60-second elevator pitch about what you do and why it matters.",
      preRecordMeta: "Open prompt. No constraints. Your pitch.",
    },
  },
};
