# Flowwa - Rewards Hub 🎯

A comprehensive rewards and gamification platform built with Next.js that allows users to earn points, maintain streaks, refer friends, and redeem rewards. The application features a modern dashboard with engaging animations and real-time updates.

## ✨ Features

### Core Functionality

- **Points System**: Earn and spend points through various activities
- **Daily Streaks**: Maintain daily check-ins to build streaks and earn bonus rewards
- **Referral Program**: Invite friends and earn rewards for successful referrals
- **Reward Redemption**: Browse and redeem various rewards using earned points
- **User Profiles**: Comprehensive user management with authentication
- **Reward History**: Track all earned and redeemed rewards

### UI/UX Features

- **Responsive Design**: Fully responsive interface built with Tailwind CSS
- **Modern Components**: Custom UI components built with Radix UI primitives
- **Smooth Animations**: Enhanced user experience with GSAP animations
- **Dark/Light Theme Support**: Adaptive theming capabilities
- **Intuitive Navigation**: Sidebar navigation with user-friendly layout

### Technical Features

- **Real-time Updates**: Live data synchronization with Supabase
- **State Management**: Efficient state handling with TanStack Query
- **TypeScript**: Full type safety throughout the application
- **Authentication**: Secure user authentication with Supabase Auth
- **Database**: PostgreSQL with Supabase for data persistence

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16.1](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [GSAP 3.14](https://gsap.com/)
- **State Management**: [TanStack Query 5.90](https://tanstack.com/query/latest)

### Backend & Database

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint](https://eslint.org/) with Next.js config
- **Type Checking**: TypeScript compiler
- **Build Tool**: Next.js built-in bundler

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm/yarn
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd reward-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the Supabase migrations:

   ```bash
   # If using Supabase CLI
   supabase db reset
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
reward-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   │   └── login/         # Login page
│   │   ├── rewards/           # Main rewards dashboard
│   │   │   ├── _components/   # Rewards-specific components
│   │   │   ├── _hooks/        # Custom hooks for rewards logic
│   │   │   └── _types/        # Type definitions
│   │   ├── _hooks/            # Global custom hooks
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── navigation/        # Navigation components
│   │   └── ui/                # Base UI components
│   ├── lib/                   # Utility functions and configurations
│   │   ├── profile/           # Profile management utilities
│   │   ├── query/             # TanStack Query setup
│   │   ├── rewards/           # Rewards business logic
│   │   ├── supabase/          # Supabase client configuration
│   │   └── utils.ts           # General utilities
│   └── types/                 # Global type definitions
├── supabase/                  # Supabase configuration and migrations
│   ├── migrations/            # Database migrations
│   └── config.toml            # Supabase configuration
├── public/                    # Static assets
└── package.json               # Dependencies and scripts
```

## 🎮 Usage

### For Users

1. **Sign Up/Login**: Create an account or log in to access the rewards dashboard
2. **Daily Check-ins**: Visit daily to maintain your streak and earn bonus points
3. **Earn Points**: Complete various activities to accumulate points
4. **Browse Rewards**: Explore available rewards in the rewards grid
5. **Redeem Rewards**: Use your points to claim rewards
6. **Refer Friends**: Share your referral link to earn additional points
7. **Track Progress**: Monitor your reward history and point balance

### For Developers

1. **Component Development**: Add new reward components in `src/app/rewards/_components/`
2. **Hook Creation**: Create custom hooks in the respective `_hooks/` directories
3. **Database Changes**: Add new migrations in `supabase/migrations/`
4. **Type Definitions**: Update types in `src/types/` or component-specific `types.ts` files

## 🔧 Development Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
```

## 📊 Database Schema

The application uses several key tables:

- **profiles**: User information and points balance
- **reward_definitions**: Available rewards and their requirements
- **user_rewards**: Track redeemed rewards
- **featured_tools**: Tools that users can claim for points
- **user_tool_claims**: Track claimed tools
- **referrals**: Referral system data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support and questions:

- Check the documentation in each component's README
- Review the TypeScript types for API contracts
- Examine the Supabase migrations for database schema

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
```

---

Built with ❤️ using Next.js, TypeScript, and Supabase.
