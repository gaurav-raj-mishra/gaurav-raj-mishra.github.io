/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — everything personal about the site lives here.
 *  Fill in your real handles/URLs below, tweak the tagline, done.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE = {
  name: "Gaurav Raj Mishra",
  title: "Gaurav Raj Mishra",
  description:
    "Personal site and blog of Gaurav Raj Mishra — medicine, radiology, data science, books, and other curiosities.",
  // Short line under your name on the homepage.
  tagline: "I read, write, feel and live stories - in words, pictures, thoughts and deeds.",
  // A few sentences about you, shown in the About section.
  // Each array item renders as its own paragraph.
  about: [
    "I'm a medical student on my way to radiology, with a data science obsession. The two turn out to be similar jobs cognitively: reading patterns out of noisy data — in one case scans, in the other spreadsheets — and telling someone what they actually mean.",
    "Most of my technical work happens in R and Python: exploratory analysis, classifiers, and the occasional deep dive that starts as \"a quick look\" and ends three evenings later. I publish weekly visualization work through TidyTuesday and compete on Kaggle.",
    "Away from the wards and the keyboard I read a lot — my Goodreads is the most honest record of where my head has been. This site is where all of it meets: a home for essays, notebooks, and notes to my future self.",
  ],
  email: "mailforgauravmishra@gmail.com",
} as const;

/**
 * Social links — replace every "REPLACE_ME" with your real handle/URL.
 * Shown as icon-only buttons in the "Let's connect" section.
 * `icon` must be a key of ICONS in src/components/icons.ts.
 */
export const SOCIALS = [
  { label: "GitHub",    url: "https://github.com/gaurav-raj-mishra",                  icon: "github"    },
  { label: "Kaggle",    url: "https://www.kaggle.com/gauravrajmishra",              icon: "kaggle"    },
  { label: "LinkedIn",  url: "https://www.linkedin.com/in/gaurav-mishra-9882191b4",         icon: "linkedin"  },
  { label: "X",         url: "https://x.com/REPLACE_ME",                       icon: "x"         },
  { label: "Instagram", url: "https://www.instagram.com/gaurav.raj.mishra",           icon: "instagram" },
  { label: "Goodreads", url: "https://www.goodreads.com/user/show/184394006-gaurav-mishra", icon: "goodreads" },
  { label: "Email",     url: "mailto:mailforgauravmishra@gmail.com",           icon: "email"     },
] as const;
