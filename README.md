# Portfolio Website

A modern, responsive portfolio website built with Next.js, showcasing projects, blog posts, and professional experience. Features an AI-powered chat assistant, contact form, and beautiful animations.

🌐 **Live Demo**: [achievagemilang.dev](https://achievagemilang.dev)

## ✨ Features

- 🏠 **Homepage**: Hero section, featured projects, recent blog posts, and experience timeline
- 💼 **Projects**: Comprehensive project showcase with filtering, search, and pagination
- ✍️ **Blog**: MDX-powered blog with syntax highlighting, code blocks, and tag filtering
- 👤 **About**: Personal information, AI chat assistant, and contact form
- 🤖 **AI Chat Assistant**: Gemini-powered chat bot for answering questions about skills and experience
- 🎙️ **Voice AI Widget**: ElevenLabs-powered voice conversation interface
- 📧 **Contact Form**: Email integration using Resend
- 📅 **Google Calendar Integration**: Calendar API for scheduling (configured)
- 🌙 **Dark Mode**: Full dark mode support with smooth transitions
- 📱 **Responsive Design**: Fully responsive across all device sizes
- ⚡ **Performance**: Optimized with Next.js 15, image optimization, and static generation
- 🎨 **Animations**: Smooth animations using Framer Motion
- 🔍 **SEO**: Meta tags, Open Graph, Twitter cards, and sitemap generation
- 🏗️ **Clean Architecture**: Well-structured codebase following clean architecture principles

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Framer Motion** - Animation library
- **CSS Variables** - Theme customization

### Content Management

- **MDX** - Markdown with React components
- **next-mdx-remote** - MDX rendering
- **gray-matter** - Front matter parsing
- **Contentlayer** - Content management (configured)

### APIs & Services

- **Google Gemini API** - AI chat assistant
- **ElevenLabs API** - Voice AI conversations
- **Resend** - Email service for contact form
- **Google Calendar API** - Calendar integration
- **Vercel Analytics** - Website analytics

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **next-sitemap** - Sitemap generation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for (optional, depending on features you want to use):
  - Google Gemini API (for AI chat assistant)
  - ElevenLabs API (for voice AI widget)
  - Resend API (for contact form)
  - Google Calendar API (for calendar integration)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory. Copy from `env.example`:

   ```bash
   cp env.example .env.local
   ```

   Then update the values in `.env.local`:

   ```env
   # Google Gemini API (for AI chat)
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_API_URL=your_gemini_api_url

   # Resend API (for contact form)
   RESEND_API_KEY=your_resend_api_key

   # ElevenLabs API (for voice AI)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_AGENT_ID=your_agent_id

   # Google Calendar API (optional)
   GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
   GOOGLE_CALENDAR_ID=primary
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY="your_private_key"
   ```

   **Note**: You can leave unused API keys empty if you don't plan to use those features.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

This project follows **Clean Architecture** principles with clear separation of concerns:

```
portfolio-website/
├── app/                          # Next.js App Router pages
│   ├── about/                   # About page
│   ├── api/                     # API routes
│   │   ├── ai-chat/            # AI chat endpoint
│   │   ├── contact/            # Contact form endpoint
│   │   └── config/             # Configuration endpoint
│   ├── blogs/                  # Blog pages
│   │   └── [slug]/            # Individual blog posts
│   ├── projects/               # Projects page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
│
├── domain/                      # Domain Layer (Business Logic)
│   ├── dtos/                   # Data Transfer Objects
│   │   ├── ai-chat.dto.ts
│   │   └── contact.dto.ts
│   └── interfaces/             # Domain interfaces (abstractions)
│       ├── ai-service.interface.ts
│       ├── email-service.interface.ts
│       ├── blog-post.repository.interface.ts
│       └── project.repository.interface.ts
│
├── application/                 # Application Layer (Use Cases)
│   ├── services/               # Application services
│   │   ├── ai-chat.service.ts
│   │   ├── contact.service.ts
│   │   └── project.service.ts
│   └── validators/             # Validation schemas (Zod)
│       ├── ai-chat.validator.ts
│       └── contact.validator.ts
│
├── infrastructure/              # Infrastructure Layer (Implementation)
│   ├── repositories/           # Data access implementations
│   │   ├── file-system-blog-post.repository.ts
│   │   └── in-memory-project.repository.ts
│   ├── services/               # External service implementations
│   │   ├── gemini-ai.service.ts
│   │   ├── resend-email.service.ts
│   │   └── email-template.service.ts
│   └── config/                 # Service/repository factories
│       ├── services.config.ts
│       └── repositories.config.ts
│
├── components/                  # React components
│   ├── about/                 # About page components
│   ├── blogs/                 # Blog components
│   ├── home/                  # Homepage components
│   ├── layout/                # Layout components (navbar, footer)
│   ├── projects/              # Project components
│   ├── ui/                    # shadcn/ui components
│   ├── voice-ai-widget/       # Voice AI components
│   └── util/                  # Utility components
│
├── content/                     # MDX blog posts
│   └── posts/                 # Blog post files
│
├── constant/                    # Static data
│   └── constant.ts            # Projects, experiences, etc.
│
├── lib/                         # Utility functions
│   ├── mdx.ts                 # MDX helper functions
│   ├── utils.ts               # General utilities
│   ├── tech-stack-logos.tsx   # Tech stack logo components
│   └── tech-stack-svg-mapper.ts
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── public/                      # Static assets
│   ├── project/               # Project images
│   ├── techstack/             # Tech stack SVG icons
│   └── ...                    # Other assets
│
└── styles/                      # Global styles
    └── globals.css
```

### Architecture Overview

The project follows **Clean Architecture** principles:

1. **Domain Layer** (`domain/`): Contains business entities, DTOs, and interfaces that define contracts
2. **Application Layer** (`application/`): Contains use cases (services) and validation logic
3. **Infrastructure Layer** (`infrastructure/`): Contains implementations of interfaces (repositories, external services)

This architecture provides:

- ✅ **Testability**: Services can be easily unit tested with mock dependencies
- ✅ **Maintainability**: Clear separation makes code easier to understand and modify
- ✅ **Scalability**: Easy to add new features without affecting existing code
- ✅ **Flexibility**: Can swap implementations (e.g., switch from Resend to SendGrid)
- ✅ **Type Safety**: Full TypeScript support with proper interfaces and DTOs

For more details, see [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md).

## 📝 Available Scripts

- `npm run dev` - Start development server on [http://localhost:3000](http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server (run after build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run postbuild` - Generate sitemap (runs automatically after build)

## 🎨 Customization

### Adding Blog Posts

1. Create a new `.mdx` file in `content/posts/`
2. Add front matter:

   ```mdx
   ---
   title: 'Your Blog Post Title'
   date: '2024-01-01'
   excerpt: 'A brief description'
   tags: ['Tag1', 'Tag2']
   ---

   Your content here...
   ```

### Updating Projects

Edit `constant/constant.ts` to add or modify projects:

```typescript
export const projectList = [
  {
    id: 1,
    title: 'Project Name',
    description: 'Project description',
    image: '/project/image.png',
    link: 'https://project-link.com',
    tags: ['Next.js', 'TypeScript'],
    year: 2024,
  },
  // ... more projects
];
```

### Updating Experiences

Edit `constant/constant.ts` to update work experience, education, etc.

### Changing Theme Colors

Modify CSS variables in `app/globals.css`:

```css
:root {
  --primary: /* your color */;
  --background: /* your color */;
  /* ... other variables */
}
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be automatically deployed on every push to the main branch.

### Other Platforms

This is a standard Next.js application and can be deployed to:

- Netlify
- AWS Amplify
- Railway
- Any platform that supports Next.js

## 🔧 Configuration

### Sitemap

The sitemap is automatically generated using `next-sitemap`. Configuration is in `next-sitemap.config.js`. The sitemap is generated after each build.

### MDX Configuration

MDX configuration is in `next.config.mjs` and `contentlayer.config.ts`. The project uses:

- `@next/mdx` for MDX support
- `next-mdx-remote` for rendering MDX content
- `gray-matter` for front matter parsing
- `remark` and `rehype` plugins for enhanced markdown features

### Image Optimization

Configure remote image domains in `next.config.mjs`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
    },
  ],
}
```

### SVG Import

SVG files can be imported as React components using `@svgr/webpack`. Configured in `next.config.mjs`:

```javascript
// Import SVG as component
import Logo from '@/public/logo.svg';
```

### Clean Architecture

The project uses dependency injection through factory functions in `infrastructure/config/`:

- `repositories.config.ts` - Creates repository instances
- `services.config.ts` - Creates service instances

To swap implementations, modify these configuration files.

## 🧪 Testing

Currently, the project doesn't include automated tests. Future improvements may include:

- Unit tests for services and validators
- Integration tests for API routes
- Component tests for UI components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When contributing, please follow the existing code structure and architecture patterns.

## 📄 License

This project is private and personal. All rights reserved.

## 👤 Author

**Achieva Futura Gemilang**

A software engineer with a product-driven mindset, specializing in mobile and backend development. Currently focused on leveraging AI agents to create next-generation products.

- Website: [achievagemilang.dev](https://achievagemilang.dev)
- Email: achievafuturagemilang@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon library

---

Made with ❤️ using Next.js
