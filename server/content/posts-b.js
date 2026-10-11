// Blog articles, part B: new posts on JEE, NEET and board exam preparation.
const JEE = '/programs/jee-coaching-madhyamgram-kolkata';
const NEET = '/programs/neet-coaching-madhyamgram-kolkata';
const FOUNDATION = '/programs/foundation-course-class-8-9-10-kolkata';

export const POSTS_B = [
  {
    slug: 'jee-main-physics-chapter-wise-strategy',
    title: 'JEE Main Physics: a chapter-by-chapter strategy',
    category: 'Exam Tips',
    excerpt: 'Which Physics chapters to master first for JEE Main, how to study each group, and the formula-sheet and problem-solving habits that lift scores.',
    cover: 'jee-physics', coverAlt: 'A green chalkboard with E = mc² and other physics equations',
    content: `
<p>Physics is the subject where JEE Main scores vary the most. Students who are comfortable with it can finish the section quickly and accurately. Students who are not often lose time on it that they needed for Chemistry and Maths. The way to get comfortable is not to read more theory but to study the chapters in the right order and solve the right kind of questions.</p>

<h2>How the paper is set</h2>
<p>In recent sessions, each subject in JEE Main has had 25 questions: 20 multiple-choice and 5 numerical-value questions, with 4 marks for a correct answer and 1 mark deducted for a wrong one. Always check the latest NTA information bulletin, because details can change from year to year.</p>

<h2>Group 1: chapters to master first</h2>
<p>These chapters appear in almost every paper and support the rest of the syllabus:</p>
<ul>
<li><strong>Kinematics and laws of motion:</strong> the language of all of mechanics.</li>
<li><strong>Work, energy and power; centre of mass and collisions.</strong></li>
<li><strong>Rotational motion:</strong> difficult, but it appears regularly, so it is worth the effort.</li>
<li><strong>Electrostatics, current electricity and capacitors.</strong></li>
<li><strong>Magnetic effects of current and electromagnetic induction.</strong></li>
<li><strong>Modern physics:</strong> photoelectric effect, atoms, nuclei. Short chapters with direct, formula-based questions.</li>
</ul>

<h2>Group 2: high-return chapters</h2>
<p>These take less time and often give direct questions:</p>
<ul>
<li><strong>Units, dimensions and errors in measurement.</strong></li>
<li><strong>Ray optics and wave optics.</strong></li>
<li><strong>Semiconductors and electronic devices.</strong> Logic gates and diodes are largely conceptual.</li>
<li><strong>Thermodynamics and kinetic theory of gases.</strong></li>
<li><strong>Properties of matter:</strong> elasticity, fluids, surface tension.</li>
</ul>

<h2>Group 3: complete for full coverage</h2>
<p>Gravitation, oscillations and waves, alternating current, electromagnetic waves and the experimental-skills topics. Do not leave them out completely: one or two questions from each can make the difference between two percentiles.</p>

<h2>How to study a Physics chapter</h2>
<ol>
<li><strong>Concept first.</strong> Understand where each formula comes from. Derivations help you remember when a formula applies and when it does not.</li>
<li><strong>Solved examples.</strong> Work through them with the solution covered.</li>
<li><strong>Graded practice.</strong> 20 easy, 20 medium and 10 hard questions. Do not jump straight to the hard ones.</li>
<li><strong>Previous-year questions.</strong> Solve every JEE Main question from that chapter. This shows you the level and the favourite question types.</li>
<li><strong>A formula sheet.</strong> One page per chapter, written in your own hand, with the conditions under which each result holds.</li>
</ol>

<h2>Habits that save marks in the exam</h2>
<ul>
<li><strong>Draw a diagram for every mechanics and electrostatics question,</strong> including the forces and directions.</li>
<li><strong>Check units and limiting cases.</strong> If your answer for a pendulum does not reduce to the simple case when the extra term is zero, something is wrong.</li>
<li><strong>Use the options.</strong> In multiple-choice questions, dimensional analysis or a special case can often eliminate two options quickly.</li>
<li><strong>Numerical questions need full care.</strong> There are no options to check against, so recheck the arithmetic.</li>
</ul>

<h2>What to avoid</h2>
<ul>
<li>Memorising hundreds of formulas without knowing their conditions.</li>
<li>Spending a week on one very hard topic while easier ones stay untouched.</li>
<li>Reading theory for hours without solving problems.</li>
</ul>

<p>Our <a href="${JEE}">JEE program</a> teaches Physics concept-first, with chapter tests, previous-year practice and weekly doubt sessions. Also read <a href="/blog/how-to-plan-the-last-90-days-before-jee-main">how to plan the last 90 days before JEE Main</a>.</p>
`
  },
  {
    slug: 'neet-physics-how-to-stop-losing-marks',
    title: 'NEET Physics: how to stop losing marks',
    category: 'Exam Tips',
    excerpt: 'Physics is where many NEET aspirants lose the most marks. The chapters to prioritise, a formula routine, and how to get faster without getting careless.',
    cover: 'neet-physics', coverAlt: 'A glowing plasma ball with streams of electric light',
    content: `
<p>Many NEET aspirants are strong in Biology, reasonable in Chemistry and nervous about Physics. That nervousness costs marks twice: once on the Physics questions themselves, and again on the time they take from the rest of the paper. The good news is that NEET Physics is very learnable, because most questions test standard concepts and formulas rather than tricky problem-solving.</p>

<h2>Know the paper</h2>
<p>In recent years NEET (UG) has had 180 questions in 180 minutes: 45 each from Physics and Chemistry and 90 from Biology, with 4 marks for a correct answer and 1 mark deducted for a wrong one. Check the latest NTA information bulletin for any change. Physics carries 180 marks, as much as Chemistry.</p>

<h2>Chapters to prioritise</h2>
<p>NEET Physics follows the NCERT syllabus closely. Give extra time to:</p>
<ul>
<li><strong>Mechanics:</strong> laws of motion, work–energy, rotational motion and gravitation.</li>
<li><strong>Electrostatics and current electricity.</strong></li>
<li><strong>Magnetism and electromagnetic induction.</strong></li>
<li><strong>Modern physics:</strong> dual nature, atoms, nuclei. Mostly direct questions.</li>
<li><strong>Semiconductors:</strong> conceptual and quick to score.</li>
<li><strong>Ray and wave optics.</strong></li>
<li><strong>Thermodynamics and kinetic theory.</strong></li>
</ul>

<h2>Read NCERT Physics too</h2>
<p>Students read NCERT Biology line by line but often ignore NCERT Physics. Several NEET Physics questions are theory-based: statements about semiconductors, properties of electromagnetic waves, or the conditions in a definition. Read the NCERT chapter after you study it in class, including the examples and the "points to ponder" sections.</p>

<h2>A daily formula routine</h2>
<p>Keep a formula notebook with one page per chapter. Every morning, spend 10 minutes covering the right-hand side of each formula and writing it from memory. Formulas you get wrong go on a separate "weak list" that you check every day until they stick. This small routine removes the panic of "I knew this but forgot it in the exam".</p>

<h2>Practice: from slow and right to fast and right</h2>
<ol>
<li><strong>Stage 1: accuracy.</strong> Solve chapter questions with no time limit until you get at least 8 out of 10 right.</li>
<li><strong>Stage 2: speed.</strong> Solve sets of 15 questions in 15 to 20 minutes.</li>
<li><strong>Stage 3: mixed practice.</strong> Mixed-chapter sets, like the real paper, where you first have to recognise the topic.</li>
</ol>
<p>Also solve the NEET previous-year questions for each chapter. The same ideas return again and again.</p>

<h2>Where marks are usually lost</h2>
<ul>
<li><strong>Units and conversions:</strong> cm to m, mA to A, degrees to radians.</li>
<li><strong>Sign conventions</strong> in optics and thermodynamics.</li>
<li><strong>Reading the question too fast:</strong> "magnitude", "ratio", "percentage change".</li>
<li><strong>Calculation slips.</strong> Practise approximations: in many questions the options are far enough apart that a rough estimate is enough.</li>
</ul>

<h2>In the exam hall</h2>
<p>Many students do Biology first, which takes less time per question, and then give Physics a calm, unhurried block. Whatever order you choose, practise it in mocks first. In Physics, attempt the questions you are sure of in one pass, mark the rest, and return to them once.</p>

<p>Our <a href="${NEET}">NEET program</a> gives Physics the same weekly testing and doubt support as Biology. Read also: <a href="/blog/reading-ncert-biology-the-right-way-for-neet">reading NCERT Biology the right way</a>.</p>
`
  },
  {
    slug: 'organic-chemistry-reaction-map-method',
    title: 'Organic chemistry for JEE and NEET: the reaction-map method',
    category: 'Study Plans',
    excerpt: 'Stop memorising reactions one by one. Learn the mechanisms, build reaction maps that connect functional groups, and practise conversions.',
    cover: 'organic-chemistry', coverAlt: 'Laboratory glassware including flasks and beakers on a bench',
    content: `
<p>Organic chemistry has a reputation for being endless memorisation: hundreds of reactions, reagents and named reactions. Students who try to learn it that way usually forget most of it by exam time. The students who score well in it do something different. They learn a small number of mechanisms deeply and connect the reactions in a map.</p>

<h2>Step 1: get the basics right first</h2>
<p>Everything in organic chemistry rests on the chapter on general organic chemistry (GOC). Before moving on, you should be comfortable with:</p>
<ul>
<li>Inductive effect, resonance and hyperconjugation, and how they affect stability.</li>
<li>The stability order of carbocations, carbanions and free radicals.</li>
<li>Acidic and basic strength, and the reasons behind them.</li>
<li>Nucleophiles and electrophiles.</li>
<li>IUPAC naming and isomerism.</li>
</ul>
<p>If GOC is weak, every later chapter feels like memorisation. If GOC is strong, most reactions make sense.</p>

<h2>Step 2: learn mechanisms, not just reactions</h2>
<p>A handful of mechanism types explain most of the reactions in the syllabus: nucleophilic substitution (SN1 and SN2), elimination (E1 and E2), electrophilic addition, electrophilic aromatic substitution and nucleophilic addition to carbonyl groups. For each, learn:</p>
<ul>
<li>the steps, with the curved arrows,</li>
<li>what makes it faster or slower,</li>
<li>what product it gives, including stereochemistry where it matters.</li>
</ul>
<p>Once you know the mechanism, a new reaction is just the same pattern with different groups.</p>

<h2>Step 3: build reaction maps</h2>
<p>Take a big sheet of paper. Put the main functional groups around it: alkane, alkene, alkyne, alkyl halide, alcohol, aldehyde, ketone, carboxylic acid, ester, amide, amine, and benzene and its derivatives. Draw an arrow for every conversion you learn between two groups, and write the reagent on the arrow.</p>
<p>After a few chapters this map becomes your most useful revision tool. Conversion questions ("how will you convert ethanol to propanoic acid?") become a matter of finding a route on the map. Make one map for aliphatic compounds and one for aromatic compounds.</p>

<h2>Step 4: a reagent table</h2>
<p>Next to the map, keep a table of the common reagents and what they do: oxidising agents, reducing agents, and reagents such as KMnO₄, K₂Cr₂O₇, LiAlH₄, NaBH₄, PCC, Grignard reagents and so on. Note which functional groups each reagent affects and which it leaves alone. Many questions test exactly this selectivity.</p>

<h2>Step 5: named reactions, last and smart</h2>
<p>Learn named reactions (Aldol, Cannizzaro, Reimer–Tiemann, Hofmann bromamide and others) as part of the map, not as a separate list. For each one, know the reactant, reagent, product and one special condition, such as "no α-hydrogen" for Cannizzaro.</p>

<h2>Practice that works</h2>
<ul>
<li><strong>Daily:</strong> five conversion or "identify the product" questions.</li>
<li><strong>Weekly:</strong> redraw one reaction map from memory, then compare it with your original.</li>
<li><strong>For NEET:</strong> read the NCERT organic chapters line by line, since many questions come directly from the textbook examples.</li>
<li><strong>For JEE:</strong> add multi-step problems and questions on reaction intermediates.</li>
</ul>

<p>Chemistry at HAwk ACademe is taught mechanism-first, with regular tests for both <a href="${JEE}">JEE</a> and <a href="${NEET}">NEET</a> students. <a href="/contact">Ask about our batches</a>.</p>
`
  },
  {
    slug: 'class-12-boards-and-jee-neet-together',
    title: 'Class 12 boards and JEE or NEET together: one plan for both',
    category: 'Study Plans',
    excerpt: 'Boards and entrance exams share most of the syllabus but test it differently. How to divide the year, when to switch focus, and how to write board answers that score.',
    cover: 'boards-and-jee', coverAlt: 'Open books on a desk in front of a bookshelf',
    content: `
<p>Class 12 students preparing for JEE or NEET often feel they are preparing for two different exams. In fact the syllabus overlaps heavily: most of what you study for the entrance exam is also in your board syllabus. What differs is the way you are tested. Boards reward complete, well-presented written answers. JEE and NEET reward speed and accuracy on objective questions. One plan can cover both, if you organise the year well.</p>

<h2>Remember the eligibility rules</h2>
<p>Board marks still matter for admission. For example, NITs, IIITs and other centrally funded institutes admitting through JEE Main have generally required 75% in Class 12 (65% for SC/ST candidates) or a place in the top 20 percentile of your board. NEET has its own minimum marks in Physics, Chemistry and Biology. Check the current rules in the official information bulletins, but do not treat boards as a formality.</p>

<h2>Divide the year into three parts</h2>
<p><strong>April to October: entrance-first, board-aware.</strong> Study each chapter at entrance-exam depth. Since this is deeper than the board level, the board preparation is covered automatically, except for presentation. At the end of each chapter, write answers to two or three board-style questions so the writing skill does not fade.</p>
<p><strong>November to the board exams: shift towards the boards.</strong> Increase board practice to about half your time. Solve sample papers and previous board papers under timed conditions. Revise subjects that are not in the entrance exam, like English and your optional subject, every week. Keep at least one entrance mock a week to stay in touch.</p>
<p><strong>After the boards: entrance-only.</strong> For JEE, the second session of JEE Main and JEE Advanced follow soon after. For NEET, there are usually a few weeks between the boards and the exam. Switch fully to mocks and revision.</p>

<h2>Writing board answers that score</h2>
<ul>
<li><strong>Follow the marking scheme.</strong> A 3-mark answer needs three distinct points or steps. Look at the official marking schemes for previous papers to see what examiners look for.</li>
<li><strong>Show every step in numericals:</strong> formula, substitution with units, then the answer with units.</li>
<li><strong>Draw neat, labelled diagrams</strong> wherever they help, especially in Biology and Physics.</li>
<li><strong>Underline key terms and final answers.</strong> Examiners check many papers quickly.</li>
<li><strong>Manage time:</strong> attempt the paper in your planned order and leave ten minutes to check.</li>
</ul>

<h2>Where the two exams differ</h2>
<ul>
<li><strong>Derivations and proofs</strong> matter more in boards. Practise writing the standard derivations in Physics.</li>
<li><strong>Organic chemistry</strong> in boards asks for written mechanisms and conversions, so practise writing them out fully.</li>
<li><strong>Maths</strong> in boards gives marks for method. Do not skip steps the way you would in a JEE problem.</li>
<li><strong>Biology</strong> in boards needs well-structured long answers, while NEET needs precise recall of NCERT facts. Both come from the same lines of the textbook.</li>
</ul>

<h2>Avoid these traps</h2>
<ul>
<li>Ignoring English and the optional subject until the last month.</li>
<li>Not practising timed board papers at all.</li>
<li>Spending three weeks before the boards studying only for the boards, with no entrance practice.</li>
</ul>

<p>Our <a href="${JEE}">JEE</a> and <a href="${NEET}">NEET</a> programs are planned around the board calendar, with board-style tests in the months before the exams. <a href="/contact">Talk to a counsellor</a>.</p>
`
  },
  {
    slug: 'class-10-board-exam-maths-science-90-percent',
    title: 'Class 10 board exams: how to score 90%+ in Maths and Science',
    category: 'Exam Tips',
    excerpt: 'A practical plan for Class 10 Maths and Science: what to master in the textbook, how to use sample papers, and how to present answers for full marks.',
    cover: 'class-10-boards', coverAlt: 'A notebook with "Notes" written on it, a fountain pen and glasses',
    content: `
<p>Scoring 90% or more in Class 10 Maths and Science is very achievable for students who study steadily. It rarely depends on solving the hardest questions. It depends on not losing marks on the easy and medium ones, and on presenting answers the way examiners want to see them.</p>

<h2>The textbook comes first</h2>
<p>Board papers are built around the prescribed textbooks: the NCERT books for CBSE, and the board's own books for WBBSE and other state boards. Before you open any other book:</p>
<ul>
<li>Solve every exercise question and every in-text question in the Maths textbook.</li>
<li>Read every Science chapter fully, including activities, diagrams and boxed text.</li>
<li>Answer every end-of-chapter question in Science in writing, not just in your head.</li>
</ul>

<h2>Maths: where the marks are</h2>
<ul>
<li><strong>Algebra</strong> (polynomials, pairs of linear equations, quadratic equations, arithmetic progressions) carries a large share of the paper and is very scoreable with practice.</li>
<li><strong>Geometry and trigonometry:</strong> learn the theorems and their proofs. Practise the standard heights-and-distances questions.</li>
<li><strong>Coordinate geometry, mensuration and statistics:</strong> formula-based, so make a formula sheet and use it daily.</li>
</ul>
<p>Show every step. In board Maths, method marks are given even when the final answer is wrong, and lost when steps are skipped even if the answer is right.</p>

<h2>Science: three subjects in one paper</h2>
<ul>
<li><strong>Physics:</strong> light, electricity and magnetic effects. Practise ray diagrams and numericals with units.</li>
<li><strong>Chemistry:</strong> chemical reactions, acids, bases and salts, metals and non-metals, carbon compounds. Balance every equation and learn the reactions with conditions.</li>
<li><strong>Biology:</strong> life processes, control and coordination, reproduction, heredity. Learn the diagrams and their labels: the human heart, the nephron, the brain, the parts of a flower.</li>
</ul>

<h2>Competency-based questions</h2>
<p>Board papers now include case-based and assertion–reason questions that test understanding rather than memory. The best preparation is to understand why things happen, not just what happens. When you read a process, ask yourself what would change if one step were different.</p>

<h2>Sample papers: the final three months</h2>
<ol>
<li>Start with the official sample papers and marking schemes from your board.</li>
<li>Solve at least 8 to 10 full papers under timed conditions.</li>
<li>Check each paper against the marking scheme, not just the answer key.</li>
<li>Keep a list of repeated mistakes and read it before every paper.</li>
</ol>

<h2>Presentation that earns marks</h2>
<ul>
<li>Write the question number clearly, and start long answers on a new part of the page.</li>
<li>In numericals: given, formula, substitution, answer with units.</li>
<li>Draw diagrams in pencil, label them clearly and give them a title.</li>
<li>Keep answers to the point. Length does not earn extra marks; correct points do.</li>
</ul>

<h2>A month-by-month outline</h2>
<ul>
<li><strong>Until November:</strong> finish the syllabus with textbook exercises.</li>
<li><strong>December:</strong> first full revision, with chapter tests.</li>
<li><strong>January to February:</strong> sample papers, second revision, mistakes list.</li>
<li><strong>Final week:</strong> formula sheets, diagrams and the mistakes list only.</li>
</ul>
<p>The habits you build now are also the first step towards JEE and NEET. Our <a href="${FOUNDATION}">Foundation course for Classes 8 to 10</a> combines board preparation with that longer goal. <a href="/contact">Get in touch</a>.</p>
`
  },
  {
    slug: 'negative-marking-when-to-attempt-and-when-to-skip',
    title: 'Negative marking in JEE and NEET: when to attempt and when to skip',
    category: 'Exam Tips',
    excerpt: 'A clear way to think about guessing, the 50-50 rule, and why accuracy beats attempts. Use your mock data to find the right number of attempts for you.',
    cover: 'negative-marking', coverAlt: 'A page of mathematical equations',
    content: `
<p>In JEE Main and NEET, a correct answer earns 4 marks and a wrong answer costs 1 (check the latest information bulletin for the current scheme). That one rule decides a surprising number of ranks. Students who guess too much lose marks quietly; students who are too cautious leave marks they could have earned.</p>

<h2>The basic arithmetic</h2>
<p>With four options, a blind guess has a 1 in 4 chance of being right. On average that earns 4 × ¼ − 1 × ¾ = +0.25 marks per question. That sounds positive, but blind guesses are rarely truly random: question setters design wrong options that look right, so a student's "guess" is often pulled towards a trap. And every guess adds uncertainty to your score.</p>
<p>The picture changes completely when you can eliminate options:</p>
<ul>
<li><strong>One option eliminated (1 in 3 chance):</strong> 4 × ⅓ − 1 × ⅔ ≈ +0.67 marks on average.</li>
<li><strong>Two options eliminated (1 in 2 chance):</strong> 4 × ½ − 1 × ½ = +1.5 marks on average.</li>
</ul>
<p>So the practical rule many teachers give is: <strong>if you can genuinely eliminate two options, attempt; if you cannot eliminate any, skip.</strong></p>

<h2>Accuracy beats attempts</h2>
<p>Compare two students in a 180-question paper:</p>
<ul>
<li><strong>Student A</strong> attempts 160 questions with 75% accuracy: 120 right, 40 wrong, so 480 − 40 = <strong>440</strong>.</li>
<li><strong>Student B</strong> attempts 145 with 90% accuracy: about 130 right, 15 wrong, so 520 − 15 = <strong>505</strong>.</li>
</ul>
<p>Student B attempted fewer questions and scored 65 marks more. High accuracy almost always beats high attempts.</p>

<h2>Find your own numbers from mocks</h2>
<p>After every mock, record:</p>
<ul>
<li>attempts and accuracy for each subject,</li>
<li>marks lost to wrong answers,</li>
<li>how your "sure", "50-50" and "guess" answers actually turned out.</li>
</ul>
<p>Mark each attempt during the test with a small symbol: ✓ for sure, ~ for 50-50, ? for guess. After a few mocks you will know, for example, that your 50-50 answers are right 60% of the time in Chemistry but only 35% in Physics. That tells you exactly where to attempt and where to skip.</p>

<h2>Numerical questions</h2>
<p>JEE Main numerical-value questions have no options to eliminate, and wrong answers can carry negative marks. Attempt them when you have worked them through properly. Do not enter a guessed number.</p>

<h2>Strategy in the exam hall</h2>
<ol>
<li><strong>First pass:</strong> attempt every question you are sure of. Skip anything that needs more than about two minutes of thought.</li>
<li><strong>Second pass:</strong> return to the marked questions and attempt those where you can eliminate options.</li>
<li><strong>Final minutes:</strong> check bubbles or responses rather than making new blind guesses.</li>
</ol>

<h2>Common mistakes</h2>
<ul>
<li>Changing a correct answer at the last minute without a clear reason.</li>
<li>Setting a target number of attempts ("I must attempt 170") and forcing guesses to reach it.</li>
<li>Panicking after one hard section and guessing through the rest.</li>
</ul>

<p>Every HAwk ACademe mock test comes with an analysis of attempts, accuracy and negative marks, so students can find the strategy that works for them. See our <a href="${JEE}">JEE</a> and <a href="${NEET}">NEET</a> programs, and read <a href="/blog/what-a-good-mock-test-review-looks-like">what a good mock test review looks like</a>.</p>
`
  },
  {
    slug: 'active-recall-and-spaced-revision',
    title: 'Active recall and spaced revision: study once, remember for the exam',
    category: 'Study Plans',
    excerpt: 'Two research-backed techniques that help students remember far more of what they study, with a simple revision schedule for JEE, NEET and board exams.',
    cover: 'active-recall', coverAlt: 'An anatomical model of the human brain',
    content: `
<p>Most students revise by re-reading: the textbook, their notes, the highlighted lines. It feels productive, because the material looks familiar. But familiarity is not the same as being able to recall something under exam pressure. Two techniques, both well supported by memory research, work much better: <strong>active recall</strong> and <strong>spaced revision</strong>.</p>

<h2>Active recall: test yourself instead of re-reading</h2>
<p>Active recall means pulling information out of your memory rather than putting it back in. Every time you successfully remember something, the memory becomes stronger and easier to find next time. Ways to do it:</p>
<ul>
<li><strong>Close the book and write.</strong> After reading a topic, write down everything you remember, then check what you missed.</li>
<li><strong>Question-first notes.</strong> Write notes as questions ("What are the products of the light reaction?") with answers on the back or folded under.</li>
<li><strong>Blank diagrams.</strong> Draw the nephron or a circuit from memory, then compare with the book.</li>
<li><strong>Teach it.</strong> Explain the topic aloud to a friend, a parent, or an empty chair. Gaps show up immediately.</li>
<li><strong>Solve questions.</strong> For Physics and Maths, solving problems is active recall of both concepts and methods.</li>
</ul>

<h2>Spaced revision: revise just before you forget</h2>
<p>We forget quickly after learning something, and more slowly after each review. Spacing your revision takes advantage of this. Instead of revising a topic five times in one day, revise it on several days spread out over weeks.</p>
<p>A simple schedule after learning a topic:</p>
<ul>
<li><strong>Day 1:</strong> the same evening, a quick self-test.</li>
<li><strong>Day 3:</strong> a second recall session.</li>
<li><strong>Day 7:</strong> a third, with a few questions.</li>
<li><strong>Day 21:</strong> a fourth, as part of your monthly revision.</li>
<li><strong>Then roughly monthly</strong> until the exam.</li>
</ul>
<p>Each session takes less time than the last, because more of the topic has stuck.</p>

<h2>Putting it into a weekly routine</h2>
<ul>
<li>Keep a <strong>revision calendar</strong>: when you finish a topic, write its review dates in the calendar right away.</li>
<li>Spend the <strong>first 20 to 30 minutes</strong> of each study day on the reviews due that day.</li>
<li>Use <strong>flashcards</strong> for facts (Biology terms, inorganic chemistry, formulas). Cards you get wrong come back sooner; cards you get right come back later.</li>
<li>For problem subjects, keep a <strong>"redo" list</strong> of questions you got wrong and redo them on the review dates.</li>
</ul>

<h2>Why it feels harder, and why that is good</h2>
<p>Active recall and spaced revision feel slower and more effortful than re-reading. That effort is the point: the struggle to remember is what strengthens the memory. If revision feels too easy, it is probably not doing much.</p>

<h2>Common mistakes</h2>
<ul>
<li>Making beautiful notes and never testing yourself on them.</li>
<li>Cramming a whole subject in the week before a test.</li>
<li>Only revising the topics you already like.</li>
</ul>

<p>Our weekly tests at HAwk ACademe are built on the same idea: regular, spaced recall of earlier chapters, not just the latest one. Read also <a href="/blog/building-a-daily-study-routine-that-lasts">building a daily study routine that lasts</a>, or explore our <a href="/programs">programs</a>.</p>
`
  }
];
