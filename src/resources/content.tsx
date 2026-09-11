import { About, Home, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Yanliang",
  lastName: "Liu",
  name: `Yanliang Liu`,
  role: "Computer Science Student",
  avatar: "/images/avatar.jpg",
  email: "liuyanliang369@gmail.com",
  location: "Asia/Shanghai", // IANA time zone identifier
  languages: [], // optional: leave empty to hide the language tags
  locale: "en", // BCP 47 language tag for the HTML lang attribute
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /src/resources/icons.ts
  // Set essential: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/liuyanliang666",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Open-source projects and research by ${person.name}`,
  headline: <>Building what I want to understand.</>,
  featured: {
    display: false,
    title: <>Featured work</>,
    href: "/work",
  },
  subline: (
    <>
      Hi, I'm Yanliang Liu. I'm an undergraduate at East China Normal University's School of
      Computer Science and Technology, building things, running experiments, and seeing where
      interesting ideas lead.
    </>
  ),
};

// Cycled in the hero as a typewriter, in place of the static headline/subline above.
const heroQuotes: Array<{ text: string; author: string }> = [
  {
    text: "To predict the next token well, you have to understand the underlying reality that generated it.",
    author: "Ilya Sutskever",
  },
  {
    text: "The bitter lesson is that general methods that leverage computation are ultimately the most effective.",
    author: "Rich Sutton",
  },
  {
    text: "First solve intelligence, then use that to solve everything else.",
    author: "Demis Hassabis",
  },
  {
    text: "The world is its own best model.",
    author: "Rodney Brooks",
  },
  {
    text: "These systems do not just predict the next word; they build internal representations of the world.",
    author: "Geoffrey Hinton",
  },
  {
    text: "Gradient descent can write code better than you.",
    author: "Andrej Karpathy",
  },
  {
    text: "Text is a low-dimensional projection of the real world.",
    author: "Ilya Sutskever",
  },
  {
    text: "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
    author: "Alan Turing",
  },
];

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role}`,
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Hi there 👋 — I'm Yanliang Liu, an undergraduate at the School of Computer Science and
        Technology, East China Normal University. My main research interest is reinforcement
        learning. Imitation can only take a model as far as what it was shown; learning from
        outcomes is what lets it go further, and I think that's where the next real progress will
        come from. Away from the desk I'm usually on a court or a pitch — football, basketball,
        table tennis. Same appeal, really: you only get good by playing, losing, and adjusting.
      </>
    ),
  },
  work: {
    display: false, // flip to true once you fill in internships or research positions
    title: "Experience",
    experiences: [
      {
        company: "Lab or company name",
        timeframe: "2026 - Present",
        role: "Your role",
        achievements: [<>What you did there, one bullet per line.</>],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Education",
    institutions: [
      {
        name: "East China Normal University",
        timeframe: "2024 - Present",
        description: <>School of Computer Science and Technology, B.S. in Computer Science.</>,
        logo: "/images/brand/ecnu-emblem.svg",
      },
    ],
  },
  publications: {
    display: true, // set to false to hide this section
    title: "Publications",
    items: [
      // Newest first. Wrap your own name in <strong> so it stands out in the author list.
      {
        title: "Paper title goes here",
        authors: (
          <>
            First Author, <strong>Your Name</strong>, Last Author
          </>
        ),
        venue: "Conference or journal name",
        year: "2026",
        status: "Under review", // omit this field once it's accepted
        description: <>One sentence on what the paper does and why it matters.</>,
        links: [
          { label: "arXiv", href: "https://arxiv.org/abs/0000.00000", icon: "document" },
          { label: "Code", href: "https://github.com/", icon: "github" },
        ],
      },
    ],
  },
  technical: {
    display: false, // flip to true once you fill in your own stack
    title: "Technical skills",
    skills: [
      {
        title: "Your main language or framework",
        description: <>What you use it for.</>,
        tags: [{ name: "Python", icon: "python" }],
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Open-source projects by ${person.name}`,
  // Create new project pages by adding a .mdx file to src/app/work/projects
  // All projects are listed on the /home and /work routes
};

export { person, social, home, about, work, heroQuotes };
