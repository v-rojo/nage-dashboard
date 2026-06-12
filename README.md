# NAGE Dashboard 🏥

**NAGE** stands for **AI-powered hospital inventory management and analysis engine**. This is a modern, production-grade dashboard for healthcare professionals to manage medical supplies, predict demand using Claude AI, and optimize procurement workflows.

## 🎯 Project Overview

This MVP (Minimum Viable Product) solves critical challenges in hospital inventory management:

- **Real-time Inventory Tracking**: Monitor stock levels across multiple departments with color-coded status indicators
- **AI-Powered Predictions**: Claude AI analyzes historical consumption patterns to forecast demand and prevent stockouts
- **Automated Alerts**: Critical stock levels, expiration dates, and anomalies trigger intelligent notifications
- **Procurement Optimization**: AI suggests optimal reorder quantities and identifies cost-saving opportunities
- **Multi-Department Support**: Centralized view with department-level filtering for large hospital networks

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI Engine**: Claude API (Anthropic SDK)
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel (automatic CI/CD)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Claude API key from [Anthropic](https://console.anthropic.com/)
- Git installed

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/v-rojo/nage-dashboard.git
cd nage-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your Claude API key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
nage-dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── predictions/page.tsx
│   │   ├── alerts/page.tsx
│   │   ├── procurement/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   └── api/               # Backend API routes
│       ├── predictions/route.ts
│       └── recommendations/route.ts
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   ├── inventory/        # Inventory components
│   ├── predictions/      # Prediction components
│   ├── alerts/           # Alert components
│   ├── procurement/      # Procurement components
│   ├── shared/           # Shared components
│   └── ai-chat/          # AI chat interface
├── lib/                   # Utilities & logic
│   ├── api/              # API clients (Claude)
│   ├── mock-data/        # Mock data generators
│   ├── types/            # TypeScript definitions
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
├── hooks/                 # Custom React hooks
├── styles/                # Global styles
├── public/                # Static assets
├── .env.example          # Environment template
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript config
└── next.config.js        # Next.js config
```

## 🧠 Claude AI Integration

The dashboard uses Claude API for intelligent inventory analysis:

- **Demand Predictions**: Analyzes consumption patterns to forecast 7, 14, 30-day demand
- **Recommendations**: Suggests optimal reorders, identifies cost savings
- **Risk Assessment**: Detects anomalies and predicts stockouts
- **Natural Language**: Contextual insights in plain English

### Getting Your Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new key
5. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

## 🎨 Design System

- **Primary Color**: Professional Blue (#0084D4)
- **Status Colors**: Green (healthy), Yellow (warning), Red (critical)
- **Typography**: Inter font family
- **Components**: Built with shadcn/ui

## 🚢 Deployment to Vercel

### Automatic Deployment (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select this repository
5. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
6. Click Deploy

### Manual Deployment

```bash
npm install -g vercel
vercel login
vercel
```

## 📊 Features

### Dashboard Overview
- KPI cards (inventory value, alerts, expiring items)
- Real-time consumption trends with AI forecast
- Stock health visualization
- Recent activity timeline

### Inventory Management
- Full-text search with filters
- Sortable data table
- Visual status badges
- AI demand predictions

### AI Predictions
- 7-day demand forecast with confidence intervals
- Risk heatmap
- Anomaly detection
- Forecast accuracy metrics

### Alerts System
- Severity-based notifications
- Acknowledge workflow
- Timeline view
- AI-suggested actions

### Procurement
- Reorder suggestions from Claude AI
- Supplier comparison
- Cost estimation
- Approval workflow

### Analytics
- Waste analysis
- Department comparisons
- Forecast accuracy
- Savings tracking

## 📝 Environment Variables

Create `.env.local`:

```env
# Claude AI
ANTHROPIC_API_KEY=sk-ant-your-key-here
NEXT_PUBLIC_CLAUDE_MODEL=claude-3-5-sonnet-20241022

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📚 Documentation

Each folder contains a `README.md` explaining:
- **Why** it exists
- **What** it contains
- **How** to use it

See:
- `lib/README.md` - Utilities documentation
- `hooks/README.md` - Custom hooks guide
- `components/README.md` - Component architecture

## 🗺️ Roadmap

- [ ] Database integration (MongoDB/Firebase)
- [ ] User authentication (Auth0)
- [ ] Real-time updates (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced ML models
- [ ] Email/SMS notifications
- [ ] Multi-hospital network support
- [ ] HIPAA compliance reporting

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## 📄 License

MIT License - Feel free to use this for commercial or personal projects.

## 🆘 Support & Questions

For issues or questions:
- Open a GitHub issue
- Check folder READMEs for detailed documentation
- Review the [Anthropic API docs](https://docs.anthropic.com)

---

**Made with ❤️ for better hospital inventory management**

Last Updated: June 2026
