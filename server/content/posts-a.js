// Blog articles, part A: the six original posts, rewritten in full. Slugs are unchanged so existing links keep working.
const JEE = '/programs/jee-coaching-madhyamgram-kolkata';
const NEET = '/programs/neet-coaching-madhyamgram-kolkata';
const FOUNDATION = '/programs/foundation-course-class-8-9-10-kolkata';

export const POSTS_A = [
  {
    slug: 'how-to-plan-the-last-90-days-before-jee-main',
    title: 'How to plan the last 90 days before JEE Main',
    category: 'Exam Tips',
    excerpt: 'A three-phase plan for your final 90 days: close the gaps, test under exam conditions, then revise and rest. Week by week, with daily targets.',
    cover: 'jee-last-90-days', coverAlt: 'An hourglass with sand running through it',
    content: `
<p>Ninety days is enough time to add 40 to 80 marks to a JEE Main score, if the days are used with a plan. It is not enough time to learn the whole syllabus again from zero. The students who improve the most in this window are the ones who stop collecting new material and start converting what they already know into marks.</p>
<p>Below is the plan we use with our JEE batches. It splits the 90 days into three phases, each with a different job.</p>

<h2>Before you start: a one-day audit</h2>
<p>Take one full mock test under real conditions: 3 hours, one sitting, no phone. Then list every chapter of Physics, Chemistry and Maths in a table and mark each one:</p>
<ul>
<li><strong>Green:</strong> you can solve most previous-year questions from this chapter.</li>
<li><strong>Amber:</strong> you know the theory but make mistakes or are slow.</li>
<li><strong>Red:</strong> you have not studied it properly, or have forgotten it.</li>
</ul>
<p>This table is your map for the next three months. Be honest. A chapter you "did in Class 11" but cannot solve today is red.</p>

<h2>Phase 1 (days 1 to 40): close the gaps</h2>
<p>The goal of this phase is to turn red chapters amber and amber chapters green. Do not try to fix every red chapter. Pick the ones that appear often in previous-year papers and that connect to other topics. In Maths that usually means calculus, coordinate geometry and vectors with 3D. In Physics, mechanics, electrostatics, current electricity and modern physics. In Chemistry, almost all of physical chemistry and the NCERT-heavy parts of inorganic chemistry.</p>
<p>A good day in this phase looks like this:</p>
<ul>
<li>One new or weak chapter: theory revision followed by 30 to 40 graded questions.</li>
<li>Previous-year JEE Main questions from one green chapter, to keep it green.</li>
<li>Thirty minutes of Chemistry NCERT reading (inorganic and organic), every single day.</li>
</ul>
<p>Take a full mock once a week, on the same day and at the same time as your actual exam slot.</p>

<h2>Phase 2 (days 41 to 75): practise under exam conditions</h2>
<p>Now the balance shifts from learning to performing. Take two to three full mocks a week, and spend as long reviewing each paper as you spent writing it. (Our article on <a href="/blog/what-a-good-mock-test-review-looks-like">how to review a mock test</a> explains the method.)</p>
<p>On the days between mocks, work from your error log, not from the textbook. If the last mock showed you losing marks in rotational motion, that is the next day's topic. This is also the phase to settle your paper strategy: which subject you start with, how long you stay on a question before moving on, and how you use the last 20 minutes.</p>

<h2>Phase 3 (days 76 to 90): revise, sharpen, rest</h2>
<p>Stop starting new chapters. The final two weeks are for:</p>
<ul>
<li>Your formula sheets and short notes, read every day.</li>
<li>Your error log, read from start to finish at least twice.</li>
<li>Two or three last mocks, spaced out, to stay in rhythm.</li>
<li>Seven to eight hours of sleep. Memory consolidates during sleep, and a tired brain makes silly mistakes.</li>
</ul>
<p>In the last two days, do light revision only. You cannot learn a new chapter in 48 hours, but you can easily lose confidence trying.</p>

<h2>The weekly rhythm</h2>
<p>Whatever phase you are in, keep one rhythm: six working days and one lighter day. On the lighter day, review the week, update the chapter table and plan the next week. Students who skip rest days tend to lose a whole week to burnout later.</p>

<h2>Common mistakes in the last 90 days</h2>
<ul>
<li><strong>Collecting new books and test series.</strong> One good set of material, finished, beats three half-done ones.</li>
<li><strong>Ignoring Chemistry.</strong> It is usually the fastest subject to score in. Thirty minutes a day of NCERT adds up.</li>
<li><strong>Measuring progress by hours.</strong> Measure it by questions solved and mistakes fixed.</li>
<li><strong>Comparing mock scores with friends.</strong> Compare this week's score with your own score last week.</li>
</ul>

<h2>One last thing</h2>
<p>Most JEE aspirants also write the second session of JEE Main. If the first attempt does not go to plan, the same three phases work again, only shorter. Always check the latest NTA information bulletin for the exam pattern and dates.</p>
<p>If you would like a plan built around your own mock scores, our <a href="${JEE}">JEE program</a> includes one-to-one mentoring, weekly tests and doubt sessions. <a href="/contact">Talk to us</a>.</p>
`
  },
  {
    slug: 'reading-ncert-biology-the-right-way-for-neet',
    title: 'Reading NCERT Biology the right way for NEET',
    category: 'Exam Tips',
    excerpt: 'Most NEET Biology questions come straight from NCERT lines, diagrams and tables. Here is how to read the textbook so that nothing slips past you.',
    cover: 'neet-ncert-biology', coverAlt: 'A model of the human heart on a table',
    content: `
<p>Biology carries half the marks in NEET: 90 of the 180 questions, or 360 of the 720 marks. Almost all of them are built on the NCERT Class 11 and 12 textbooks. Many questions lift a sentence, a diagram label or a table entry almost word for word. So the question is not whether to read NCERT, but how to read it well enough that you recognise any line when you see it in the exam.</p>

<h2>Read every chapter in three passes</h2>
<p><strong>Pass 1: understand.</strong> Read the chapter like a story. Do not highlight anything yet. Make sure you understand the process: how the nephron filters blood, or why the light reaction must come before the Calvin cycle. If you cannot explain it in your own words, read it again or ask your teacher.</p>
<p><strong>Pass 2: mark.</strong> Now read with a pencil. Underline:</p>
<ul>
<li>Numbers and quantities (chromosome numbers, enzyme optimum pH, the number of ATP produced).</li>
<li>Examples (the example given for every type of adaptation, every plant family, every disease).</li>
<li>Exceptions ("all ... except ..."). These are favourite question material.</li>
<li>Definitions in bold.</li>
</ul>
<p><strong>Pass 3: test.</strong> Close the book and answer questions from that chapter, then open the book to check every answer, right or wrong.</p>

<h2>Do not skip the "small print"</h2>
<p>Students lose easy marks because they skim the parts that look unimportant. Read these carefully:</p>
<ul>
<li><strong>Diagrams and their labels.</strong> Practise drawing the important ones: the structure of the heart, the nephron, a dicot embryo sac, the human eye, the male and female reproductive systems.</li>
<li><strong>Tables.</strong> Tables of hormones, digestive enzymes, plant families and disease-causing organisms produce several questions every year.</li>
<li><strong>Figure captions and boxed text.</strong> They often contain facts that are not repeated in the main text.</li>
<li><strong>Summaries at the end of each chapter.</strong> Use them as a quick check of the main ideas.</li>
</ul>

<h2>Make your own short notes</h2>
<p>After the third pass, write one or two pages of notes for each chapter: only the facts you keep forgetting. These notes are what you revise in the final month, not the whole textbook again. Flowcharts work better than paragraphs for processes like the Krebs cycle or the menstrual cycle.</p>

<h2>Practise with assertion-reason and statement questions</h2>
<p>NEET increasingly asks questions in formats that test exact understanding: "Statement I and Statement II", "Assertion and Reason", and match-the-column questions. They punish half-remembered facts. After every chapter, practise at least 30 such questions, and for every wrong answer find the NCERT line that would have given you the answer.</p>

<h2>A weekly rhythm that works</h2>
<ul>
<li><strong>Monday to Friday:</strong> one chapter in three passes (larger chapters take two days).</li>
<li><strong>Saturday:</strong> a test on the week's chapters.</li>
<li><strong>Sunday:</strong> revise the short notes of every chapter finished so far.</li>
</ul>
<p>Revision on a fixed day is what makes the facts stay. Our article on <a href="/blog/active-recall-and-spaced-revision">active recall and spaced revision</a> explains why.</p>

<h2>What about reference books?</h2>
<p>Use them for practice questions, not as a replacement for NCERT. If a reference book says something that is not in NCERT, the NCERT version is the one to remember for NEET.</p>

<p>Our <a href="${NEET}">NEET program</a> runs chapter-wise NCERT tests every week, with doubt sessions for Biology, Physics and Chemistry. <a href="/contact">Ask us about the next batch</a>.</p>
`
  },
  {
    slug: 'handling-exam-stress-a-guide-for-parents',
    title: 'Handling exam stress: a guide for parents',
    category: 'Parents',
    excerpt: 'Practical ways to support a child through JEE, NEET and board exam pressure, what to say and what to avoid, and the signs that mean it is time to get help.',
    cover: 'exam-stress-parents', coverAlt: 'A young man resting his chin on his hands while thinking at a laptop',
    content: `
<p>Preparing for JEE, NEET or board exams is a long, demanding stretch, and students feel the pressure even when they do not show it. Parents often feel it just as strongly. The good news is that a few simple habits at home make a real difference to how a child copes.</p>

<h2>What helps</h2>
<p><strong>Keep the home routine steady.</strong> Regular meals, a fixed sleeping time and a quiet place to study help more than any pep talk. Teenagers need eight to nine hours of sleep, and a well-rested student remembers more and makes fewer careless mistakes.</p>
<p><strong>Ask about effort, not just marks.</strong> "What did you work on today?" invites a conversation. "How much did you get?" often ends one. When a mock test goes badly, ask what they learnt from it.</p>
<p><strong>Listen more than you advise.</strong> Sometimes a student just needs to say "this chapter is impossible" out loud. You do not have to fix it. Saying "that sounds really hard" is often enough.</p>
<p><strong>Protect breaks.</strong> A walk, a game of cricket, music or 30 minutes with friends is not wasted time. Short breaks keep long preparation going.</p>
<p><strong>Stay in touch with the teachers.</strong> Teachers see your child's test trends and habits. A short conversation every few weeks helps you understand where things really stand.</p>

<h2>What to avoid</h2>
<ul>
<li><strong>Comparisons</strong> with cousins, neighbours or classmates. They rarely motivate and often hurt.</li>
<li><strong>Constantly discussing ranks, colleges and the future.</strong> Focus on the next week, not the next five years.</li>
<li><strong>Treating every mock test as a verdict.</strong> Mock scores go up and down. The trend over two or three months is what matters.</li>
<li><strong>Adding more tuition when scores dip.</strong> More hours usually means less sleep and less revision. Talk to the teachers first.</li>
</ul>

<h2>Around the exam itself</h2>
<ul>
<li>Check the admit card, documents and route to the centre a few days in advance.</li>
<li>Keep the night before calm. No new chapters, no long discussions about the exam.</li>
<li>After each paper, do not ask for a detailed analysis. Let them rest and prepare for the next one.</li>
</ul>

<h2>Signs that need attention</h2>
<p>Some stress is normal. Talk to your child, their teachers or a doctor or counsellor if you notice any of these for more than a couple of weeks:</p>
<ul>
<li>Changes in sleep or appetite.</li>
<li>Withdrawing from friends and family.</li>
<li>Frequent headaches or stomach aches with no clear cause.</li>
<li>Persistent sadness, irritability or hopelessness.</li>
<li>Talking about being a burden or about not wanting to go on.</li>
</ul>
<p>If your child talks about harming themselves, seek help immediately. In India you can call the government's Tele-MANAS mental health helpline on <strong>14416</strong> or <strong>1-800-891-4416</strong>, free, at any time of day.</p>

<h2>One reminder</h2>
<p>An exam is one step, not a final judgement. Many students who did not get the result they wanted the first time have gone on to do very well, through a second attempt or a different path. What children remember most is whether they felt supported along the way.</p>
<p>At HAwk ACademe, our mentors meet students regularly and keep parents informed about progress. If you would like to talk about your child's preparation, <a href="/contact">get in touch</a>.</p>
`
  },
  {
    slug: 'why-class-9-matters-more-than-you-think',
    title: 'Why Class 9 matters more than you think',
    category: 'Study Plans',
    excerpt: 'Algebra, motion, atoms and cells: the Class 9 topics that Class 11, JEE and NEET are built on, and the study habits worth starting now.',
    cover: 'class-9-foundation', coverAlt: 'A worksheet of multiplication problems with a pencil',
    content: `
<p>Class 9 often feels like a quiet year: no board exam, and Class 10 still a year away. But it is the year when the foundations of Class 11 and 12 science are laid. Students who struggle in Class 11 Physics or Maths can very often trace the problem back to something they skipped in Class 9.</p>

<h2>The topics that carry forward</h2>
<p><strong>Mathematics.</strong></p>
<ul>
<li><strong>Polynomials and algebraic identities.</strong> Used constantly in calculus, quadratic equations and coordinate geometry.</li>
<li><strong>Linear equations in two variables.</strong> The start of the coordinate geometry that makes up a large part of JEE Maths.</li>
<li><strong>Triangles, congruence and the basics of proof.</strong> They train the step-by-step reasoning that JEE problems demand.</li>
<li><strong>Number systems and surds.</strong> Weakness here shows up as slow, error-prone calculation later.</li>
</ul>
<p><strong>Physics.</strong></p>
<ul>
<li><strong>Motion, force and the laws of motion.</strong> Class 11 mechanics starts exactly where Class 9 stops.</li>
<li><strong>Gravitation, work and energy.</strong> Expanded in Class 11 and tested in both JEE and NEET.</li>
</ul>
<p><strong>Chemistry.</strong></p>
<ul>
<li><strong>Atoms, molecules and the mole concept.</strong> The basis of every numerical in physical chemistry.</li>
<li><strong>Structure of the atom.</strong> Leads directly into atomic structure and chemical bonding in Class 11.</li>
</ul>
<p><strong>Biology.</strong></p>
<ul>
<li><strong>The cell and tissues.</strong> Cell biology is the foundation of a large share of NEET Biology.</li>
</ul>

<h2>Habits that matter more than topics</h2>
<p>Topics can be re-learnt. Habits are harder to change later. Class 9 is the best time to build:</p>
<ul>
<li><strong>Daily study, not exam-time study.</strong> One to two focused hours on school days is enough.</li>
<li><strong>Solving, not just reading.</strong> Maths and Physics are learnt by doing problems, including hard ones that take 15 minutes.</li>
<li><strong>Asking "why".</strong> Learn why a formula works, not just how to use it. JEE questions are designed to catch students who only memorised.</li>
<li><strong>A notebook of mistakes.</strong> Writing down what went wrong is the single most useful exam habit at any level.</li>
</ul>

<h2>Should a Class 9 student start JEE or NEET preparation?</h2>
<p>Not in the sense of studying Class 11 material early. In Class 9 the best preparation is to understand the Class 9 syllabus deeply, solve questions beyond the textbook, and try Olympiad-style problems that need thinking rather than recall. A student who does this enters Class 11 confident instead of catching up.</p>

<h2>A simple weekly plan</h2>
<ul>
<li>Four days: Maths and Science chapters from school, with extra practice questions.</li>
<li>One day: a mixed problem set or an Olympiad paper.</li>
<li>One day: revise the week's work and update the mistakes notebook.</li>
<li>One day off.</li>
</ul>
<p>Our <a href="${FOUNDATION}">Foundation course for Classes 8 to 10</a> follows this approach: concepts first, then problems that stretch thinking, with regular tests. <a href="/contact">Ask us about a trial class</a>.</p>
`
  },
  {
    slug: 'building-a-daily-study-routine-that-lasts',
    title: 'Building a daily study routine that lasts',
    category: 'Study Plans',
    excerpt: 'Focused study blocks, a fixed start time and daily revision: a routine for JEE, NEET and board students that still works in month six, not just week one.',
    cover: 'daily-routine', coverAlt: 'A notebook, coffee and laptop on a desk, seen from above',
    content: `
<p>Most study plans fail in the third week, not the first. The timetable was too ambitious, a few days were missed, and the whole plan quietly stopped. A routine that lasts is one that is realistic on a bad day, not just on a good one.</p>

<h2>Start with fixed anchors</h2>
<p>Choose three things that happen at the same time every day: when you wake up, when you start your first study block, and when you sleep. Everything else can move. Fixed anchors make starting automatic, and starting is the hardest part of studying.</p>

<h2>Study in focused blocks</h2>
<p>Work in blocks of 50 to 90 minutes with a 10 to 15 minute break. During a block:</p>
<ul>
<li>The phone is in another room, not face down on the desk.</li>
<li>You work on one subject and one clear task: "40 questions on electrostatics", not "study Physics".</li>
<li>You write down any stray thought ("check the test date") and come back to it at the break.</li>
</ul>
<p>Three or four genuinely focused blocks are worth more than ten distracted hours.</p>

<h2>A sample day for a Class 11 or 12 student</h2>
<ul>
<li><strong>Morning block (before school or coaching):</strong> revision of yesterday's class, or Chemistry NCERT reading.</li>
<li><strong>School and coaching.</strong></li>
<li><strong>Evening block 1:</strong> problems from today's Physics or Maths class.</li>
<li><strong>Evening block 2:</strong> the subject you find hardest, while you are still fresh.</li>
<li><strong>Last 20 minutes:</strong> quick review of the day, and tomorrow's task list.</li>
</ul>
<p>Droppers have more hours, so they can add one or two blocks, but the structure stays the same.</p>

<h2>Revise every day, not just before tests</h2>
<p>Most of what you learn today is forgotten within a few days unless you revisit it. Spend 20 to 30 minutes every day revising earlier topics, and one longer session at the weekend. Our article on <a href="/blog/active-recall-and-spaced-revision">active recall and spaced revision</a> shows a simple schedule.</p>

<h2>Plan the week, not just the day</h2>
<p>On Sunday evening, write the week's targets: chapters to finish, questions to solve, tests to take. Each night, pick the next day's tasks from that list. If a day goes badly, move its tasks into the week's buffer, which should be about one day's worth of slack.</p>

<h2>Look after the basics</h2>
<ul>
<li><strong>Sleep:</strong> seven to eight hours. Cutting sleep to study more is a losing trade.</li>
<li><strong>Movement:</strong> 20 to 30 minutes of walking, sport or exercise improves concentration.</li>
<li><strong>Food and water:</strong> regular meals, and fewer sugary snacks during study blocks.</li>
</ul>

<h2>When the routine breaks</h2>
<p>It will, at some point: a family function, an illness, a bad week. The rule is simple: never miss two days in a row. On a bad day, do just one block. Keeping the chain unbroken matters more than the amount done that day.</p>

<p>At HAwk ACademe our mentors help each student build a timetable that fits their school, travel and coaching hours. See our <a href="/programs">programs</a> or <a href="/contact">talk to a counsellor</a>.</p>
`
  },
  {
    slug: 'what-a-good-mock-test-review-looks-like',
    title: 'What a good mock test review looks like',
    category: 'Exam Tips',
    excerpt: 'Your score improves in the review, not in the test. A step-by-step method to sort every mistake, keep an error log and turn each mock into a list of fixes.',
    cover: 'mock-test-review', coverAlt: 'A student filling in an OMR answer sheet with a pen',
    content: `
<p>A mock test has two halves: the three hours you spend taking it, and the time you spend reviewing it. Most students do only the first half, check the score, and move on. The review is where scores actually improve.</p>

<h2>Step 1: review within 24 hours</h2>
<p>Review the paper the same day or the next, while you still remember how you thought about each question. Set aside about as much time as the test itself: three hours for a full JEE Main or NEET mock.</p>

<h2>Step 2: go through every question, not just the wrong ones</h2>
<p>Put every question you got wrong, skipped or guessed into one of these groups:</p>
<ul>
<li><strong>Concept gap:</strong> you did not know or understand the idea. Fix: go back to the chapter and solve 15 to 20 questions on it.</li>
<li><strong>Silly mistake:</strong> a calculation slip, a sign error, a misread question or a wrong unit. Fix: note the pattern and build a habit against it, such as underlining "NOT" or "incorrect" in every question.</li>
<li><strong>Time pressure:</strong> you could have solved it but ran out of time, or spent too long somewhere else. Fix: change your paper strategy.</li>
<li><strong>Lucky guess:</strong> you got it right without being sure. Fix: treat it as a mistake and learn the concept.</li>
</ul>
<p>Also look at the questions you got right slowly. A correct answer that took six minutes is a problem in a paper where you have about two and a half minutes per question.</p>

<h2>Step 3: keep an error log</h2>
<p>Keep one notebook for all mocks. For each mistake write:</p>
<ul>
<li>the subject, chapter and topic,</li>
<li>which of the four groups it belongs to,</li>
<li>what you did wrong, in one line,</li>
<li>the correct idea or method, in one line.</li>
</ul>
<p>Read the whole log once a week, and every day in the last two weeks before the exam. Students who do this find the same mistake stops appearing after two or three mocks.</p>

<h2>Step 4: track numbers that matter</h2>
<p>After each mock, record more than the total score:</p>
<ul>
<li>marks in each subject,</li>
<li>number of attempts and accuracy (correct ÷ attempted),</li>
<li>marks lost to negative marking,</li>
<li>time spent on each subject.</li>
</ul>
<p>If accuracy is below about 80%, you are attempting too many uncertain questions. If accuracy is high but attempts are low, you need more speed. Our article on <a href="/blog/negative-marking-when-to-attempt-and-when-to-skip">negative marking</a> goes into this balance in detail.</p>

<h2>Step 5: turn the review into next week's plan</h2>
<p>End every review with three to five specific tasks, for example: "Revise the definite integration properties and solve 25 questions", or "In the next mock, finish Chemistry in 50 minutes". These tasks go straight into your weekly timetable.</p>

<h2>How many mocks?</h2>
<p>In the last two to three months, two or three full mocks a week is plenty if each one is properly reviewed. Ten mocks without review teach less than four with a careful one.</p>

<p>Every HAwk ACademe test is followed by a detailed analysis and a doubt session, so students know exactly what to fix next. See our <a href="${JEE}">JEE</a> and <a href="${NEET}">NEET</a> programs.</p>
`
  }
];
