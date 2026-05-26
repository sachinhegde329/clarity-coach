/* Auto-generated from ClarityCoach Session Copy.docx */
export type SessionCopyStage = {
  centre?: { stepLabel?: string; onScreenLines?: string[]; subLine?: string };
  listen?: { tidbitTitle?: string; transcript?: string; pullQuote?: string };
  do?: { constraint?: string; prompt?: string; time?: string; doMetaLine?: string; challengeType?: string; closingLine?: string };
  see?: { metricsShown?: string; headlineLine?: string; seeSubLine?: string; commentaryTemplates?: Record<string, string>; premiumUpsell?: { headline?: string; body?: string; primaryCta?: string; secondary?: string } };
  commit?: { opener?: string; commitMetaLine?: string; freeResponsePrompt?: string };
};
export type SessionCopyEntry = { sessionNumber: number; name: string; concept: string; sprintMeta: string; sprintNumber: string; sprintName: string; stages: SessionCopyStage };
export const sessionCopyEntries: SessionCopyEntry[] = [
  {
    "sessionNumber": 1,
    "name": "Baseline",
    "concept": "Hearing yourself",
    "sprintMeta": "Sprint 01 Notice   ·   Hearing yourself",
    "stages": {
      "centre": {
        "stepLabel": "A short warm-up before you speak.",
        "onScreenLines": [
          "Stand or sit upright. Jaw loose.",
          "Slow exhale through the mouth — longer than the inhale.",
          "Do it twice."
        ],
        "subLine": "A relaxed jaw and a long exhale make the first sentence easier."
      },
      "listen": {
        "tidbitTitle": "What fillers are, and why counting them helps.",
        "transcript": "One thing before you start. Fillers — um, like, so-yeah — happen because the brain needs a moment to find the next word, and the filler holds the floor while it looks. Most people speaking off the cuff use eight to fifteen per minute. That is the normal range, not a flaw to fix today. Today you will speak for ninety seconds and the app will count. You will see your number. That is all we are doing this session: getting an honest reading. The work on what to do about it starts later, once you can hear them as they happen.",
        "pullQuote": "Once you can hear a filler as it leaves your mouth, you have three options: silence, a breath, or the next word."
      },
      "do": {
        "constraint": "No constraints this session. Speak the way you usually do.",
        "prompt": "Tell me about something you did last weekend.",
        "time": "90 seconds",
        "doMetaLine": "This recording is your baseline.",
        "challengeType": "Open prompt"
      },
      "see": {
        "metricsShown": "Filler count  ·  Pace (WPM)  ·  Uptalk rate",
        "headlineLine": "These numbers describe this ninety seconds, not a trend.",
        "commentaryTemplates": {
          "high_filler": "Twelve fillers in ninety seconds. Above the typical first-session range. A useful starting number to track against.",
          "med_filler": "Six fillers in ninety seconds. Within the typical first-session range.",
          "low_filler": "Three fillers in ninety seconds. Below the typical first-session range. Later sessions focus on what to do with the space instead.",
          "pace_fast": "One hundred and seventy-two words per minute. Above the 130–150 range most listeners read as measured. Sprint two works on pace.",
          "pace_zone": "One hundred and forty-one words per minute. Inside the 130–150 range most listeners read as measured.",
          "pace_slow": "One hundred and twelve words per minute. Below the 130–150 range. Sprint two works on pace.",
          "uptalk_high": "Eight of twelve sentences ended on a rising note — statements that sound like questions. Session ten covers this.",
          "uptalk_mid": "Four of twelve sentences ended on a rising note. The other eight landed flat. A mixed pattern.",
          "uptalk_low": "One of twelve sentences ended on a rising note. Most endings landed flat."
        }
      },
      "commit": {
        "opener": "Tomorrow I will notice…",
        "commitMetaLine": "The first sprint is about noticing, nothing more."
      }
    },
    "sprintNumber": "01",
    "sprintName": "Notice"
  },
  {
    "sessionNumber": 2,
    "name": "First Notice",
    "concept": "Pace as social signal",
    "sprintMeta": "Sprint 01 Notice   ·   Pace as social signal",
    "stages": {
      "centre": {
        "stepLabel": "Inhale four. Exhale six.",
        "onScreenLines": [
          "A longer exhale than inhale. Four in, six out."
        ],
      },
      "listen": {
        "tidbitTitle": "Why pace matters",
        "transcript": "Listeners read pace before they read content. Research on first impressions puts the judgment in the first three to five seconds. Faster than 160 words per minute tends to read as rushed or anxious. Slower than 120 tends to read as hesitant or condescending. The 130–150 band is where attention shifts from how you are speaking to what you are saying. Most people don't choose their pace — they inherit it from the room they grew up speaking in. This session just measures where yours sits right now. No target.",
        "pullQuote": "Pace is the first thing a listener decides about you."
      },
      "do": {
        "constraint": "Open prompt. No target.",
        "prompt": "What was the best part of your weekend?",
        "time": "60 seconds",
        "doMetaLine": "No pace target this session. Speak the way the question lands.",
        "challengeType": "Open prompt"
      },
      "see": {
        "metricsShown": "Pace (WPM)  ·  Filler count  ·  Time to finish",
        "headlineLine": "130–150 WPM is the range most listeners read as measured.",
        "commentaryTemplates": {
          "pace_fast": "One hundred and fifty-eight words per minute. Eight WPM above the 130–150 range. Close to the upper edge — some listeners read this as energetic, some as rushed.",
          "pace_zone": "One hundred and thirty-eight words per minute. Inside the 130–150 range. Notice what this pace feels like — it is the one you will want to return to.",
          "pace_slow": "One hundred and twenty-one words per minute. Nine WPM below the 130–150 range, and nine WPM slower than session one. Pace often settles down between the first two sessions.",
          "delta_faster": "Today's pace was fourteen WPM higher than session one. Pace tends to drift up across the first week as the format becomes familiar. Worth tracking.",
          "delta_slower": "Today's pace was nine WPM lower than session one. A small drop between the first two sessions is the most common pattern."
        }
      },
      "commit": {
        "opener": "Tomorrow I will notice my pace when…",
        "commitMetaLine": "Awareness is the prerequisite. The change comes in Sprint 2."
      }
    },
    "sprintNumber": "01",
    "sprintName": "Notice"
  },
  {
    "sessionNumber": 3,
    "name": "The Pause You Miss",
    "concept": "Silence as presence",
    "sprintMeta": "Sprint 01 Notice   ·   Silence as presence",
    "stages": {
      "centre": {
        "stepLabel": "Inhale four. Hold four. Exhale four.",
        "onScreenLines": [
          "A box-breath cycle. Four seconds in, four held, four out."
        ],
        "subLine": "Three cycles. The breath-hold is the unfamiliar part — it builds tolerance for silence in speech."
      },
      "listen": {
        "tidbitTitle": "The pause you don't take",
        "transcript": "There is an asymmetry in how speakers and listeners experience silence. To the speaker mid-sentence, a two-second pause feels like falling — long, exposed, wrong. To the listener, the same two seconds reads as composure, because the speaker is visibly thinking rather than scrambling. Studies of perceived expertise find that listeners rate composed pauses as more credible than filled ones at almost any ratio. Today's session does not ask you to pause. It asks you to notice where pauses wanted to happen and were filled instead. That noticing is what makes the swap possible later.",
        "pullQuote": "To the speaker, a two-second pause feels like falling. To the listener, it reads as composure."
      },
      "do": {
        "constraint": "Open prompt. No rule.",
        "prompt": "Explain your job to someone who does not know what you do.",
        "time": "60 seconds",
        "doMetaLine": "No rule this session. Notice the moments you would rather have been silent.",
        "challengeType": "Open prompt"
      },
      "see": {
        "metricsShown": "Pause frequency  ·  Pace (WPM)  ·  Filler count",
        "headlineLine": "Pauses give listeners time to process what you just said.",
        "commentaryTemplates": {
          "pauses_low": "One pause in sixty seconds. Listeners had little processing time between sentences. This is the most common pattern at session three.",
          "pauses_mid": "Three pauses in sixty seconds. Roughly one every twenty seconds — enough to be noticed by a listener, not yet a habit.",
          "pauses_high": "Six pauses in sixty seconds. Roughly one every ten seconds — close to the rhythm of unhurried conversation.",
          "filler_high": "Explaining a familiar topic under time pressure is one of the most reliable disfluency triggers — the brain is doing two jobs at once. Twelve fillers today is the prompt doing what it was designed to do.",
          "context_line": "Many of those fillers landed where a pause would have. Sprint 2 works on the swap."
        }
      },
      "commit": {
        "opener": "Tomorrow I will pause when…",
        "commitMetaLine": "One deliberate pause is shorter than the apology that replaces it."
      }
    },
    "sprintNumber": "01",
    "sprintName": "Notice"
  },
  {
    "sessionNumber": 4,
    "name": "Energy Read",
    "concept": "Energy as variation, not volume",
    "sprintMeta": "Sprint 01 Notice   ·   Energy as variation, not volume",
    "stages": {
      "centre": {
        "stepLabel": "Say your own name. Three times. Quiet, then normal, then loud.",
        "onScreenLines": [
          "Three volumes of your name: quiet, normal, loud."
        ],
        "subLine": "Most people under-produce the loudest level. Push past the volume that feels normal."
      },
      "listen": {
        "tidbitTitle": "Vocal energy basics",
        "transcript": "Listen to one sentence, said three ways. This is the most important thing I will tell you today. This is the most important thing I will tell you today. This is the most important thing I will tell you today. Same words. Three different sentences. The difference is not volume — it is variation. Listeners track changes in pitch and stress to figure out which words matter; a monotone flattens that signal. The brain encodes varied speech into memory more reliably than uniform speech, which is one reason recorded monotone lectures are harder to recall the next day. Today the app measures your range. Most first attempts come back flat — that is the median, not a verdict.",
        "pullQuote": "Energy is not volume. It is variation."
      },
      "do": {
        "constraint": "Improvise. Three random words. One coherent story.",
        "prompt": "Tell a sixty-second story using all three of these words.",
        "time": "60 seconds",
        "doMetaLine": "Improvisation surfaces your default delivery. That default is what we are measuring today.",
        "challengeType": "Open prompt"
      },
      "see": {
        "metricsShown": "Energy score  ·  Pace (WPM)  ·  Filler count",
        "headlineLine": "Listeners recall varied speech more reliably than flat speech.",
        "commentaryTemplates": {
          "energy_low": "Energy held near-flat across the recording. The words did the work; the delivery added little to them. Sprint 5 is where we shape this on purpose.",
          "energy_mid": "Some variation, mostly in the middle of the range. The peaks and troughs are where listener attention lifts — the middle is where it settles.",
          "energy_high": "Real variation across the recording. Energy tracked the weight of the message. This is the pattern Sprint 5 will ask you to reproduce on demand.",
          "fillers_under_pressure": "Improvisation pushed fillers up. Adding a cognitive constraint to speech reliably raises disfluency — the count rising is the prompt working."
        }
      },
      "commit": {
        "opener": "Tomorrow I will match my energy to…",
        "commitMetaLine": "Change the energy and you change which words the listener remembers."
      }
    },
    "sprintNumber": "01",
    "sprintName": "Notice"
  },
  {
    "sessionNumber": 5,
    "name": "Where You Trail Off",
    "concept": "Sentence endings as authority",
    "sprintMeta": "Sprint 01 Notice   ·   Sentence endings as authority",
    "stages": {
      "centre": {
        "stepLabel": "Think of one recent win.",
        "onScreenLines": [
          "Something small is fine."
        ],
        "subLine": "Picking the moment now keeps it from being picked for you mid-recording."
      },
      "listen": {
        "tidbitTitle": "Why sentence endings matter",
        "transcript": "The last two or three words of a sentence carry the most weight. This is a memory effect — listeners weight the most recent input heavily, which is why endings disproportionately shape the impression of the whole sentence. The mechanical detail: a rising pitch on the final syllable reads as a question, a falling pitch reads as a statement. Studies of professional speakers find rising endings on 30 to 60 per cent of statements, almost always unconsciously. Today the app counts yours. The number is the diagnostic. Session 10 is where the inflection work begins.",
        "pullQuote": "The end of your sentence is what your listener remembers."
      },
      "do": {
        "constraint": "The win you already chose.",
        "prompt": "Tell me about a recent win. Something at work or in life.",
        "time": "60 seconds",
        "doMetaLine": "Tell the win you picked. Don't search for a better one mid-recording.",
        "challengeType": "Open prompt"
      },
      "see": {
        "metricsShown": "Inflection rate  ·  Pace (WPM)  ·  Filler count",
        "headlineLine": "A rising pitch on the final syllable reads as a question, even when the sentence is a statement.",
        "seeSubLine": "Inflection is the Sprint 1 metric most predictive of how listeners weigh authority.",
        "commentaryTemplates": {
          "uptalk_high": "Most sentences ended on a rising pitch. Listeners would have heard these as statements seeking approval rather than statements being made. Session 10 starts the inflection work — there is a specific physical adjustment.",
          "uptalk_mid": "A split pattern — roughly half the sentences landed, roughly half lifted. The lifted ones tend to cluster around uncertain content.",
          "uptalk_low": "Most sentences landed. The lifted ones clustered in the back half of the recording — a pattern that usually tracks fatigue or running out of planned material."
        }
      },
      "commit": {
        "opener": "Tomorrow I will end one sentence with…",
        "commitMetaLine": "A statement ends on a pitch drop. That drop is what your listener hears as full-stop."
      }
    },
    "sprintNumber": "01",
    "sprintName": "Notice"
  },
  {
    "sessionNumber": 6,
    "name": "Review — Hear Yourself",
    "concept": "Sitting with evidence",
    "sprintMeta": "Sprint 01 Notice   ·   Sitting with evidence",
    "stages": {
      "centre": {
        "stepLabel": "Today, you are the audience.",
        "onScreenLines": [
          "Today, no recording. Just listening.",
          "Hear the baseline and Session 5 with the attention you would give a colleague."
        ],
        "subLine": "No speaking from you in this Centre. Sustained attention to one's own voice is the skill being trained."
      },
      "listen": {
        "tidbitTitle": "(Replaced — instruction screen)",
        "transcript": "Today is a review. You will hear the baseline from Session 1 alongside Session 5. No new concept this session. Two recordings of you, five sessions apart. Listen for what changed, and for what did not. Stable patterns matter as much as the moving ones — they tell you what is structural and will need a specific intervention later.",
        "pullQuote": "What did not change matters as much as what did — stable patterns are the structural ones."
      },
      "do": {
        "constraint": "Listen. Do not record.",
        "prompt": "Baseline plays. Then five seconds of silence. Then session five plays.",
        "time": "≈3 minutes",
        "doMetaLine": "Take the five seconds of silence to compare — don't rush the gap.",
        "challengeType": "Side-by-side replay",
        "closingLine": "That was you, five sessions apart. The differences are the data."
      },
      "see": {
        "metricsShown": "Filler trajectory  ·  Pace stability  ·  Inflection trend",
        "headlineLine": "Five data points. Enough to see direction, not enough to predict trajectory.",
        "commentaryTemplates": {
          "trend_clear_improvement": "Fillers down across five sessions, pace settling. Both metrics moving in the same direction this early is unusual — it suggests the noticing is already shifting the behaviour, which is the expected effect once awareness lands. Five points is enough to see movement, not enough to project a curve.",
          "trend_flat": "Five points, mostly flat. This is the most common Sprint 1 shape — awareness is forming under the metrics. Sprint 2 introduces the first deliberate interventions and the numbers respond then.",
          "trend_noisy": "Five points, no clear direction yet. Day-to-day variation often exceeds the early signal — a week's worth of data is rarely enough to see the trend underneath the noise."
        }
      },
      "commit": {
        "opener": "(Free response — 30 seconds)",
        "freeResponsePrompt": "What is the one habit I most want to break?",
        "commitMetaLine": "Six sessions of noticing is the prerequisite the rest of the programme builds on."
      }
    },
    "sprintNumber": "01",
    "sprintName": "Notice"
  },
  {
    "sessionNumber": 7,
    "name": "Cutting Fillers",
    "concept": "The replacement move",
    "sprintMeta": "Sprint 02 Steady   ·   The replacement move",
    "stages": {
      "centre": {
        "stepLabel": "You are about to try something hard. Settle in.",
        "onScreenLines": [
          "You are about to try something hard.",
          "The next sixty seconds will feel unnatural. That is the point."
        ],
        "subLine": "Constraints feel like restraint. They are training."
      },
      "listen": {
        "tidbitTitle": "Filler reduction in practice",
        "transcript": "Fillers have a tell. About half a second before the um or the so forms, the jaw drops and the breath shifts forward. That window is where the move lives. When you feel it, close your mouth. Do not search for a replacement word. The substitution is silence, not vocabulary. Three things follow. The filler does not get said. The listener gets a half-second pause, which prosodic research consistently shows raises perceived confidence. And the next word, when it arrives, is usually the word you actually wanted — because the mouth had time to catch up with the brain. Inhibition is harder than substitution; closing the mouth gives the inhibition something to do. Sixty seconds. The dot beside the mic logs each filler for later. Do not watch it. Watch the feeling instead.",
        "pullQuote": "The half-second before the filler is the window.  The silence handles the rest."
      },
      "do": {
        "constraint": "No fillers. 60 seconds.",
        "prompt": "Tell me about something you are looking forward to this week.",
        "time": "60 seconds",
        "doMetaLine": "The dot logs each filler. Review after — watching it live splits attention and the move suffers.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Filler count  ·  Pace (WPM)  ·  Time on target",
        "headlineLine": "Filler count on first attempt sets your baseline for the move. The drop is across sessions, not within one.",
        "commentaryTemplates": {
          "fillers_zero": "Zero fillers across the recording. The replacement move held continuously — the substitution is already automatic for short stretches.",
          "fillers_one_two": "{n} fillers in sixty seconds. The move held for the majority of the recording — roughly one slip per thirty seconds of speech.",
          "fillers_three_four": "{n} fillers in sixty seconds. The pattern most first attempts show: cleaner front half, more slips after the thirty-second mark. Working memory loads up as the response runs, and the inhibition cost rises with it.",
          "fillers_five_plus": "{n} fillers in sixty seconds. First exposure to the constraint typically lands here. The reduction shows across the next four sessions as the half-second-before cue becomes recognisable — not through harder trying.",
          "time_on_target": "{pct}% of the recording was filler-free. Those clean stretches are where the substitution ran without conscious effort — the share grows as the cue becomes automatic.",
          "delta_better": "Today's filler count was lower than session three's by {n} — a measurable drop across four sessions of practice on the cue."
        }
      },
      "commit": {
        "opener": "Tomorrow I will catch one filler before…",
        "commitMetaLine": "Each session, the catch arrives earlier in the half-second window. That is where the count drops."
      }
    },
    "sprintNumber": "02",
    "sprintName": "Steady"
  },
  {
    "sessionNumber": 8,
    "name": "Finding Your Pace",
    "concept": "The credibility band",
    "sprintMeta": "Sprint 02 Steady   ·   The credibility band",
    "stages": {
      "centre": {
        "stepLabel": "Three breaths at the tempo you want to speak.",
        "onScreenLines": [
          "Breath cadence sets speech cadence. Slow the first; the second follows."
        ],
        "subLine": "Three slow cycles before the recording. The diaphragmatic pattern carries into the first thirty seconds of speech."
      },
      "listen": {
        "tidbitTitle": "The 130 to 150 band",
        "transcript": "One hundred and thirty to one hundred and fifty words per minute is the band most listeners read as measured. Above one sixty, perceived urgency and anxiety climb. Below one twenty, perceived uncertainty climbs, and listener comprehension actually drops because the prosodic phrasing fragments. The middle of the band — around one forty — is a defensible target for any high-stakes answer. Today the indicator beside the mic shows your running pace. The aim is not to track it. The aim is interoceptive: to learn what one forty feels like at the jaw, the chest, the breath. The indicator becomes scaffolding the longer you use it, and the body learns the rate without it.",
        "pullQuote": "130 to 150 is the band most listeners read as measured. The middle is the safe target."
      },
      "do": {
        "constraint": "Pace lock at 140 WPM. 60 seconds.",
        "prompt": "Walk me through a process you do well. Anything — your morning routine, how you onboard a client, how you make coffee.",
        "time": "60 seconds",
        "doMetaLine": "Glance the indicator, do not stare. Continuous monitoring activates dual-task load and the pace itself drifts.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Mean WPM  ·  Time in zone  ·  Pace variance",
        "headlineLine": "Twenty WPM of headroom. Drift inside it is invisible to the listener; drift across the edges is not.",
        "commentaryTemplates": {
          "in_zone_high": "{pct}% of the recording was inside the band. The pace held continuously across the prompt — including the harder middle stretch where most drift first appears.",
          "in_zone_mid": "{pct}% of the recording was inside the band. The middle held; the start ran fast (warm-up effect) and the end ran fast (recency-of-effort fatigue). Both edges respond to the centring routine.",
          "in_zone_low": "{pct}% of the recording was inside the band. The drift was mostly upward — pace climbs with cognitive load, which is why complex prompts feel fast even when the speaker does not notice. The breath cycle resets it.",
          "variance_high": "The pace moved across a thirty WPM range. The variance tracked effort, not emphasis — fast on the harder content, slow on the easier. Intentional variance, where pace serves the message, is the work of Sprint 5.",
          "variance_low": "The pace held to within ten WPM across the recording. Tight band — the breath cadence carried through the full prompt."
        }
      },
      "commit": {
        "opener": "Tomorrow I will start my hardest conversation at…",
        "commitMetaLine": "Pace resets every time the breath does. The first sentence of the next hard conversation is where to place it."
      }
    },
    "sprintNumber": "02",
    "sprintName": "Steady"
  },
  {
    "sessionNumber": 9,
    "name": "Power Pauses",
    "concept": "Three deliberate silences",
    "sprintMeta": "Sprint 02 Steady   ·   Three deliberate silences",
    "stages": {
      "centre": {
        "stepLabel": "Box breathing. Four in, four hold, four out, four hold.",
        "onScreenLines": [
          "The hold trains tolerance for silence — the same physiology as a mid-sentence pause."
        ],
        "subLine": "Two cycles. The held breath produces the same nervous-system state as a deliberate pause."
      },
      "listen": {
        "tidbitTitle": "Strategic silence",
        "transcript": "Silence in speech reads two ways, and listeners decide which within about a second. A silence that follows a completed clause, where the speaker's posture stays open and the breath finishes, reads as deliberate — it amplifies whatever came before. A silence that follows a fragment, where the eyes search and the jaw tightens, reads as searching. The acoustic gap is identical. The physical envelope is what differentiates them. Three signals carry most of the read: where in the sentence the silence falls, what the breath does during it, and whether the eyes hold or move. Today the constraint is three pauses across ninety seconds. The count is the scaffold. What you do during each pause is the actual training — and the sentence that follows a held pause almost always lands harder than the sentence that filled the gap.",
        "pullQuote": "Same acoustic gap. Different breath, eyes, and placement decide what listeners read."
      },
      "do": {
        "constraint": "Three pauses required. 90 seconds.",
        "prompt": "Explain a recent decision you made and what informed it.",
        "time": "90 seconds",
        "doMetaLine": "A ring counts each pause over half a second. Place them after completed thoughts, not in the middle of phrases.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Pause count  ·  Average pause length  ·  Pace (WPM)",
        "headlineLine": "A well-placed pause amplifies the sentence it follows. A filler removal merely cleans a sentence. Different magnitudes.",
        "commentaryTemplates": {
          "pauses_hit": "\"Three pauses, each above the half-second threshold the app counts as deliberate.",
          "pauses_short": "Three pauses, but the average ran under half a second — breath-gap territory rather than the held silence the listener reads as deliberate. Half a second is the rough perceptual threshold; below it, the gap registers as hesitation, above it, as intent.",
          "pauses_missed": "{n} pauses in ninety seconds. Under the target — the default reflex is to bridge gaps with sound. The half-second tolerance is what these sessions train.",
          "quality_strong": "The longest pause fell after the sentence carrying the most content. That placement is what produces the amplification — the silence inherits the weight of what just landed.",
          "quality_random": "The pauses landed where breath ran out, not where the sentence completed. Breath-driven pauses are the involuntary kind; sentence-driven pauses are the trained kind. The breath work in Centre is what frees the placement."
        }
      },
      "commit": {
        "opener": "Tomorrow I will pause before answering…",
        "commitMetaLine": "The first deliberate pause in a real conversation costs the most attention. The ones after run on the pattern the first one sets."
      }
    },
    "sprintNumber": "02",
    "sprintName": "Steady"
  },
  {
    "sessionNumber": 10,
    "name": "Downward Inflection",
    "concept": "The certainty sound",
    "sprintMeta": "Sprint 02 Steady   ·   The certainty sound",
    "stages": {
      "centre": {
        "stepLabel": "Hum a downward note. Repeat.",
        "onScreenLines": [
          "Hum down through two octaves. The lower register is where today's sentences will end."
        ],
        "subLine": "Descending hums prime the laryngeal muscles for the same trajectory the sentences require."
      },
      "listen": {
        "tidbitTitle": "The certainty sound",
        "transcript": "The last two words of a sentence carry disproportionate weight in how listeners judge certainty. Speech perception research is consistent on this: the terminal pitch contour is the cue listeners use to classify a sentence as statement, question, or hedge — often more strongly than the words themselves. A two-semitone drop on the final syllable reads as resolved. A flat or rising terminal reads as open, uncertain, or — at higher rises — as a question. The effect is acoustic, not personal; it operates below the level of conscious attention for the listener. Today the constraint is downward inflection on every sentence across sixty seconds. The visualiser will mark each landed terminal in green and each lifted one in parchment. Watch the feeling of the drop more than the line. The line is the receipt; the feeling is the rehearsal.",
        "pullQuote": "A two-semitone drop on the final syllable. Acoustic, not personal — listeners process it before they hear the words."
      },
      "do": {
        "constraint": "End every sentence with downward inflection. 60 seconds.",
        "prompt": "Make a recommendation. Anything — a book, a tool, a way of working.",
        "time": "60 seconds",
        "doMetaLine": "Green marks each landed terminal, parchment each lifted one. The line is the receipt — the rehearsal lives in feeling the drop at the jaw.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Inflection rate  ·  Pitch variance  ·  Pace (WPM)",
        "headlineLine": "Two semitones. Smaller than most speakers expect — the listener's ear is more sensitive to terminal pitch than to mid-sentence pitch.",
        "commentaryTemplates": {
          "inflection_strong": "{pct}% of sentences landed terminal-down. Up from session five by {delta} points — the laryngeal pattern is rehearsing itself outside the drills.",
          "inflection_mid": "{pct}% landed. The first half held the drop; terminals lifted in the back half as cognitive load climbed and the warm-up effect tapered.",
          "inflection_low": "{pct}% landed. Recommendation prompts pull the voice toward rising terminals because recommending requires hedging the listener's autonomy — the pitch tracks the social caution. Knowing this is half the unlearning.",
          "delta_better": "Inflection rate climbed by {delta} percentage points from session five — five sessions is the typical interval where the terminal pattern starts generalising.",
          "delta_worse": "Today's inflection rate was {delta} points below session five's. The prompt type matters here — recommendation prompts pull terminals up more than descriptive prompts do. The drop generalises across prompt types from Sprint 4 onward."
        }
      },
      "commit": {
        "opener": "Tomorrow I will land my recommendation with…",
        "commitMetaLine": "Two semitones on the last syllable. The sentence in front of it inherits the certainty."
      }
    },
    "sprintNumber": "02",
    "sprintName": "Steady"
  },
  {
    "sessionNumber": 11,
    "name": "Brevity",
    "concept": "The twenty per cent cut",
    "sprintMeta": "Sprint 02 Steady   ·   The twenty per cent cut",
    "stages": {
      "centre": {
        "stepLabel": "Recall the most important sentence you said today.",
        "onScreenLines": [
          "Recall a sentence from today. Strip it to its core in your head."
        ],
        "subLine": "If nothing comes to mind, use one you will say later today. The priming effect carries forward by a few hours."
      },
      "listen": {
        "tidbitTitle": "Cutting unnecessary words",
        "transcript": "A large share of professional speech carries words that can be removed without losing content. Three categories cover most of them. Throat-clearers — basically, essentially, sort of, kind of. Hedges — I think maybe, it might be that. Padding — at the end of the day, at this point in time. Each one signals to the speaker's own brain that the next word is coming, but to the listener they read as filler-with-better-vocabulary. Today the constraint is thirty seconds, hard cap, no warning. The cut-off is doing two things. It forces prioritisation under load, which exposes which words you were treating as essential and which were habit. And it shortens the gap between thought and delivery, which tends to surface the version of the answer your brain had reached before you started talking. That version is usually the one worth keeping.",
        "pullQuote": "Throat-clearers, hedges, padding. The three categories that carry most of the cuttable weight."
      },
      "do": {
        "constraint": "30-second answer. Hard cap. No warning.",
        "prompt": "What is the single most important thing you have learned in your career?",
        "time": "30 seconds",
        "doMetaLine": "The mic stops at thirty seconds with no countdown. The constraint is what produces the prioritisation, not the rehearsal.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Brevity score  ·  Pace (WPM)  ·  Time used",
        "headlineLine": "Brevity rises when time is rationed. The first thirty seconds carry the version your brain had before fluency added to it.",
        "commentaryTemplates": {
          "brevity_high": "Brevity score {n}. The thirty seconds carried mostly content; the cut-off interrupted a closing sentence rather than setup. That ordering — content first, conclusion second — is what the constraint trains.",
          "brevity_mid": "Brevity score {n}. The recording carried two or three padding sequences — typically the throat-clearers from the tidbit list. Those are the highest-yield targets across the next sessions.",
          "brevity_low": "Brevity score {n}. The first twenty seconds carried setup — context, qualification, framing — and the point landed in the last few seconds. The setup-then-conclusion order is a default that BLUF, in Sprint 3, inverts directly.",
          "fast_speech": "Pace climbed to {wpm} under the time pressure. Time pressure recruits the sympathetic system, which accelerates speech rate by default. Sprint 3 works against this — same time pressure, deliberate pace."
        }
      },
      "commit": {
        "opener": "Tomorrow I will answer one question in…",
        "commitMetaLine": "The cut that feels too aggressive is usually the one that lands. The listener's working memory has less room than the speaker thinks."
      }
    },
    "sprintNumber": "02",
    "sprintName": "Steady"
  },
  {
    "sessionNumber": 12,
    "name": "Review — First Win",
    "concept": "Trend lines and the first share moment",
    "sprintMeta": "Sprint 02 Steady   ·   Trend lines and the first share moment",
    "stages": {
      "centre": {
        "stepLabel": "The numbers are about to speak for you.",
        "onScreenLines": [
          "The numbers are about to speak for you."
        ],
        "subLine": "Eleven recordings of data. The shape of the trend is the signal; any one session is noise."
      },
      "listen": {
        "tidbitTitle": "(Replaced — instruction screen)",
        "transcript": "This is the first review screen. Four metrics across eleven recordings — fillers, pace, inflection, brevity — and a single Clarity Score that combines them. The shape of each line is the signal. Lines that drop are skills the practice generalised; lines that stayed flat are skills that need a different angle, which is what the next sprint provides. Both readings are useful — the flat lines, in particular, tell you where Sprint 3 will do the most work.",
        "pullQuote": "Eleven recordings. Trends are signal; single sessions are noise."
      },
      "do": {
        "constraint": "Replay your strongest recent session.",
        "prompt": "Listen to your best session from the past week. 30 seconds.",
        "time": "30 seconds",
        "doMetaLine": "No new recording. Listening to your own audio activates self-monitoring circuits the next sprint will draw on.",
        "challengeType": "Replay"
      },
      "see": {
        "metricsShown": "Filler trend  ·  Pace trend  ·  Inflection trend  ·  Brevity trend  ·  Clarity Score",
        "headlineLine": "Twelve sessions. The Clarity Score is now stable enough to compare against — the next twelve sessions will move it more than the first twelve did.",
        "commentaryTemplates": {
          "score_strong": "Clarity Score {n}, up {delta} from session one. All four component metrics moved in the same direction — the rarer pattern, and the one that suggests the underlying interoceptive awareness is generalising rather than improving on isolated skills.",
          "score_mixed": "Clarity Score {n}, up {delta} from session one. Fillers and pace responded; inflection did not — common, because inflection requires laryngeal control and habituation, which compounds more slowly than the cognitive moves behind fillers and pace. Sprint 3 keeps inflection in rotation while adding structural skills.",
          "score_flat": "Clarity Score {n}, within three points of session one. The first twelve sessions trade in awareness — the cost of noticing usually shows up as flat or slightly worse metrics before it shows up as improvement. The metric movement starts in Sprint 3, when the awareness gets a structural skill to act on."
        }
      },
      "commit": {
        "opener": "(Free response)",
        "freeResponsePrompt": "I have proved I can change. What is next?",
        "commitMetaLine": "Sprint 1 built awareness. Sprint 2 built three core motor skills. Sprint 3 — starting tomorrow — adds the structural moves that make those skills visible to listeners."
      }
    },
    "sprintNumber": "02",
    "sprintName": "Steady"
  },
  {
    "sessionNumber": 13,
    "name": "BLUF",
    "concept": "Bottom line up front",
    "sprintMeta": "Sprint 03 Lead   ·   Bottom line up front",
    "stages": {
      "centre": {
        "stepLabel": "What is the single most important thing you want them to remember?",
        "onScreenLines": [
          "One sentence. The conclusion."
        ],
        "subLine": "The rest of the answer is supporting the one you pick."
      },
      "listen": {
        "tidbitTitle": "Bottom line up front",
        "transcript": "Most professionals build answers the way they think them — context, complication, reasoning, conclusion. That order works on the page. In a meeting it costs you the room: by the time the conclusion arrives, the listener has been holding loose threads for forty seconds and has started filling in their own. The fix is structural. State the conclusion first. Eight seconds in, the listener should know where you stand. The reasoning lives in the next forty-five seconds, where it can do its job — supporting a verdict the listener already heard. This is the inverted pyramid; journalists use it because the most important information has the highest chance of being read. Spoken delivery has the same property: front-loaded conclusions get remembered. Today, thirty seconds. The conclusion goes in the first eight. A small notch on the timer marks the eight-second line. Cross it without a conclusion and the notch glows. Once.",
        "pullQuote": "Eight seconds to the conclusion. Forty-five seconds for the rest."
      },
      "do": {
        "constraint": "BLUF only. 30 seconds. Conclusion in the first 8.",
        "prompt": "Should your company invest more in remote work, in-office work, or hybrid? Your view, with reasoning.",
        "time": "30 seconds",
        "doMetaLine": "The notch marks eight seconds. The glow is a nudge, not a verdict.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Time to conclusion  ·  Brevity score  ·  Pace (WPM)",
        "headlineLine": "Eight seconds for the conclusion. The remainder is the supporting case.",
        "commentaryTemplates": {
          "ttc_strong": "Conclusion landed at {n} seconds. Inside the eight. The reasoning had room.",
          "ttc_mid": "Conclusion landed at {n} seconds. Two past the notch. The reasoning had to rush.",
          "ttc_late": "Conclusion landed at {n} seconds. The recording ended before it arrived. The opening seconds carried setup the question had not asked for.",
          "ttc_missed": "No clear conclusion in the recording. The reasoning was there, but the headline was not."
        }
      },
      "commit": {
        "opener": "Tomorrow I will lead with my conclusion when…",
        "commitMetaLine": "Notice where the conclusion lands in tomorrow's first answer."
      }
    },
    "sprintNumber": "03",
    "sprintName": "Lead"
  },
  {
    "sessionNumber": 14,
    "name": "Rule of 3",
    "concept": "Three points, no more",
    "sprintMeta": "Sprint 03 Lead   ·   Three points, no more",
    "stages": {
      "centre": {
        "stepLabel": "Three things you want to say today. Pick now.",
        "onScreenLines": [
          "Three. No more."
        ],
        "subLine": "Three discrete items sit in working memory. The fourth displaces the first."
      },
      "listen": {
        "tidbitTitle": "Three points, no more",
        "transcript": "The rule of three is older than rhetoric and survives because of working memory. Listeners hold three discrete items without effort. The fourth displaces the first. The fifth and sixth turn the list into noise. This is the cognitive ceiling Miller named in 1956, refined to three for spoken delivery where the listener cannot re-read. Today, exactly three points on a topic. Not two. Not four. Three. The app will count them — heuristically, leaning on transition words and pause shape, close enough to keep you honest. The count is not the lesson. Choosing which three is.",
        "pullQuote": "Three points fit. Four points compete."
      },
      "do": {
        "constraint": "Exactly three points. 60 seconds.",
        "prompt": "What makes a good manager? Three things.",
        "time": "60 seconds",
        "doMetaLine": "A ring beside the mic fills in three segments. Watch it after, not during.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Structure score  ·  Brevity score  ·  Pace (WPM)",
        "headlineLine": "Three was the constraint. Choice was the skill.",
        "commentaryTemplates": {
          "three_clean": "Three distinct points, clearly bounded. The listener could repeat them back.",
          "three_blurry": "Three points were present. The boundaries between them blurred — the second ran into the third without a verbal marker.",
          "two_only": "Two points landed. The third was implied but never made.",
          "four_plus": "More than three points appeared in the recording. The fourth diluted the first three.",
          "structure_strong": "Structure score {n}. The three were memorable.",
          "structure_weak": "Structure score {n}. The three points were stated. The shape between them was not."
        }
      },
      "commit": {
        "opener": "Tomorrow I will make three points, no more, when…",
        "commitMetaLine": "Choose three before you start. Cut the fourth in the planning, not in the recording."
      }
    },
    "sprintNumber": "03",
    "sprintName": "Lead"
  },
  {
    "sessionNumber": 15,
    "name": "Signposting",
    "concept": "Verbal headings",
    "sprintMeta": "Sprint 03 Lead   ·   Verbal headings",
    "stages": {
      "centre": {
        "stepLabel": "When did you last lose the thread of a meeting?",
        "onScreenLines": [
          "Most speakers do not signpost. Most listeners feel the cost."
        ],
        "subLine": "Signposts are written for the listener, not the speaker."
      },
      "listen": {
        "tidbitTitle": "First, second, finally",
        "transcript": "Imagine a long document with no headings, no section breaks, no bold. A wall of text. You would lose your place inside a paragraph. Unstructured professional speech does the same thing to a listener, who cannot re-read. Signposts are the verbal headings. First. Second. To begin with. Moving on. In contrast. To bring this together. They are cheap to say and they reduce the listener's working-memory load measurably. Three of them across a ninety-second response. The app will detect them — heuristically, on common patterns, forgiving variation. The count is not the work. The placement is.",
        "pullQuote": "Verbal headings. Cheap to say. Measurable cognitive savings."
      },
      "do": {
        "constraint": "Three signposts required. 90 seconds.",
        "prompt": "Compare two things you have used recently — two tools, two approaches, two anything. Tell me which is better and why.",
        "time": "90 seconds",
        "doMetaLine": "Small flags appear when the app hears a signpost. After, not during.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Signpost count  ·  Structure score  ·  Pace (WPM)",
        "headlineLine": "Headings for the listener.",
        "commentaryTemplates": {
          "signposts_three": "Three signposts. Evenly spaced. The listener had a map.",
          "signposts_clustered": "Three signposts, but two clustered in the first thirty seconds. The map ran out before the journey did.",
          "signposts_two": "Two signposts in ninety seconds. The structure was there in the head; it did not make it to the mouth.",
          "signposts_zero": "No signposts detected. The structure was in the head. It did not reach the mouth."
        }
      },
      "commit": {
        "opener": "Tomorrow I will signal my structure before…",
        "commitMetaLine": "Say the heading. Then the section."
      }
    },
    "sprintNumber": "03",
    "sprintName": "Lead"
  },
  {
    "sessionNumber": 16,
    "name": "Stacked Constraints",
    "concept": "Three rules at once",
    "sprintMeta": "Sprint 03 Lead   ·   Three rules at once",
    "stages": {
      "centre": {
        "stepLabel": "BLUF in 8. Three points. Under 50 seconds. Together.",
        "onScreenLines": [
          "Three constraints. One minute. Together."
        ],
        "subLine": "Each constraint is earned. The combination is the new load."
      },
      "listen": {
        "tidbitTitle": "Combining clarity tools",
        "transcript": "Skills are easy in isolation and harder in combination. This is dual-task load: each constraint takes attention, and attention is finite. Practised separately, BLUF and rule-of-three and brevity each cost you something; practised together, they cost more than the sum. That is normal, not a sign you have lost them. Today is the combination. BLUF in the first eight seconds. Three points. Under fifty seconds. The first attempt usually shows one constraint holding and the other two slipping. That is information about which of the three is most automatic for you. The most useful move in the next sixty seconds is to plan before you speak. Five seconds of silent structure beats ten seconds of warm-up filler.",
        "pullQuote": "Five seconds of silent planning beats ten of warm-up filler."
      },
      "do": {
        "constraint": "BLUF in 8 + Three points + Under 50 seconds.",
        "prompt": "What is the most important change your industry will see in the next five years?",
        "time": "50 seconds",
        "doMetaLine": "Three indicators run live. Plan first. Speak after.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Composite score  ·  Time to conclusion  ·  Structure score  ·  Brevity score  ·  Pace (WPM)",
        "headlineLine": "Composite score is the headline. The four below are the parts.",
        "commentaryTemplates": {
          "composite_high": "Composite score {n}. All four components inside their targets. Hold this.",
          "composite_mid": "Composite score {n}. BLUF and structure held; brevity slipped. The time cap typically slips first because it competes with the other two for attention.",
          "composite_low": "Composite score {n}. One constraint held; two slipped. Which one held is the diagnostic — it is the one most automatic in your mouth."
        }
      },
      "commit": {
        "opener": "Tomorrow I will deliver a complete argument in…",
        "commitMetaLine": "Plan five seconds. Speak the structure you planned."
      }
    },
    "sprintNumber": "03",
    "sprintName": "Lead"
  },
  {
    "sessionNumber": 17,
    "name": "Master Answer",
    "concept": "Imitation as practice",
    "sprintMeta": "Sprint 03 Lead   ·   Imitation as practice",
    "stages": {
      "centre": {
        "stepLabel": "Close your eyes. Listen first.",
        "onScreenLines": [
          "Listen to the shape, not the words."
        ],
        "subLine": "What you are about to mimic is a structure, not a script."
      },
      "listen": {
        "tidbitTitle": "Mimic and refine",
        "transcript": "Imitation is how skilled communicators learn shape. Comedians borrow each other's rhythms; trial lawyers reuse opening structures; the pattern is older than rhetoric. The cognitive basis is observational learning — mirror systems are particularly active when watching skilled motor or vocal performance, and the same systems prime production. Today you will hear a ninety-second master answer. Listen for shape — where the conclusion lands, how the supports are spaced, where the pauses fall. Then record your own ninety-second answer to the same prompt. The app measures structural similarity, not content overlap. The point is not to copy the words. It is to feel the shape of a strong answer in your own mouth.",
        "pullQuote": "Imitation is apprenticeship, not theft."
      },
      "do": {
        "constraint": "Listen once. Then answer the same prompt.",
        "prompt": "(Master answer plays first.) How would you describe what you do to someone outside your field?",
        "time": "90 seconds",
        "doMetaLine": "The master answer is a shape. Borrow the shape; speak your words.",
        "challengeType": "Comparative"
      },
      "see": {
        "metricsShown": "Structural similarity  ·  Brevity score  ·  Structure score",
        "headlineLine": "Same shape. Different words. That is the lesson.",
        "commentaryTemplates": {
          "similarity_high": "Structural similarity {pct}%. Conclusion arrived in the same window. Supports were spaced like the master answer's. Pauses fell in the same kind of place.",
          "similarity_mid": "Structural similarity {pct}%. The conclusion was in the right place; the supports drifted.",
          "similarity_low": "Structural similarity {pct}%. The content held; the shape did not borrow. Imitation is an unusual constraint — your own structure was strong enough to resist it.",
          "play_both_prompt": "Worth a listen back, side by side."
        }
      },
      "commit": {
        "opener": "Tomorrow I will mimic one phrase from…",
        "commitMetaLine": "Pick one speaker this week. Borrow one shape."
      }
    },
    "sprintNumber": "03",
    "sprintName": "Lead"
  },
  {
    "sessionNumber": 18,
    "name": "Pressure Introduction — First Hot Seat",
    "concept": "Composure under pushback",
    "sprintMeta": "Sprint 03 Lead   ·   Composure under pushback",
    "stages": {
      "centre": {
        "stepLabel": "First Hot Seat. An AI partner pushes back three times.",
        "onScreenLines": [
          "Eighteen sessions of practice precede this one.",
          "Pressure surfaces existing patterns. It does not create new ones."
        ],
        "subLine": "Four minutes. Adversarial. The first time the metrics will show pressure response."
      },
      "listen": {
        "tidbitTitle": "(Replaced — instruction screen)",
        "transcript": "This is the first Hot Seat. An AI partner pushes back three times, each follow-up harder than the last. There is no right answer to defend — the pushback is about composure, not correctness. Under adversarial load, fillers typically climb, pace spikes, and structure wobbles. That is the sympathetic response, not a failure of the work. The exercise is to notice the climb and steady the next sentence. The metrics will tell you which lever moved first; that is your individual pressure signature.",
        "pullQuote": "Adversarial load exposes which lever moves first. That is your pressure signature."
      },
      "do": {
        "constraint": "60-second opener. Three AI follow-ups.",
        "prompt": "What is one decision you have made in the past year that you would defend, even if your team disagreed?",
        "time": "≈3–4 minutes total",
        "doMetaLine": "Three follow-ups. Calm is the constraint.",
        "challengeType": "Adversarial"
      },
      "see": {
        "metricsShown": "Recovery time  ·  Composure score  ·  Structural integrity",
        "headlineLine": "Pressure changes the numbers. The change pattern is the data.",
        "commentaryTemplates": {
          "recovery_strong": "Average recovery {n} seconds. The pushback did not unsettle the structure. The third follow-up was the hardest, and it showed in pace, not in content.",
          "recovery_mid": "Average recovery {n} seconds. The first follow-up unsettled more than the third. The wobble was at the start, not under the worst of it.",
          "recovery_slow": "Average recovery {n} seconds. The structure broke at the second follow-up and rebuilt by the third. Both halves are useful information.",
          "composure": "Composure score {n}. Composite of pace stability, filler rate, and inflection consistency under load.",
          "structural": "Structural integrity {n}. The original conclusion was defended without contradiction across the three follow-ups."
        },
        "premiumUpsell": {
          "headline": "Sprint 4 starts here.",
          "body": "The Hot Seat becomes unlimited. The next eighteen sessions are premium. The first seven days are free.",
          "primaryCta": "Continue with premium — 7 days free",
          "secondary": "Free practice continues in the Library"
        }
      },
      "commit": {
        "opener": "(Anchor — bespoke)",
        "freeResponsePrompt": "Pressure cost me ___. Next time I will ___.",
        "commitMetaLine": "The cost names what to practise. The next time is when to practise it."
      }
    },
    "sprintNumber": "03",
    "sprintName": "Lead"
  },
  {
    "sessionNumber": 19,
    "name": "Calibrated Questions",
    "concept": "How and what, not why",
    "sprintMeta": "Sprint 04 Hold   ·   How and what, not why",
    "stages": {
      "centre": {
        "stepLabel": "The next push is information, not a threat.",
        "onScreenLines": [
          "Pushback carries information about what the other side needs."
        ],
        "subLine": "Your response is the variable. The question redirects it."
      },
      "listen": {
        "tidbitTitle": "How and what, not why",
        "transcript": "Why puts the listener on the defensive. Why did you do that. Why is this so expensive. Why should I trust you. The grammar of why presupposes a justification is owed, which is why the most common response to it is a defence. How and what carry the same information request without the presupposition. How did you arrive at that number. What would have to be true for this to work. The pressure on the listener drops, and the answer they give is usually more useful than the answer why would have produced. Today, you will hear a confrontational statement. You have fifteen seconds. Respond with one open, non-leading question that begins with how or what.",
        "pullQuote": "How and what carry the same request without the presupposition."
      },
      "do": {
        "constraint": "Listen to the clip. Respond with one calibrated question.",
        "prompt": "(Audio plays: 'I don't think this approach is going to work for us.') 15 seconds to respond.",
        "time": "15 seconds",
        "doMetaLine": "Open. Non-leading. How or what — not why.",
        "challengeType": "Reactive"
      },
      "see": {
        "metricsShown": "Question quality  ·  Response latency  ·  Composure score",
        "headlineLine": "Question shape and response time, side by side.",
        "commentaryTemplates": {
          "quality_strong": "Question was open, non-leading, and used how or what. The pushback was redirected without acknowledgement of threat.",
          "quality_mid": "Question was open but leading. The phrasing assumed the answer the speaker wanted.",
          "quality_low": "Response was a defence, not a question. Overriding the defensive reflex is what this sprint trains.",
          "latency_quick": "Response latency {n} seconds. The question came without searching.",
          "latency_slow": "Response latency {n} seconds. Long enough that the silence reads as searching rather than considering."
        }
      },
      "commit": {
        "opener": "Tomorrow I will ask a calibrated question when…",
        "commitMetaLine": "Two openers carry most of the work."
      }
    },
    "sprintNumber": "04",
    "sprintName": "Hold"
  },
  {
    "sessionNumber": 20,
    "name": "Tactical Empathy",
    "concept": "Mirroring",
    "sprintMeta": "Sprint 04 Hold   ·   Mirroring",
    "stages": {
      "centre": {
        "stepLabel": "Listen to the clip twice before you mirror.",
        "onScreenLines": [
          "Hearing is not agreeing.",
          "The next sentence opens once the speaker feels heard."
        ],
        "subLine": "Silence between the clip and your mirror is allowed. Required, even."
      },
      "listen": {
        "tidbitTitle": "Mirroring and labelling",
        "transcript": "Mirroring is the smallest move in negotiation training: you repeat the last one to three significant words of what someone just said, in a curious, downward tone. Two things tend to follow. The speaker keeps talking, because the mirror is an implicit invitation to continue. And the next thing they say is usually more specific than the first — the act of hearing their own words back prompts elaboration. The work today is to hear a clip and mirror it. The app measures two things: whether the words you chose were among the last three significant ones, and whether your tone went down on those words. Word choice is the easy half. The downward tone is what makes a mirror an invitation instead of a question.",
        "pullQuote": "The last three significant words, in a downward tone."
      },
      "do": {
        "constraint": "Listen. Mirror the last three significant words. Downward tone.",
        "prompt": "(Audio clip plays — emotionally weighted statement.) 15 seconds.",
        "time": "15 seconds",
        "doMetaLine": "The right three words. The downward tone. Both.",
        "challengeType": "Reactive"
      },
      "see": {
        "metricsShown": "Mirror accuracy  ·  Tone (downward)  ·  Response latency",
        "headlineLine": "Word choice and tone are scored separately.",
        "commentaryTemplates": {
          "both_right": "Mirror accurate, tone landed. The smallest move, executed cleanly.",
          "words_only": "Mirror accurate; tone lifted. The right words said as a question instead of an invitation. Worth re-listening.",
          "tone_only": "Tone landed; the words drifted from the last three significant ones. The shape was right; the targeting was off.",
          "neither": "Neither matched today. Mirroring runs against the reflex to add or to explain — first attempts commonly miss both halves."
        }
      },
      "commit": {
        "opener": "Tomorrow I will mirror one phrase when…",
        "commitMetaLine": "Word choice is the obvious half. Tone is the half you practise."
      }
    },
    "sprintNumber": "04",
    "sprintName": "Hold"
  },
  {
    "sessionNumber": 21,
    "name": "Accusation Audit",
    "concept": "Name it first",
    "sprintMeta": "Sprint 04 Hold   ·   Name it first",
    "stages": {
      "centre": {
        "stepLabel": "Imagine the room's biggest objection to what you are about to say.",
        "onScreenLines": [
          "Name the objection before they do."
        ],
        "subLine": "What you fear they will say is the thing you say first."
      },
      "listen": {
        "tidbitTitle": "Name it first",
        "transcript": "Most difficult conversations carry an unspoken objection — the cost, the delay, the prior failure, the political read. Left unspoken, the listener spends part of their attention rehearsing it instead of following the speaker. Naming the objection yourself transfers it from listener to speaker, which collapses the rehearsal loop. You are over budget. You are late. This will be unpopular. We have tried this before and it did not work. The same words said by you instead of waited for by them carry different weight — yours is acknowledgement, theirs would have been a challenge. Today, you will be given a scenario and asked to identify three objections that would land in the first thirty seconds. Then you will address one of them, in your own words, before it surfaces. AI grading reads what you said and how the acknowledgement is framed.",
        "pullQuote": "An objection said by you is acknowledgement. The same words from them are a challenge."
      },
      "do": {
        "constraint": "Name three objections. Address one before it surfaces.",
        "prompt": "You are about to propose a six-month delay on the project to your team. 60 seconds.",
        "time": "60 seconds",
        "doMetaLine": "This session is AI-graded. The score lives in your transcript, not your timer.",
        "challengeType": "Reactive"
      },
      "see": {
        "metricsShown": "Audit fluency  ·  Pre-emption credibility  ·  Structural quality",
        "headlineLine": "Three objections named. One owned in your words.",
        "commentaryTemplates": {
          "ai_disclaimer": "This session was graded against the transcript by AI. The numbers are interpretive, not deterministic.",
          "credibility_strong": "The objection was named in the speaker's own words and addressed without sycophancy or over-apology.",
          "credibility_mid": "The objection was named; the response leaned on hedges or softeners that diluted the ownership.",
          "credibility_weak": "The objection was named, but the response defended it rather than sat with it. Acknowledgement without immediate defence is what the metric rewards."
        }
      },
      "commit": {
        "opener": "Tomorrow I will name the elephant in the room when…",
        "commitMetaLine": "Naming, then a beat. Not naming, then a justification."
      }
    },
    "sprintNumber": "04",
    "sprintName": "Hold"
  },
  {
    "sessionNumber": 22,
    "name": "The Aikido Pivot",
    "concept": "Acknowledge and redirect",
    "sprintMeta": "Sprint 04 Hold   ·   Acknowledge and redirect",
    "stages": {
      "centre": {
        "stepLabel": "You will be interrupted once between 12 and 28 seconds in.",
        "onScreenLines": [
          "The interruption is information.",
          "The next two seconds decide whether your original point returns."
        ],
        "subLine": "Acknowledge. Pivot. Continue."
      },
      "listen": {
        "tidbitTitle": "Acknowledge and redirect",
        "transcript": "Interruptions usually arrive carrying two things at once: a point about the content, and a request to be heard. Engaging only with the content drags the conversation onto the interrupter's ground, where finishing your original sentence becomes a second interruption of your own. The pivot moves you back to the point you were making, while crediting the part of the interruption that asked for acknowledgement. Three beats. Acknowledge — yes, that is a fair concern. Pivot — and what I want to come back to is. Continue — the original sentence, finished. Two of the beats are scripts. The third is the sentence you were going to say anyway. Today, the AI partner will interrupt you once between twelve and twenty-eight seconds in. The recording keeps running. Acknowledge, pivot, continue.",
        "pullQuote": "Acknowledge. Pivot. Continue. Three beats."
      },
      "do": {
        "constraint": "90-second response. One AI interruption between 12s and 28s.",
        "prompt": "Defend a recent decision you stand behind. The interruption will come.",
        "time": "90 seconds",
        "doMetaLine": "You will hear it. Keep speaking. The structure is the proof.",
        "challengeType": "Adversarial"
      },
      "see": {
        "metricsShown": "Pivot recovery time  ·  Structural integrity  ·  Composure score",
        "headlineLine": "Recovery time, plus whether the original point returned.",
        "commentaryTemplates": {
          "recovery_fast": "Pivot recovery {n} seconds. The acknowledgement was brief, the pivot was clean, and the original point landed.",
          "recovery_mid": "Pivot recovery {n} seconds. The acknowledgement was sufficient; the pivot drifted into the interruption's territory.",
          "recovery_slow": "Pivot recovery {n} seconds. The response engaged with the interruption's content; the original point did not return.",
          "structural_held": "Original conclusion was defended after the interruption.",
          "structural_lost": "Original conclusion was not returned to. The acknowledgement landed; the continue beat did not."
        }
      },
      "commit": {
        "opener": "Tomorrow I will not let an interruption knock me off…",
        "commitMetaLine": "Three beats. Then your sentence."
      }
    },
    "sprintNumber": "04",
    "sprintName": "Hold"
  },
  {
    "sessionNumber": 23,
    "name": "Label and Pause",
    "concept": "Name the emotion, then stop",
    "sprintMeta": "Sprint 04 Hold   ·   Name the emotion, then stop",
    "stages": {
      "centre": {
        "stepLabel": "You are about to acknowledge someone's emotion. Then stop talking for three seconds.",
        "onScreenLines": [
          "Naming. Then silence.",
          "Three seconds, timed by the ring."
        ],
        "subLine": "The silence is the part the metric scores."
      },
      "listen": {
        "tidbitTitle": "Emotional acknowledgement",
        "transcript": "When the room is hot — frustration, fear, anger, fatigue — the common responses are to match the temperature or to act as if nothing is happening. Matching escalates. Ignoring leaves the emotion to drive whatever the speaker says next. The third option, affect labelling, names the emotion in the lightest possible language and then stops. It sounds like you are frustrated. It seems like this matters more than the meeting can hold. It feels like we are stuck. Then three seconds of nothing. The neuroscience underneath this is well documented — naming an emotion engages prefrontal regulation and reduces limbic arousal, in the speaker doing the naming and often in the person being named. What you hear in response is usually either a correction — no, it is not frustration, it is — or an expansion. Both are more useful than the defence or counter the silence prevented.",
        "pullQuote": "Light language. Three seconds. No follow-up sentence."
      },
      "do": {
        "constraint": "Listen. Label the emotion. Hold silence for 3 seconds. No more words.",
        "prompt": "(Audio clip plays — emotionally charged statement.) Label. Hold.",
        "time": "≈15 seconds",
        "doMetaLine": "Three seconds is longer than it feels. The ring will tell you.",
        "challengeType": "Adversarial"
      },
      "see": {
        "metricsShown": "Pause hold time  ·  Label appropriateness  ·  Composure score",
        "headlineLine": "Pause hold and label fit — both have to land.",
        "commentaryTemplates": {
          "hold_full": "Pause held for {n} seconds. The full three or longer. Discipline carried.",
          "hold_partial": "Pause held for {n} seconds. Short. The reflex to continue surfaced before the three was up.",
          "hold_failed": "Pause held for under one second. The label landed, but the silence did not follow.",
          "label_fit": "Label landed on an emotion the clip actually carried. Light language, no over-claim.",
          "label_off": "Label named an emotion the clip did not carry strongly. Lighter language — it sounds like, it seems like — leaves room for the speaker to correct without escalation."
        }
      },
      "commit": {
        "opener": "Tomorrow I will name what someone is feeling and then…",
        "commitMetaLine": "The hardest part of the move is the absence of a next sentence."
      }
    },
    "sprintNumber": "04",
    "sprintName": "Hold"
  },
  {
    "sessionNumber": 24,
    "name": "Review — Pressure Replay",
    "concept": "Re-attempt the toughest moment",
    "sprintMeta": "Sprint 04 Hold   ·   Re-attempt the toughest moment",
    "stages": {
      "centre": {
        "stepLabel": "Re-record the Sprint 4 session where the metrics were weakest.",
        "onScreenLines": [
          "You are about to face it once more."
        ],
        "subLine": "Same scenario. Different you."
      },
      "listen": {
        "tidbitTitle": "(Replaced — instruction screen)",
        "transcript": "Today you re-record one Hot Seat from this sprint — the session where pivot recovery, composure, or structural integrity scored lowest. Same audio clip. Same time limit. The original recording and the new one appear side by side on the See screen, with each metric's delta between them.",
        "pullQuote": "Same clip, same clock. The deltas are between the two recordings."
      },
      "do": {
        "constraint": "Re-attempt your weakest Hot Seat from sessions 19–23.",
        "prompt": "(The session's original prompt replays. Then the mic activates for the fresh attempt.)",
        "time": "Variable",
        "doMetaLine": "Same scenario. Different you.",
        "challengeType": "Pressure Replay"
      },
      "see": {
        "metricsShown": "Recovery delta  ·  Composure delta  ·  Structural delta",
        "headlineLine": "Three deltas. Each one is a different question.",
        "commentaryTemplates": {
          "delta_better": "Recovery faster by {n} seconds. Composure score up {pts}. Structural integrity up {pts}. The sprint did what it was meant to do.",
          "delta_mixed": "Recovery faster by {n} seconds; composure score unchanged. Faster pivots without a calmer baseline often mean the acknowledgement beat shortened rather than the regulation improving.",
          "delta_flat": "Deltas under three points across all three metrics. The next session loops on the weakest skill of the sprint.",
          "adaptive_trigger": "Adaptive remediation will surface in your next session."
        }
      },
      "commit": {
        "opener": "(Free) What pressure am I now ready for?",
        "commitMetaLine": "Two sprints of pressure work behind you. Sprint 5 moves to composition."
      }
    },
    "sprintNumber": "04",
    "sprintName": "Hold"
  },
  {
    "sessionNumber": 25,
    "name": "Audience-Aware Framing",
    "concept": "Same truth, three frames",
    "sprintMeta": "Sprint 05 Compose   ·   Same truth, three frames",
    "stages": {
      "centre": {
        "stepLabel": "Three audiences. One message. You will deliver it three times.",
        "onScreenLines": [
          "One recommendation. Three framings."
        ],
        "subLine": "The message is constant. The framing is the variable."
      },
      "listen": {
        "tidbitTitle": "One message, three audiences",
        "transcript": "The mistake most professionals make about audience is to think it changes the message. It does not. It changes the framing. The same recommendation — for example, that the team should adopt a new tool — sounds different to a CEO, a peer, and a customer, but the recommendation is the same. To the CEO, the framing is impact and risk. To the peer, the framing is workload and rollout. To the customer, the framing is outcome and continuity. Same recommendation. Three frames. The work today is the same recommendation, three times, thirty seconds each. The app will check that the recommendation stayed constant and that the framings actually differed. The reflex, on a first attempt, is to soften the recommendation for the harder audience. Resist it. The whole skill is keeping the message intact while moving the frame.",
        "pullQuote": "Impact and risk for the CEO. Workload for the peer. Outcome for the customer."
      },
      "do": {
        "constraint": "Same recommendation. Three audiences. 30 seconds each.",
        "prompt": "Recommend a meaningful change at your workplace. Deliver it once to a CEO, once to a peer, once to a customer.",
        "time": "90 seconds total",
        "doMetaLine": "Triptych on screen. The active recording highlights.",
        "challengeType": "Comparative"
      },
      "see": {
        "metricsShown": "Framing fluency  ·  Structural consistency  ·  Pace stability",
        "headlineLine": "Two checks: the recommendation held, the framings differed.",
        "commentaryTemplates": {
          "all_three_distinct": "All three framings landed with the audience in view. The recommendation held across the three.",
          "two_of_three": "Two framings distinct, one drifted. The peer version is most often the one that slips toward the CEO frame.",
          "framings_flat": "The three framings sounded similar. The audience changed; the language did not.",
          "message_drifted": "The recommendation softened between the first and third delivery. The strength of the position is the variable that should not move — the framing is."
        }
      },
      "commit": {
        "opener": "Tomorrow I will reframe one message for…",
        "commitMetaLine": "The framing is the variable. The recommendation is the constant."
      }
    },
    "sprintNumber": "05",
    "sprintName": "Compose"
  },
  {
    "sessionNumber": 26,
    "name": "Data to Story",
    "concept": "Numbers that breathe",
    "sprintMeta": "Sprint 05 Compose   ·   Numbers that breathe",
    "stages": {
      "centre": {
        "stepLabel": "Recall a fact that changed your mind. What was the story it lived inside?",
        "onScreenLines": [
          "Data alone is hard to remember.",
          "Data inside a story is what the listener keeps."
        ],
        "subLine": "The story carries the number. The number is what the listener remembers."
      },
      "listen": {
        "tidbitTitle": "Numbers that breathe",
        "transcript": "Numbers delivered in sequence — twenty-three percent here, eighty-four percent there, four hundred and twelve million in total — do not stick. The listener processes each number, loses the previous one, and by the fourth has retained none. A number anchored to a person, a decision, or a moment behaves differently. Twenty-three percent sales growth, on its own, is forgettable. Twenty-three percent sales growth in a quarter where every competitor lost share is the kind of number that survives the meeting. The mechanism is narrative anchoring — context attaches the number to existing memory structures, which is what recall depends on. Today, you will see a small data set on screen. Three or four numbers. You have sixty seconds to deliver a narrative that makes them stick. The numbers must appear. The story is yours.",
        "pullQuote": "A number with context attaches to memory. A number without context does not."
      },
      "do": {
        "constraint": "60-second narrative. The numbers must land.",
        "prompt": "(On-screen data: Sales grew 23%. Team grew 5%. Customer satisfaction dropped 8 points.)",
        "time": "60 seconds",
        "doMetaLine": "Ten seconds to scan. Then the mic.",
        "challengeType": "Reactive"
      },
      "see": {
        "metricsShown": "Narrative quality  ·  Brevity score  ·  Structure score",
        "headlineLine": "Three checks: did the numbers land, did the structure hold, did the story carry weight.",
        "commentaryTemplates": {
          "all_three": "Narrative carried all three axes. The data lived inside a person, a moment, a stake.",
          "two_axes": "Narrative landed on two of three. The data was anchored; the emotional weight was thin.",
          "one_axis": "Narrative landed on one axis. The numbers appeared in sequence rather than inside a story.",
          "ai_disclaimer": "Narrative quality is AI-graded. The score interprets the transcript."
        }
      },
      "commit": {
        "opener": "Tomorrow I will turn one statistic into…",
        "commitMetaLine": "The number is what they remember. The moment is why."
      }
    },
    "sprintNumber": "05",
    "sprintName": "Compose"
  },
  {
    "sessionNumber": 27,
    "name": "Energy Calibration",
    "concept": "Match tone to message weight",
    "sprintMeta": "Sprint 05 Compose   ·   Match tone to message weight",
    "stages": {
      "centre": {
        "stepLabel": "The same phrase, three volumes. Quiet, normal, loud.",
        "onScreenLines": [
          "Range is the variable."
        ],
        "subLine": "The emphatic version is what the upper register is for. Use it."
      },
      "listen": {
        "tidbitTitle": "Match tone to message weight",
        "transcript": "Energy variance is not loudness; it is deliberate range. The most important sentence of a response should not sound the same as the least important. When every sentence comes out at the same volume, pace, and affect, the listener's attention defaults to the content — and content alone rarely carries the weight an emphatic sentence is meant to. Three registers do the work. Quiet to bring the listener in close. Normal to carry the body of the response. Emphatic — which is volume, pitch, and pace together, not volume alone — to land the sentence that has to land. Today, you will deliver a ninety-second response and shift register three times. The app will measure variance and whether the placement matched the message. Random fluctuation does not count as range.",
        "pullQuote": "Three registers: quiet, normal, emphatic. Placement matters more than spread."
      },
      "do": {
        "constraint": "Vary energy across three sections. 90 seconds.",
        "prompt": "Tell the story of a moment that changed how you think about your work.",
        "time": "90 seconds",
        "doMetaLine": "The energy meter runs vertical. Quiet, normal, emphatic. Three sections.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Energy variance  ·  Energy intentionality  ·  Pace (WPM)",
        "headlineLine": "Variance shows the range. Intentionality shows the placement.",
        "commentaryTemplates": {
          "intentional_high": "Variance matched message weight. The emphatic moment landed where the story asked for it.",
          "intentional_mid": "Variance was present; placement was uneven. The quiet section came near the end, after the climax had passed.",
          "intentional_low": "Variance was present but not aligned. The energy moved with effort, not message.",
          "variance_flat": "Variance under {threshold}. The recording held one register. The placement metric is suspended for sessions where range is flat — it scores only when there is range to place."
        }
      },
      "commit": {
        "opener": "Tomorrow I will land my most important sentence at…",
        "commitMetaLine": "The emphatic register works because it is rare in the recording."
      }
    },
    "sprintNumber": "05",
    "sprintName": "Compose"
  },
  {
    "sessionNumber": 28,
    "name": "Hypothesis-Driven",
    "concept": "Lead with the answer",
    "sprintMeta": "Sprint 05 Compose   ·   Lead with the answer",
    "stages": {
      "centre": {
        "stepLabel": "Ten seconds to state a position. Fifty seconds to defend it.",
        "onScreenLines": [
          "Commit to a position.",
          "Defend it for fifty seconds."
        ],
        "subLine": "The hedge counter is live. Use it as a brake."
      },
      "listen": {
        "tidbitTitle": "Lead with the answer, then prove it",
        "transcript": "A hedged hypothesis is harder to respond to than a wrong one. A wrong hypothesis can be pushed back on, corrected, or built upon — the listener has something to grip. A hedged one — I think maybe, it might be that, in some cases — gives the listener nothing to engage with except the hedge itself, which usually ends the exchange in agreement neither party meant. The cost of hedging is not that the speaker sounds uncertain. The cost is that the conversation stops moving. Today, you have ten seconds to state a bold hypothesis on a topic, and fifty seconds to support it. The hedge counter is live. Phrases like I think maybe, it might be that, in some cases — the app counts them as hedges and the score reflects it. The task is not to be reckless. The task is to commit, in language, to a position you can defend.",
        "pullQuote": "A wrong hypothesis can be corrected. A hedged one cannot be engaged with."
      },
      "do": {
        "constraint": "10-second hypothesis. 50-second support. No hedging.",
        "prompt": "What is the most over-rated skill in your industry?",
        "time": "60 seconds",
        "doMetaLine": "A notch marks ten seconds. By then, your position should be on the table.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Hypothesis clarity  ·  Support quality  ·  Pace (WPM)",
        "headlineLine": "Hypothesis clarity scored on the first ten seconds. Support quality on the next fifty.",
        "commentaryTemplates": {
          "hypothesis_crisp": "Hypothesis was unambiguous, hedge-free, and landed inside ten seconds.",
          "hypothesis_hedged": "Hypothesis arrived inside ten seconds but carried {n} hedges. The position softened in language while staying in content.",
          "hypothesis_late": "Hypothesis arrived after the ten-second mark. The first sentences carried setup.",
          "support_strong": "Three supports, distinct, each anchored.",
          "support_weak": "Supports drifted into restatement of the hypothesis. The position was held; the proof was thin."
        }
      },
      "commit": {
        "opener": "Tomorrow I will share a hypothesis before…",
        "commitMetaLine": "The first ten seconds carry the position. The next fifty carry the proof."
      }
    },
    "sprintNumber": "05",
    "sprintName": "Compose"
  },
  {
    "sessionNumber": 29,
    "name": "Full Pyramid",
    "concept": "Conclusion plus three supports",
    "sprintMeta": "Sprint 05 Compose   ·   Conclusion plus three supports",
    "stages": {
      "centre": {
        "stepLabel": "Conclusion, three supports, one minute. The structure you have been building toward.",
        "onScreenLines": [
          "Conclusion. Three supports. Sixty seconds."
        ],
        "subLine": "The pyramid graphic fills as components land — it is for your post-recording review."
      },
      "listen": {
        "tidbitTitle": "Conclusion plus three supports",
        "transcript": "The pyramid is the structure Barbara Minto codified at McKinsey in the 1970s — conclusion at the top, three mutually exclusive supports below it, one piece of evidence under each. It has held up because of the asymmetry between how arguments are built and how they are received. Building an argument is bottom-up — setup, reasoning, conclusion. Receiving one works in reverse: the listener wants the conclusion first, so they know what to evaluate the rest against. Delivering bottom-up makes the listener wait for the point. Delivering pyramid means the point is already on the table by sentence two, and the next fifty seconds are evidence. Today, you have sixty seconds to deliver a full pyramid. Conclusion in the first ten. Three supports, roughly fifteen seconds each. The graphic fills as the app detects each component.",
        "pullQuote": "Built bottom-up. Delivered top-down. Same argument, reversed."
      },
      "do": {
        "constraint": "Full pyramid. 60 seconds. Conclusion in first 10.",
        "prompt": "What is the most important investment your team should make next year?",
        "time": "60 seconds",
        "doMetaLine": "The pyramid fills as components land. Speak; do not watch.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Structure quality  ·  Brevity score  ·  Pace (WPM)",
        "headlineLine": "Four components. The graphic shows which landed.",
        "commentaryTemplates": {
          "full_pyramid": "Conclusion plus three distinct, anchored supports. The pyramid completed.",
          "three_of_four": "Three of the four components landed. The fourth — most often the third support — was implied but not delivered.",
          "conclusion_only": "Conclusion landed. The three supports ran together — explicit transitions (first, second, third — or one signpost per support) is what separates them for the listener and the detector.",
          "structure_score": "Structure quality {n}. Composite of conclusion clarity, support distinctness, and time discipline."
        }
      },
      "commit": {
        "opener": "Tomorrow I will pyramid one argument when…",
        "commitMetaLine": "The conclusion in the first ten seconds. The supports in the next fifty."
      }
    },
    "sprintNumber": "05",
    "sprintName": "Compose"
  },
  {
    "sessionNumber": 30,
    "name": "Lab Session — One Metric, Nothing Else",
    "concept": "Depth over breadth",
    "sprintMeta": "Sprint 05 Compose   ·   Depth over breadth",
    "stages": {
      "centre": {
        "stepLabel": "Pick one metric. The rest hide for this session.",
        "onScreenLines": [
          "Choose the metric you will live inside for the next five minutes."
        ],
        "subLine": "The others are still being measured. They are just not on screen."
      },
      "listen": {
        "tidbitTitle": "(Replaced — selection screen)",
        "transcript": "Three metrics, from your recent trend, are surfaced below. The weakest. The strongest. One in the middle. Choose one. For this session only, the See screen will show that metric and nothing else.",
        "pullQuote": "One metric on screen. The other five still recording in the background."
      },
      "do": {
        "constraint": "Challenge selected by the engine. Lens chosen by you.",
        "prompt": "(Challenge type matches the chosen metric — e.g. pace-lock if pace was chosen.)",
        "time": "60 seconds",
        "doMetaLine": "Live feedback collapses to the metric you chose.",
        "challengeType": "Constraint (lens-driven)"
      },
      "see": {
        "metricsShown": "(Single chosen metric)",
        "headlineLine": "Your chosen metric, delta against trend.",
        "commentaryTemplates": {
          "single_metric": "{Metric} {n}. {Delta vs trend.} {One sentence of commentary on the chosen metric only.}",
          "history_line": "The rest is in your history if you want it."
        }
      },
      "commit": {
        "opener": "In my next session, this metric will…",
        "commitMetaLine": "Sprint 6 returns the full dashboard. Sprint 5 ends on focus."
      }
    },
    "sprintNumber": "05",
    "sprintName": "Compose"
  },
  {
    "sessionNumber": 31,
    "name": "Hero's Journey",
    "concept": "Four-beat arc",
    "sprintMeta": "Sprint 06 Perform   ·   Four-beat arc",
    "stages": {
      "centre": {
        "stepLabel": "Recall a project where something went wrong, and you recovered. That is today's story.",
        "onScreenLines": [
          "Stakes. Complication. Resolution. Lesson.",
          "Four beats. The arc the tidbit will name."
        ],
        "subLine": "The story is yours. The structure is what the session adds."
      },
      "listen": {
        "tidbitTitle": "Story arcs in business",
        "transcript": "A complete business story carries four beats. The setup, where the listener learns what was at stake. The complication, where something went wrong. The resolution, where a decision was made and the outcome landed. The lesson, where the story connects to whatever conversation it sits inside. The four are not stylistic; they map to how listeners process narrative. The setup loads the working-memory frame. The complication creates the tension that makes the resolution worth tracking. The lesson is what turns the recollection into something the listener can use. Drop any one, and the listener has to do the missing work themselves — which is why a story without a lesson reads as a report. Today, you will tell a project recovery story with all four beats. The AI partner will prompt for missing beats if you skip them. Three prompts maximum. Incorporate them without breaking the flow of what you are saying.",
        "pullQuote": "Setup. Complication. Resolution. Lesson. Each one does work the others cannot."
      },
      "do": {
        "constraint": "Tell a project recovery story. AI prompts for missing beats.",
        "prompt": "Tell me about a project where things went wrong and you recovered.",
        "time": "≈3 minutes",
        "doMetaLine": "Three prompts at most. Incorporate; do not interrupt yourself.",
        "challengeType": "Adversarial (narrative)"
      },
      "see": {
        "metricsShown": "Arc completeness  ·  Narrative quality  ·  Pace (WPM)",
        "headlineLine": "Arc completeness scores presence. Narrative quality scores delivery.",
        "commentaryTemplates": {
          "arc_full": "All four beats landed without prompting. Setup, complication, resolution, lesson — each given its own weight.",
          "arc_prompted": "{n} prompts surfaced. The missing beats were the lesson and the resolution. The recall pattern is consistent — under time pressure the body of the story expands and the closing beats compress.",
          "arc_partial": "Setup and complication landed. Resolution and lesson were implied, not delivered.",
          "ai_disclaimer": "Narrative quality is AI-graded."
        }
      },
      "commit": {
        "opener": "Tomorrow I will tell my own story with all four…",
        "commitMetaLine": "The lesson is the beat that runs out of time. Decide it before you start."
      }
    },
    "sprintNumber": "06",
    "sprintName": "Perform"
  },
  {
    "sessionNumber": 32,
    "name": "Executive Presence",
    "concept": "Authority signals",
    "sprintMeta": "Sprint 06 Perform   ·   Authority signals",
    "stages": {
      "centre": {
        "stepLabel": "Boardroom update. AI CFO. Two interjections you cannot match.",
        "onScreenLines": [
          "Pace under 140. Inflection down. Pauses owned."
        ],
        "subLine": "Four signals scored independently. The composite is the authority score."
      },
      "listen": {
        "tidbitTitle": "Authority signals in voice",
        "transcript": "Executive presence in voice is built from four signals. Pace, measured — at or under 140 WPM, the upper edge of the band you worked in across Sprint 2. Inflection, consistently downward — the last two words of each sentence land, the technique from Session 10. Pauses, held cleanly — owned silences rather than searched ones, from Session 9 and Session 23. Energy, ceilinged — the loudest sentence is half a notch above the rest, not three notches, from Session 27. None of the four is new. What makes this session different is the sustained combination under adversarial load — two CFO interjections, ninety seconds, all four signals held simultaneously. Today you deliver a boardroom update. The AI CFO interjects twice. You do not change topic, you do not change pace, you do not lose the floor. The composite is the four signals, scored together.",
        "pullQuote": "Four signals, sustained for ninety seconds, under two interjections."
      },
      "do": {
        "constraint": "Boardroom update. AI CFO interjects twice.",
        "prompt": "Deliver a 90-second update on a project you own to a skeptical CFO.",
        "time": "≈2 minutes",
        "doMetaLine": "Do not match the interjection. Acknowledge briefly; continue at your pace.",
        "challengeType": "Adversarial"
      },
      "see": {
        "metricsShown": "Authority score  ·  Composure under interjection  ·  Structure score",
        "headlineLine": "Authority score = pace × inflection × pause × energy, each held under interjection.",
        "commentaryTemplates": {
          "authority_strong": "Authority score {n}. Pace held inside the band. Inflection landed consistently. Pauses were owned. Energy ceiling held.",
          "authority_mid": "Authority score {n}. Two of four signals held. Pace and inflection were the held; pauses and energy slipped under the interjection.",
          "authority_low": "Authority score {n}. The interjection moved the pace, the inflection, or both. The structure recovered; the signals did not."
        }
      },
      "commit": {
        "opener": "Tomorrow I will speak in a senior meeting the way I just…",
        "commitMetaLine": "The four signals are old. Holding them together under load is the new skill."
      }
    },
    "sprintNumber": "06",
    "sprintName": "Perform"
  },
  {
    "sessionNumber": 33,
    "name": "Influence Without Authority",
    "concept": "Persuasion in service",
    "sprintMeta": "Sprint 06 Perform   ·   Persuasion in service",
    "stages": {
      "centre": {
        "stepLabel": "What does the other person actually care about?",
        "onScreenLines": [
          "What does the listener have at stake here?",
          "Naming it is the precondition."
        ],
        "subLine": "The grader flags principles deployed against the listener's interest."
      },
      "listen": {
        "tidbitTitle": "Cialdini in practice",
        "transcript": "Cialdini's six principles — reciprocity, social proof, authority, scarcity, liking, consistency — describe the levers most often involved when one adult changes another adult's mind. The same six levers, used against the listener's interest, are also how most manipulation works; the principles themselves are neutral. Reciprocity is giving before asking. Social proof is showing the listener that others like them have moved. Authority is borrowing credibility. Scarcity is honesty about constraints. Liking is finding common ground. Consistency is anchoring to something the listener already believes. The line between persuasion and manipulation is whose interest the deployment serves. Today, you will persuade a skeptical peer on a position you genuinely believe would help them. The peer pushes back. The AI grading reports which principles you deployed and whether each deployment served the listener's stake or borrowed against it.",
        "pullQuote": "The six levers are neutral. Whose interest they serve is not."
      },
      "do": {
        "constraint": "Persuade a skeptical peer. 90-second exchange.",
        "prompt": "Convince a peer to adopt a change you genuinely believe would help them.",
        "time": "≈90 seconds",
        "doMetaLine": "The peer will push back. The principles are tools. Use them in service.",
        "challengeType": "Adversarial"
      },
      "see": {
        "metricsShown": "Persuasion quality  ·  Principle usage  ·  Composure score",
        "headlineLine": "Three reads: did the peer soften, which principles fired, was each one in service.",
        "commentaryTemplates": {
          "softened_yes": "The peer's position softened by the third exchange. The principles deployed were {list} — used in service of the listener's stake.",
          "softened_no": "The peer's position did not soften. The principles deployed were {list}. Most no-soften recordings carry one consistent pattern — the principles fired before the listener's stake was named. Re-listen for whether your first 15 seconds included a stake reference.",
          "manipulation_flag": "One principle was deployed in a frame the AI grader read as manipulation rather than service. Worth re-listening to."
        }
      },
      "commit": {
        "opener": "Tomorrow I will persuade one peer of one position without…",
        "commitMetaLine": "The stake reference, then the lever. The order tends to matter more than the lever."
      }
    },
    "sprintNumber": "06",
    "sprintName": "Perform"
  },
  {
    "sessionNumber": 34,
    "name": "Memorable Closes",
    "concept": "The sentence they repeat",
    "sprintMeta": "Sprint 06 Perform   ·   The sentence they repeat",
    "stages": {
      "centre": {
        "stepLabel": "What sentence do you want them to repeat tomorrow?",
        "onScreenLines": [
          "One sentence.",
          "Decided before the body of the answer begins."
        ],
        "subLine": "Recency effect — the closing sentence is what the listener encodes most strongly."
      },
      "listen": {
        "tidbitTitle": "End with a line that lands",
        "transcript": "A close is the single sentence at the end of an answer that the listener will still remember tomorrow. The body of the answer is what brings the listener to it; the close is what they walk out with. The recency effect is well documented — the last item in a sequence is recalled disproportionately, and a deliberate final sentence captures that capacity instead of wasting it. Most professional answers do not have a close. They have a stop. The speaker ran out of things to say or out of time, and the recording cuts. A close is intentional, specific, and conviction-carrying. It does not summarise — summary diffuses what recency would have concentrated. Today, you have sixty seconds for the body and one sentence for the close. The mic stays open across the boundary. The close is recorded separately and graded on concision, specificity, and conviction. Hedges in the close — maybe, I think, sort of — pull the score down because they signal that the speaker is still inside the body of the answer.",
        "pullQuote": "Recency concentrates recall on the last sentence. Summary diffuses what concentration would have captured."
      },
      "do": {
        "constraint": "60-second body. Then one sentence close.",
        "prompt": "What is the most important change your industry will need to make in the next decade?",
        "time": "75 seconds total",
        "doMetaLine": "A marker shows the 60-second body line. The close begins after.",
        "challengeType": "Constraint"
      },
      "see": {
        "metricsShown": "Close strength  ·  Body-close coherence  ·  Brevity score",
        "headlineLine": "Your close, transcribed and graded against the body it followed.",
        "commentaryTemplates": {
          "close_strong": "Close was one sentence, specific, hedge-free, and landed in conviction. The room would have repeated it.",
          "close_mid": "Close was one sentence; conviction was present; specificity was light. The closes that score high carry a concrete noun in the final clause — a number, a name, a thing the listener can repeat without paraphrasing.",
          "close_weak": "Close drifted into summary. The body ended; the sentence that should have closed did not arrive.",
          "close_highlighted": "Your close, as recorded: '{quote}'"
        }
      },
      "commit": {
        "opener": "Tomorrow I will end one meeting with a sentence that…",
        "commitMetaLine": "The strongest closes are written before the body, not derived from it."
      }
    },
    "sprintNumber": "06",
    "sprintName": "Perform"
  },
  {
    "sessionNumber": 35,
    "name": "Brand Voice",
    "concept": "Your communication signature",
    "sprintMeta": "Sprint 06 Perform   ·   Your communication signature",
    "stages": {
      "centre": {
        "stepLabel": "What do you want them to know about you?",
        "onScreenLines": [
          "Eleven techniques. Today's pitch shows which surfaced unprompted."
        ],
        "subLine": "Open prompt. No constraints. The See screen reports the constellation."
      },
      "listen": {
        "tidbitTitle": "Your communication signature",
        "transcript": "Brand voice in speech is not a style choice. It is the pattern that emerges when the same person makes consistent decisions about pace, inflection, pause placement, energy ceiling, and what to hedge on — across enough recordings that the pattern is detectable. The detection is the point. A voice that varies session to session is still being assembled; a voice that holds across thirty-plus sessions can be named. By session thirty-five, you have made these decisions enough times that the See screen can ask: of the eleven techniques the programme trains, which surfaced in an unprompted pitch, and which did not. Today's session is open. Sixty seconds. No constraints, no live feedback. The constellation is whatever the recording produces — strong on some techniques, light on others. That asymmetry is what makes the pattern a signature instead of a checklist.",
        "pullQuote": "The signature is the asymmetry — which techniques surface, which do not."
      },
      "do": {
        "constraint": "Open. No constraints. Your pitch.",
        "prompt": "Deliver your 60-second elevator pitch about what you do and why it matters.",
        "time": "60 seconds",
        "doMetaLine": "Every technique you have built is available. Speak.",
        "challengeType": "Open"
      },
      "see": {
        "metricsShown": "Signature consistency  ·  Authority score  ·  Narrative quality",
        "headlineLine": "Eleven techniques scored. Strong on some, light on others. The shape is the signature.",
        "commentaryTemplates": {
          "signature_strong": "Signature consistency {pct}%. {n} of eleven techniques present. The pitch sounded like you have sounded for the last ten sessions.",
          "signature_mid": "Signature consistency {pct}%. {n} of eleven techniques surfaced. The techniques that did not surface are likely the ones practised most recently — recent skills are still effortful enough to suppress under open-prompt conditions.",
          "signature_low": "Signature consistency {pct}%. Few of the eleven techniques surfaced in the recording. Open prompts under elevator-pitch framing pull most users toward content-first delivery — techniques get suppressed when the content is the priority. A re-attempt with the techniques as the priority is worth running before session 36."
        }
      },
      "commit": {
        "opener": "What am I now ready to be known for?",
        "commitMetaLine": "Tomorrow you re-record session one's prompt. The delta is the only honest measure of the programme."
      }
    },
    "sprintNumber": "06",
    "sprintName": "Perform"
  },
  {
    "sessionNumber": 36,
    "name": "Review — The Capstone",
    "concept": "Self-vs-baseline",
    "sprintMeta": "Sprint 06 Perform   ·   Self-vs-baseline",
    "stages": {
      "centre": {
        "stepLabel": "(No Centre today. You have done all the centring.)",
        "subLine": "Today you perform.",
        "onScreenLines": []
      },
      "listen": {
        "tidbitTitle": "(Replaced — single instruction screen)",
        "transcript": "Today you re-record session one's prompt. Same words, same time limit, no live feedback. The See screen places the new recording above the original baseline, metric by metric.",
        "pullQuote": "Same prompt. Same time. Two recordings, side by side."
      },
      "do": {
        "constraint": "The original baseline prompt. No constraints. No live feedback.",
        "prompt": "Tell me about a recent project you worked on. What was the goal, what happened, and what would you do differently?",
        "time": "90 seconds",
        "doMetaLine": "No live feedback, no constraint counters. The screen reports after, not during.",
        "challengeType": "Open (capstone)"
      },
      "see": {
        "metricsShown": "Filler count  ·  Pace (WPM)  ·  Uptalk rate  ·  Inflection rate  ·  Brevity score  ·  Composite Clarity Score",
        "headlineLine": "Session 1 above, Session 36 below. Six metrics. Six deltas.",
        "commentaryTemplates": {
          "composite_strong": "Clarity Score {n_now}, up {delta} from session one's {n_then}. All six component metrics improved. The two recordings are stored side by side in the Library; the audio comparison is the artifact that survives the programme.",
          "composite_mid": "Clarity Score {n_now}, up {delta} from session one's {n_then}. Most metrics improved; one held steady.",
          "composite_modest": "Clarity Score {n_now}, up {delta} from session one's {n_then}. The delta is positive but modest — typical for users whose baseline was already strong. The Library continues to record against this baseline.",
          "montage_line": "Thirty-six commits below. Each one is something you said you would notice.",
          "finished_line": "You finished the programme."
        }
      },
      "commit": {
        "opener": "(Anchor — 30 seconds, free)",
        "freeResponsePrompt": "What did you become?",
        "commitMetaLine": "Thirty-six sessions of recorded choices sit behind the answer. Speak with that in front of you."
      }
    },
    "sprintNumber": "06",
    "sprintName": "Perform"
  }
] as SessionCopyEntry[];
export const sessionCopyByNumber = Object.fromEntries(sessionCopyEntries.map((e) => [e.sessionNumber, e])) as Record<number, SessionCopyEntry>;
export function getSessionCopy(n: number) { return sessionCopyByNumber[n]; }
