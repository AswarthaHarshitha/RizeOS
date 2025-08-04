# RizeOS Core Team Platform
## Job & Networking Portal - Internship Assessment

A comprehensive full-stack web application inspired by LinkedIn, Upwork, and AngelList, enhanced with AI-powered features and Web3 blockchain payment integration.

## 🚀 Overview

This platform demonstrates full-stack development, Web3 integration, AI features, and product thinking skills for the RizeOS Core Team Internship assessment.

### Key Features
- **User Authentication**: JWT-based registration/login system
- **Profile Management**: Complete professional profiles with AI-extracted skills
- **Job Posting & Feed**: Social feed with job listings and filtering
- **Web3 Integration**: MetaMask/Phantom wallet connection with blockchain payments
- **AI Features**: Skill extraction, job matching, and career insights using OpenAI GPT-4o

## 🛠 Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain**: Ethereum, Polygon, Solana support
- **Wallets**: MetaMask (EVM), Phantom (Solana)
- **AI**: OpenAI GPT-4o for NLP features
- **Authentication**: JWT tokens with bcrypt password hashing

## 📋 Assessment Requirements Completed

### ✅ Module 1: Authentication & Profile Management
- User registration/login with JWT authentication
- Complete profile creation with name, bio, LinkedIn URL
- AI-extracted skills from profile text
- Public wallet address integration from connected wallets

### ✅ Module 2: Job Posting + Feed
- Authenticated job posting (title, description, skills, budget)
- Social feed with job listings and user posts
- Advanced filtering by skills, location, and remote work
- Secure backend data storage with PostgreSQL

### ✅ Module 3: Blockchain Payment Integration
- MetaMask and Phantom wallet connection
- Platform fee payment system (0.001 ETH/MATIC or 0.01 SOL)
- Transaction verification and confirmation
- Job posting enabled only after successful payment
- Admin wallet for fee collection

### ✅ Module 4: AI Enhancements
- **Job ↔ Applicant Matching**: NLP-based match scoring between job descriptions and candidate profiles
- **Resume Skill Extraction**: Automatic skill parsing from bio/resume text
- **Career Insights**: AI-powered career recommendations and skill gap analysis
- **Smart Job Suggestions**: Personalized job recommendations based on user profile

## 🌐 Supported Blockchains & Wallets

- **Ethereum**: MetaMask wallet, 0.001 ETH platform fee
- **Polygon**: MetaMask wallet, 0.001 MATIC platform fee  
- **Solana**: Phantom wallet, 0.01 SOL platform fee

## 🤖 AI Features

All AI features use OpenAI GPT-4o for advanced natural language processing:

1. **Skill Extraction**: Automatically extracts professional skills from user bios and job descriptions
2. **Job Matching**: Calculates compatibility scores between candidates and job requirements
3. **Career Insights**: Provides personalized career advice and skill development recommendations
4. **Smart Filtering**: AI-enhanced job filtering and recommendation system

## 💰 Monetization Strategy

- **Platform Fees**: Blockchain payment required for job posting
- **Subscription Model**: Premium features for enhanced matching and analytics
- **Commission Structure**: Percentage-based fees on successful job placements
- **Token Utility**: Future tokenomics for platform governance and rewards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- MetaMask or Phantom wallet for testing

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
# Database (auto-configured in Replit)
DATABASE_URL=your_postgresql_url

# AI Features
OPENAI_API_KEY=your_openai_api_key
```

3. **Initialize database**:
```bash
npm run db:push
```

4. **Start the application**:
```bash
npm run dev
```

The application runs on port 5000 with both frontend and backend served together.

## 📱 Usage Guide

### Getting Started
1. **Register**: Create account with your professional information
2. **Profile Setup**: Add bio, skills, and LinkedIn URL
3. **Connect Wallet**: Link MetaMask or Phantom wallet
4. **Explore Jobs**: Browse and filter job opportunities
5. **Post Jobs**: Pay platform fee and post your own job listings

### Testing Payments
Use testnet tokens for payment testing:
- **Ethereum**: Sepolia testnet ETH
- **Polygon**: Mumbai testnet MATIC
- **Solana**: Devnet SOL

Admin wallet addresses are configured in the Web3 service for fee collection.

## 🏗 Architecture

### Frontend Structure
```
client/src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
└── App.tsx        # Main application component
```

### Backend Structure
```
server/
├── services/      # Business logic (auth, AI, Web3)
├── routes.ts      # API endpoint definitions
├── storage.ts     # Database operations
└── index.ts       # Server entry point
```

### Database Schema
- **Users**: Complete professional profiles with Web3 integration
- **Jobs**: Job postings with payment tracking
- **Posts**: Social feed content
- **Applications**: Job application system
- **Payments**: Blockchain transaction records
- **Connections**: Professional networking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create new job (requires payment)
- `GET /api/jobs/matches/current-user` - AI-powered job matches

### Payments
- `POST /api/payments/verify` - Verify blockchain transaction
- `GET /api/payments/status/:txHash` - Check payment status

### AI Features
- `POST /api/ai/extract-skills` - Extract skills from text
- `POST /api/ai/job-match` - Calculate job compatibility
- `GET /api/ai/career-insights` - Get career recommendations

## 🧪 Testing

### Manual Testing Scenarios
1. **User Flow**: Registration → Profile setup → Wallet connection → Job browsing
2. **Job Posting**: Payment flow → Transaction verification → Job activation
3. **AI Features**: Skill extraction → Job matching → Career insights
4. **Social Features**: Post creation → Feed interaction → Networking

### Payment Testing
- Use testnet wallets with sufficient test tokens
- Test different blockchain networks (Ethereum, Polygon, Solana)
- Verify transaction confirmation and job activation

## 🚀 Deployment

The application is configured for deployment on:
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway
- **Database**: Neon, Supabase PostgreSQL

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `JWT_SECRET`: JWT token signing secret

## 📈 Future Roadmap

### Phase 1 (Months 1-3): MVP Enhancement
- Advanced AI matching algorithms
- Mobile application development
- Enhanced social networking features
- Multi-language support

### Phase 2 (Months 4-6): Scale & Growth
- Smart contract deployment for automated payments
- Advanced analytics dashboard
- Enterprise features for companies
- Integration with major job boards

### Phase 3 (Months 7-12): Platform Evolution
- Decentralized governance with token utility
- Advanced AI-powered career coaching
- Global expansion and partnerships
- Series A fundraising

## 👥 GTM Strategy

### Target Users
- **Primary**: Recent graduates and early-career professionals in tech
- **Secondary**: Freelancers and remote workers
- **Tertiary**: Startups and SMEs looking for talent

### User Acquisition (₹5,000 Budget)
1. **Social Media**: LinkedIn, Twitter organic content + ₹2,000 targeted ads
2. **Community**: University partnerships and student ambassador program
3. **Content**: Technical blog posts and career advice content
4. **Referrals**: User incentive program with token rewards

### Revenue Streams
1. **Platform Fees**: ₹50-100 per job posting via blockchain payments
2. **Subscriptions**: ₹150/month premium features for enhanced matching
3. **Commission**: 5% fee on successful job placements
4. **Enterprise**: ₹5,000/month plans for companies with advanced features

## 📊 Success Metrics

- **User Growth**: 10,000 registered users in 3 months
- **Engagement**: 40% monthly active user rate
- **Revenue**: ₹50,000 monthly recurring revenue
- **Job Success**: 500+ successful job placements
- **Platform Adoption**: 100+ companies using the platform

## 🛡 Security & Compliance

- JWT token-based authentication with secure password hashing
- Environment variable protection for sensitive keys
- SQL injection prevention with parameterized queries
- CORS and rate limiting for API protection
- Blockchain transaction verification for payment security

## 📞 Contact & Support

**Developer**: S. Harshitha  
**LinkedIn**: https://www.linkedin.com/in/s-harshitha-1aa69a258/  
**Assessment**: RizeOS Core Team Internship  

---

**Built with ❤️ for the RizeOS Core Team Internship Assessment**

This project demonstrates full-stack development capabilities, Web3 integration expertise, AI implementation skills, and product thinking required for the RizeOS Core Team role.
