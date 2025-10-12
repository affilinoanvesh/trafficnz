# Boost SEO Website

A modern, fast, and SEO-optimized website built with [Astro.js](https://astro.build/).

## 🚀 Features

- **Server-Side Rendering (SSR)** - Optimized for SEO and performance
- **React Integration** - For interactive components when needed
- **Tailwind CSS** - Modern utility-first CSS framework
- **TypeScript** - Full type safety and better development experience
- **Automatic Sitemap Generation** - SEO optimization out of the box
- **Fast Development** - Hot reload and instant updates

## 🛠️ Tech Stack

- **Framework**: Astro.js 5.13+
- **UI Library**: React 19+
- **Styling**: Tailwind CSS 4+
- **Language**: TypeScript
- **Package Manager**: npm

## 📦 What's Included

- **Astro**: Core framework for static site generation and SSR
- **@astrojs/react**: React integration for interactive components
- **@astrojs/sitemap**: Automatic sitemap generation
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type checking and enhanced development experience
- **astro-seo**: SEO utilities for better search engine optimization

## 🏃‍♂️ Quick Start

### Development Server
Start the development server with hot reload:

```bash
npm run dev
```

Your site will be available at `http://localhost:4321`

### Build for Production
Create a production build:

```bash
npm run build
```

### Preview Production Build
Preview the production build locally:

```bash
npm run preview
```

### Type Checking
Run TypeScript checking:

```bash
npm run check
```

Watch for type errors during development:

```bash
npm run check:watch
```

## 📁 Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Counter.tsx      # Example React component
│   ├── layouts/
│   │   └── Layout.astro     # Base layout component
│   ├── pages/
│   │   └── index.astro      # Homepage
│   └── styles/
│       └── global.css       # Global styles (Tailwind)
├── astro.config.mjs         # Astro configuration
├── package.json
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The global stylesheet is imported in the Layout component and includes Tailwind's base styles.

## ⚡ Performance

Astro provides excellent performance out of the box:
- **Zero JavaScript by default** - Only ships JS when needed
- **Automatic code splitting** - Optimal loading performance
- **Built-in optimizations** - Images, CSS, and more
- **SEO-friendly** - Server-side rendering for better search rankings

## 🔧 Configuration

### Site URL
Update the `site` field in `astro.config.mjs` with your actual domain for proper sitemap generation:

```js
export default defineConfig({
  site: 'https://boostseo.co.nz',
  // ...
});
```

### Customization
- **Tailwind**: Modify `tailwind.config.js` for custom styles
- **TypeScript**: Adjust `tsconfig.json` for TypeScript settings
- **Astro**: Configure integrations in `astro.config.mjs`

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build/)
- [Astro Discord](https://astro.build/chat)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## 🚀 Deployment

This Astro project can be deployed to various platforms:

- **Netlify**: Zero-config deployment
- **Vercel**: Perfect for React components
- **GitHub Pages**: Free static hosting
- **AWS**: Enterprise-grade scaling
- **Any static host**: Works everywhere

Refer to the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/) for detailed instructions.