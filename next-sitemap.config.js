/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://achievagemilang.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    additionalSitemaps: ['https://achievagemilang.dev/sitemap.xml'],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    let priority = 0.7;
    let changefreq = 'daily';
    let lastmod = new Date().toISOString();

    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Blog listing page
    else if (path === '/blogs') {
      priority = 0.9;
      changefreq = 'daily';
    }
    // Individual blog posts - higher priority for content
    else if (path.startsWith('/blogs/')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    // Other pages
    else if (path === '/about' || path === '/projects') {
      priority = 0.8;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod,
    };
  },
};
