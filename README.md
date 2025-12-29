# 🌍 Daily Global Insights - NEXUS

A modern, real-time news aggregation platform that delivers the latest global news with a beautiful, responsive interface. Stay informed with breaking news, category-based filtering, and intelligent search functionality.

## 🚀 Live Demo

**🌐 GitHub Pages:** [https://ssr4king.github.io/Daily-Global-Insights/](https://ssr4king.github.io/Daily-Global-Insights/)

**☁️ Netlify:** [https://daily-globalinsights.netlify.app](https://daily-globalinsights.netlify.app)

---

## ✨ Features

- 📰 **Real-time News Feed** - Get the latest news from around the world
- 🔍 **Smart Search** - Search through thousands of articles with debounced search
- 📂 **Category Filtering** - Browse news by categories:
  - General
  - Sports
  - Health
  - Technology
  - Business
  - Entertainment
  - Science
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- ⚡ **Fast Performance** - Optimized with caching and lazy loading
- 🌐 **Multi-platform** - Deployed on both GitHub Pages and Netlify
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔄 **Auto-refresh** - Breaking news ticker with real-time updates

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **TanStack Query** - Powerful data fetching and caching
- **Wouter** - Lightweight routing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **Serverless Functions** - Netlify Functions for scalable API

### APIs & Services
- **NewsData.io API** - News data provider
- **Netlify** - Hosting and serverless functions
- **GitHub Pages** - Static site hosting

### Development Tools
- **Drizzle ORM** - Type-safe database toolkit
- **Zod** - Schema validation
- **ESBuild** - Fast bundler
- **PostCSS** - CSS processing

---

## 📦 Project Structure

```
Daily-Global-Insights/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utility functions
│   └── index.html
├── server/                  # Backend Express server
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Caching layer
│   └── index.ts            # Server entry point
├── shared/                  # Shared types and schemas
├── netlify/                 # Netlify Functions
│   └── functions/          # Serverless functions
└── .github/                 # GitHub Actions workflows
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ssr4king/Daily-Global-Insights.git
   cd Daily-Global-Insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Start production server**
   ```bash
   npm start
   ```

---

## 🌐 Deployment

### Netlify Deployment

The project is configured for automatic deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect `netlify.toml`
3. Build command: `npm run build`
4. Publish directory: `dist/public`

**Live URL:** [https://daily-globalinsights.netlify.app](https://daily-globalinsights.netlify.app)

### GitHub Pages Deployment

1. Go to repository Settings → Pages
2. Select "GitHub Actions" as source
3. The workflow will automatically deploy on push to `main`

**Live URL:** [https://ssr4king.github.io/Daily-Global-Insights/](https://ssr4king.github.io/Daily-Global-Insights/)

---

## 📝 API Endpoints

- `GET /api/news` - Get news articles
  - Query params: `category`, `country`
- `GET /api/search?q=<query>` - Search news articles

---

## 🎨 Features in Detail

### Breaking News Ticker
Real-time scrolling ticker showing the latest breaking news at the top of the page.

### Hero Section
Featured article display with large image and prominent headline.

### Category Navigation
Easy navigation between different news categories with smooth transitions.

### Search Functionality
- Debounced search for optimal performance
- Real-time results
- Search across all articles

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shubham Kumar**

- GitHub: [@ssr4king](https://github.com/ssr4king)
- Email: s.shubham999000@gmail.com

---

## 🙏 Acknowledgments

- [NewsData.io](https://newsdata.io/) for providing news API
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All the amazing open-source contributors

---

## 📊 Project Stats

![TypeScript](https://img.shields.io/badge/TypeScript-98.2%25-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

---

⭐ **Star this repo if you find it helpful!**

