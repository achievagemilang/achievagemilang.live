export const en = {
  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    blog: 'Writes',
  },
  hero: {
    greeting: "Hi, I'm",
    role: 'Software Engineer',
    description:
      'A life-long learner **Software Engineer** with a product-driven mindset, blending technical expertise with strategic thinking.',
    cta: 'View My Work',
    contact: 'Contact Me',
    about: 'About Me',
    resume: 'Resume',
  },
  home: {
    hero: {
      resume: 'Resume',
    },
    experience: {
      title: 'Experiences',
      professional: 'Professional',
      work: 'Work',
      education: 'Education',
      edu: 'Edu',
      volunteer: 'Org/Volunteering',
      org: 'Volunteer',
      present: 'Present',
      visitWebsite: 'Visit Website',
      showMore: 'Show {count} More',
      collapseAll: 'Collapse All',
    },
    projects: {
      title: 'Featured Projects',
      viewAll: 'View All Projects',
    },
    blog: {
      title: 'Latest Writes',
      viewAll: 'View All Writes',
    },
  },
  notFound: {
    title: 'Page Not Found',
    description:
      "Oops! The page you're looking for seems to have wandered off into the digital void. Let's get you back on track.",
    goHome: 'Go Home',
    browseBlog: 'Browse Blog',
    goBack: 'Go Back',
  },
  footer: {
    rights: 'All rights reserved.',
    builtWith: 'Built with Next.js and Tailwind CSS',
  },
  about: {
    bento: {
      profile: {
        greeting: 'Hi, Cip here!',
        role: 'Software Engineer',
        socials: 'Socials',
        resume: 'Resume',
      },
      mission: {
        title: 'My Mission',
        descriptionPart1:
          'I blend technical expertise with strategic thinking to build scalable, user-centric solutions. Currently captivated by ',
        descriptionHighlight: 'AI Agents',
        descriptionPart2: ' and building next-gen products.',
      },
      techStack: {
        title: 'Tech Stack',
      },
      learner: {
        title: 'Lifelong Learner',
        description:
          'I believe in learning in public and contributing back to the community. Documenting failures and successes to help others grow.',
        writing: 'Writing',
        sharing: 'Sharing',
        growing: 'Growing',
      },
      hobbies: {
        title: 'Beyond Coding',
        gaming: 'Gaming',
        reading: 'Reading',
        gym: 'Gym',
      },
      contact: {
        title: "Let's Talk!",
        subtitle: 'Open to opportunities',
      },
    },
    contactForm: {
      title: 'Get in Touch',
      descriptionPart1: 'Reach out to me via email or LinkedIn.',
      descriptionPart2: "I'll get back to you as soon as possible.",
      email: 'Email Me',
      linkedin: 'LinkedIn',
    },
  },
  blog: {
    title: 'All Writes',
    search: {
      placeholderWrites: 'Search writes...',
      placeholderProjects: 'Search projects...',
    },
    filter: {
      year: 'Year',
      filterByYear: 'Filter by Year',
      clearFilters: 'Clear Filters',
    },
    empty: {
      noWrites: 'No writes found matching your criteria.',
      loading: 'Loading writes...',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
    },
    card: {
      minRead: 'min read',
      readMore: 'Read More',
    },
    related: {
      title: 'Read More',
    },
  },
  project: {
    title: 'All Projects',
    filter: {
      year: 'Year',
      filterByYear: 'Filter by Year',
      techStack: 'Tech Stack',
      filterByTechStack: 'Filter by Tech Stack',
      clear: 'Clear',
      clearFilters: 'Clear Filters',
    },
    empty: {
      noProjects: 'No projects found matching your criteria.',
      loading: 'Loading projects...',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
    },
    card: {
      viewDetails: 'View Details',
      visitProject: 'Visit Project',
      less: 'Less',
      showMore: 'Show all {count} technologies',
      showLess: 'Show less',
    },
    related: {
      title: 'Read More',
    },
    detail: {
      author: 'Author',
      visitProject: 'Visit Project',
    },
  },
  newsletter: {
    heading: 'Stay Updated',
    description: 'Get new posts delivered to your inbox.',
    placeholder: 'your@email.com',
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    success: 'Check your email to confirm your subscription!',
    alreadySubscribed: 'You are already subscribed!',
    error: 'Something went wrong. Please try again.',
    rateLimited: 'Too many attempts. Please try again later.',
    status: {
      confirmed: {
        title: 'Subscription Confirmed!',
        message: "Welcome aboard! You'll receive new posts in your inbox.",
      },
      unsubscribed: {
        title: 'Unsubscribed',
        message: "You've been removed from the mailing list.",
      },
      error: {
        title: 'Something Went Wrong',
        message: 'Please try again or contact us if the issue persists.',
      },
      goToBlog: 'Go to Blog',
    },
  },
};

export type Dictionary = typeof en;
