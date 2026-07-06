# Author Website — Client Specification

Organized from the author's emails/messages. This is the source of truth for content and structure going forward — supersedes whatever is currently live wherever it conflicts.

## 0. Outstanding complaints about the current build (must be corrected)

- **Final direction (this spec): homepage leads with a Bio highlight** — a short excerpt of the author's bio plus a **"Read More" button** that takes the visitor to the full About page — laid out in the style of kimberlystuart.com. See Section 2. A book/novel is not what should lead the homepage; books belong in the showcase section beneath the bio highlight.
- The About page copy currently on the site is **not** what the author sent — replace it verbatim with Section 3 below.
- **Reference design**: the site should look and feel similar to **kimberlystuart.com** — the author sent this explicitly as the visual model. Revisit layout/typography/homepage structure against that reference (see Section 1 for its structure).
- **Typography**: keep the current display font used for the **author's name**, but note it was intended for the name specifically — the author sent the reference page twice to point at this. Book titles should not necessarily use that same treatment; check against kimberlystuart.com's hierarchy (author name vs. book title treatment).
- **Remove quotation marks around the author's name everywhere.** Quotes around a name imply it's a pseudonym, which is incorrect — her real name should be printed plainly, no quote marks.

## 1. Reference site

- **kimberlystuart.com** — model the overall site structure/feel on this. Explicit instruction: "model her site just like this one."
- Structure of the reference homepage, for layout guidance (adapt content, not literal copy):
  1. **Header/nav**: author name/logo prominent, horizontal nav (About, Books, Blog, Newsletter/Subscribe, Contact — adapt labels to this site's existing pages).
  2. **Hero**: a short, personal, first-person statement introducing the author (on this site: a highlight/excerpt of the Bio text from Section 3, with a "Read More" button to the About page), rather than a bland tagline.
  3. **Book showcase**: a grid of cover images below the hero, most recent first, each linking through to the Books page.
  4. **Footer**: sitemap-style links, retailer/social links, contact.
- Not replicating: the reference site's "What Readers Say" testimonial section — not requested and no testimonial content has been supplied. Flagged as an open item below in case the author wants it later.

## 2. Home Page

- Purpose: **lead with a Bio highlight**, laid out in the kimberlystuart.com style (see Section 1) — not the full bio text, and not a featured novel.
- Hero content: a **short excerpt/highlight** of the author's bio (drawn from the Section 3 text — e.g. the opening line(s)), plus a **"Read More" button** that links through to the full **About** page (where the complete Section 3 text lives).
- Beneath the bio highlight, include a **book showcase** (grid of cover images, all published books, linking to the Books page) — mirroring the reference site's structure, not limited to a single featured novel.
- No single novel is to be singled out as "the" homepage feature; *On the Trail to Freedom* is just one of the books in the showcase grid like the others.

## 3. About Page (full Bio; Home page shows a highlight of this)

Replace existing About copy with this exact text. The Home page hero shows a short excerpt of this text with a "Read More" button linking here for the full version (Section 2):

> Telling stories is the oldest art form in human history, and to date, it has not lost its ability to entertain, inspire, and expand our imagination. I write stories that inspire readers to overcome challenges and rise above their limitations to reach for greater heights. I also write about God's grace and redemption. My non-fiction books cut across different genres and age groups. I write for adults, young adults, and children.

## 4. Newsletter Section

- Signup copy:

  > Enter your email below to sign up for my free "You Can" Newsletter. It is just a two-minute inspirational note that will impact your life.

- Newsletter name: **"You Can" Newsletter**.
- Content plan: the newsletter content will be drawn from **blog posts** (see Section 7) — same material serves both channels.

## 5. Footer / Lower Page

- Show links/information about **other platforms where the author's books can be found**.
- Currently just **Amazon**. Design it so more retailers (e.g. **Barnes & Noble**, etc.) can be added later — the author will provide the full list of platforms separately.

## 6. Book Listings — Summaries

Each novel/book listing should show a summary beside it. Use these exact summaries (these are the author's finalized versions — replace any existing/incorrect summaries currently on the site):

### The Eyes of Aisha
> Aisha, a young girl with lofty dreams, is forced into marriage, and her desire for education is shattered. She suffers a life-altering ailment during childbirth, which sends her to a long stay in the hospital. While there, she makes friends with Eka, and through chance and technology, they get connected with another young girl on another continent who sets events in motion that help them overcome their health challenges and change the trajectory of their lives.

### On the Trail to Freedom
> Agana is a promising young man whose future is threatened by the greed of his relatives. After the death of his father, he became a target for the men who plot to eliminate him. He is accused of manslaughter and is to be killed as an appeasement to the gods. He will find out if his 'Chi' will save him from his haters.
>
> The novel is set in 19th-century Igboland and explores the customs and traditions that shaped the characters' daily lives and how some of the finer aspects of these traditions influence the worldview of succeeding generations.

### It's All About Love
> This is an exposition of God's golden rule on love in the Bible. We are created to have fellowship with God and with one another, which is anchored in love. The whole of Scripture is based on love; God's love towards us and the admonition for us to love each other. When we love God, we serve Him without reservations, and when we love one another, we demonstrate that we are true disciples of Jesus Christ.
>
> The love notes included in the book are Scriptural reminders to strengthen our faith and help us focus on what is important in our Christian walk.

### Gana's Moonlight Tales
> Gana is an old man who lives with his son in the city. During summer nights, his grandchildren and other neighborhood children gather around him to listen to stories about his childhood and other folktales. His stories are accompanied by songs and lyrics in Igbo folklore. The book makes for an interesting read for children and young adults who want to learn more about African traditions and folktales.

## 6a. Syncing corrected summaries to the database

Book descriptions live in the `books` MongoDB collection and are rendered from there — they are **not hardcoded** in the site's source. Whenever the author sends a corrected/updated summary for a book (like the four in Section 6), the fix is a **data update, not a code change**:

- Script: `scripts/update-book-descriptions.ts` (run via `npm run update:book-descriptions`) — matches each book by its `slug` and `$set`s only the `description` field (and `updatedAt`), leaving cover images, price, and everything else untouched. Safe to re-run; warns instead of failing if a slug isn't found.
- This script currently covers the four titles in Section 6. **When the author sends corrected copy for any other book**, add its slug + new description to the `descriptions` map in that script and re-run it — do not edit description text directly in any `.tsx`/`.ts` page file.
- The one-off seed scripts (`add:trail`, `add:love-cover-books`) that originally created these records still contain the *old* description text in their source as historical seed data — that's fine, since re-running them would only matter for a fresh/empty database; the live data has already been corrected via the sync script above and takes precedence.

**Note**: these summary texts *correct/replace* whatever shorter or differently-worded summaries currently exist in the database for these same four titles — reconcile and update, don't duplicate.

## 7. Blog

- Add a **Blog page**.
- The author will write blog posts; the **same posts** double as newsletter content.
- Important: blog posts must be **readable by any visitor**, without requiring newsletter signup — the blog is not gated behind an email subscription.

## 8. Future / Not Yet Ready (author's own notes — for roadmap awareness, no action required yet)

- The author has many more books to add, organized into categories:
  - Adults
  - Young Adults
  - Children's short stories
  - Christian books
  - When ready, these need to be uploaded and sorted into the above categories. The author explicitly invited input/suggestions on this category structure.
- **Lecture notes**: free downloadable academic/reference material — to be discussed later, not scoped yet.
- **Additional retail platforms** beyond Amazon (e.g. Barnes & Noble) — full list to come later.
- Book listings should eventually include intro/summary text formatted a specific way — the author will send a sample via WhatsApp; not yet received as of this spec.

## Open items / things to confirm with the author

1. Get the sample of how book intro/summary text should be formatted (promised via WhatsApp, not yet sent).
2. Get the full retailer list beyond Amazon for the footer.
3. Confirm exactly which portion of the Section 3 bio text should be used as the Home page highlight excerpt (e.g. just the opening sentence, or a specific pull-quote) — currently to be chosen at implementation time unless the author specifies.
4. Confirm whether existing book summaries in the database for other titles not listed above should stay as-is or if the author has updated versions coming.
5. Confirm if a reader-testimonials section (present on kimberlystuart.com) is wanted — not requested yet and no testimonial content has been supplied.
