# The BLX Realty Platform

A premium real estate platform built with Next.js, featuring property listings, blog management, and admin functionality for The BLX Realty in Bangalore.

## 🏠 Features

- **Property Management**: Browse, search, and filter luxury properties
- **Blog System**: Content management with admin interface
- **User Authentication**: Secure login/signup with NextAuth.js
- **Admin Dashboard**: Property and blog management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Database Integration**: PostgreSQL with Prisma ORM
- **Image Upload**: Cloudinary integration for property images
- **Email Services**: Contact forms and notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   cd client
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/theblxrealty"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # Email (optional)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database (optional)
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
theblxrealty/
├── client/                 # Next.js application
│   ├── app/               # App Router pages
│   │   ├── api/           # API routes
│   │   ├── admin/         # Admin dashboard
│   │   ├── properties/    # Property pages
│   │   └── blog/          # Blog pages
│   ├── components/        # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── ...            # Feature components
│   ├── lib/               # Utility functions
│   ├── prisma/            # Database schema & migrations
│   └── public/            # Static assets
├── vercel.json            # Deployment configuration
└── README.md              # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```

### Database Management

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Create new migration
npx prisma migrate dev --name migration-name
```

## 🔐 Admin Access

1. **Create Admin User**
   ```bash
   # Run the admin creation script
   npx tsx scripts/create-admin.ts
   ```

2. **Admin Features**
   - Login with admin credentials via the normal sign-in modal
   - Access "Add Property" and "Add Blog" features from the header
   - Manage properties and blog posts through dedicated pages

## 🎨 Customization

### Styling
- **Tailwind CSS**: Main styling framework
- **Custom fonts**: Tiempos Headline (serif), Suisse Intl (sans-serif)
- **Color scheme**: Navy blue (#011337) and red (#ef4444)

### Branding
- Update logo files in `/public/`
- Modify company information in components
- Customize color scheme in `tailwind.config.ts`

## 📱 Features Overview

### Property Management
- Property listings with images, details, and location
- Advanced search and filtering
- Property categories (luxury villas, flats, commercial, etc.)
- Save properties functionality
- Property view requests

### Blog System
- Create and manage blog posts
- Rich text editor
- Category and tag system
- SEO optimization

### User Features
- User registration and authentication
- Profile management
- Saved properties
- Contact forms

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL in `.env.local`
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Image upload issues**
   - Verify Cloudinary credentials
   - Check CLOUDINARY_* environment variables

3. **Authentication problems**
   - Ensure NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain

### Getting Help

- Check the [Issues](../../issues) page
- Review the [Documentation](../../wiki)
- Contact the development team

## 📄 License

This project is proprietary software owned by The BLX Realty.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For technical support or questions:
- Email: discoverblr@theblxrealtyrealty.com
- Phone: +91 9743264328
- Office: 59, 10th A Cross Road, West of Chord Road, Bangalore, Karnataka 560086

---

**Built with ❤️ for The BLX Realty**
