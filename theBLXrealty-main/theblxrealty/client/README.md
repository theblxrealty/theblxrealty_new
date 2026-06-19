# The BLX Realty- Premium Real Estate Platform

A comprehensive real estate website built with Next.js 15, featuring property listings, admin dashboard, blog management, contact forms, and email notifications. Designed for luxury property management with modern UI/UX.

## 🚀 Features

### ✅ Core Features
- **Property Management**: Complete CRUD operations for property listings
- **Admin Dashboard**: Full-featured admin interface with multiple management tabs
- **Property Listings**: Advanced search, filtering, and categorization
- **Blog System**: Content management with newsletter integration
- **Contact Forms**: Property view requests, contact inquiries, career applications
- **User Authentication**: JWT-based auth for users and admins
- **Email Notifications**: Automated email system for all form submissions
- **Image Management**: Property banner and gallery image support
- **Database Integration**: PostgreSQL with Prisma ORM
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS

### 🎯 Property Categories
- **Luxury Villas**: Premium residential properties
- **Flats/Apartments**: Modern apartment complexes
- **New Buildings**: Recently constructed properties
- **Farm Houses**: Rural and agricultural properties
- **Sites/Plots**: Development land and plots
- **Commercial**: Business and commercial properties
- **Investment**: Investment-focused properties

### 📱 Admin Dashboard Features
- **Properties Tab**: Add, edit, view, and manage property listings
- **Blog Posts Tab**: Create and manage blog content
- **View Requests Tab**: Manage property viewing requests
- **Contact Requests Tab**: Handle contact form submissions
- **User Management**: Admin registration and authentication
- **Image Upload**: Property banner and gallery image management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt
- **Email**: Nodemailer with Gmail SMTP
- **Image Storage**: Supabase Storage (optional)
- **Maps**: Google Maps API integration
- **Deployment**: Vercel-ready

## 📦 Installation & Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd client
pnpm install
```

### 2. Environment Variables
Create `.env.local` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration (Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google Maps API (Optional)
GOOGLE_MAPS_API="your-google-maps-api-key"
NEXT_PUBLIC_GOOGLE_MAPS_API="your-google-maps-api-key"

# Supabase Configuration (Optional - for image storage)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 3. Database Setup
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Seed database with sample data
pnpm db:seed

# (Optional) Open Prisma Studio
pnpm db:studio
```

### 4. Start Development Server
```bash
pnpm dev
```

## 🔐 Admin Setup & Management

### Admin Registration
1. **Via API** (Recommended):
```bash
curl -X POST http://localhost:3000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@The BLX Realty.com",
    "phone": "1234567890",
    "password": "secure-password",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

2. **Via Admin Dashboard**: Visit `/admin` and use the registration form

### Admin Login
- **URL**: `http://localhost:3000/admin`
- **Authentication**: JWT-based with secure token storage
- **Session**: Persistent login with localStorage

### Admin Dashboard Features

#### 🏠 Properties Management
- **Add Properties**: Complete form with all property details
- **Property Details**: Title, description, price, location, coordinates
- **Property Types**: House, Flat, Farm, Farmhouse
- **Specifications**: Bedrooms, bathrooms, area
- **Images**: Banner images and additional gallery images
- **Status**: Active/inactive property management

#### 📝 Blog Management
- **Create Posts**: Rich text editor for blog content
- **Categories**: Organize posts by categories
- **Publishing**: Draft and publish workflow
- **Newsletter**: Automatic newsletter distribution
- **SEO**: Slug-based URLs and meta descriptions

#### 📋 Request Management
- **Property View Requests**: Manage viewing appointments
- **Contact Requests**: Handle general inquiries
- **Career Applications**: Review job applications
- **Status Tracking**: Pending, approved, rejected statuses

#### 👥 User Management
- **Admin Accounts**: Create and manage admin users
- **User Registration**: Automatic user creation from forms
- **Authentication**: Secure JWT-based authentication

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (supports both users and admins)
- `POST /api/auth/admin/register` - Admin registration
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/admin/me` - Admin verification

### Property Management
- `GET /api/properties` - Get all properties (public)
- `GET /api/properties/[id]` - Get individual property
- `GET /api/admin/properties` - Get all properties (admin only)
- `POST /api/admin/properties` - Create new property (admin only)
- `POST /api/addprop` - Add property with image upload (admin only)

### Blog Management
- `GET /api/blog/posts` - Get published blog posts
- `GET /api/blog/posts/[slug]` - Get individual blog post
- `GET /api/admin/blog` - Get all blog posts (admin only)
- `POST /api/admin/blog` - Create blog post (admin only)
- `PUT /api/admin/blog/[id]` - Update blog post (admin only)
- `DELETE /api/admin/blog/[id]` - Delete blog post (admin only)

### Form Submissions
- `POST /api/property-view-request` - Submit property view request
- `POST /api/contact-request` - Submit contact form
- `POST /api/career-application` - Submit career application

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/send` - Send newsletter (admin only)

### Image Management
- `POST /api/upload-image` - Upload images to Supabase (admin only)

### System
- `GET /api/health` - Health check and environment status

## 🗄️ Database Schema

### Core Tables
- **`users`** - User accounts and profiles
- **`admins`** - Admin user management
- **`properties`** - Property listings with full details
- **`property_view_requests`** - Property viewing requests
- **`contact_requests`** - Contact form submissions
- **`career_applications`** - Job application submissions
- **`blog_posts`** - Blog content management
- **`newsletter_subscriptions`** - Newsletter subscribers

### Property Schema
```sql
properties {
  id: String (Primary Key)
  title: String
  description: String
  price: Float
  location: String
  latitude: Float
  longitude: Float
  propertyType: String
  propertyCategory: String
  bedrooms: Int
  bathrooms: Int
  area: Float
  propertyBanner1: String
  propertyBanner2: String
  additionalImages: String[]
  isActive: Boolean
  adminId: String (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🎯 Usage Guide

### For Website Visitors
1. **Browse Properties**: Visit `/properties` to see all listings
2. **Search & Filter**: Use search bar and filters to find specific properties
3. **Property Details**: Click on properties to view full details
4. **Request Viewing**: Fill out property view request forms
5. **Contact**: Use contact forms for general inquiries
6. **Blog**: Read blog posts for real estate insights

### For Admins
1. **Login**: Access admin dashboard at `/admin`
2. **Manage Properties**: Add, edit, and organize property listings
3. **Content Management**: Create and publish blog posts
4. **Handle Requests**: Review and respond to form submissions
5. **User Management**: Create additional admin accounts
6. **Monitor Activity**: Track all user interactions and submissions

### For Developers
1. **API Integration**: All endpoints are RESTful with comprehensive error handling
2. **Authentication**: JWT-based security for protected routes
3. **TypeScript**: Full type safety throughout the application
4. **Database**: Prisma ORM with type-safe database operations
5. **Testing**: Health check endpoint for system monitoring

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password (not your regular password)
3. Use the App Password as `EMAIL_PASS` in your `.env.local` file

### Email Templates
- **Property View Requests**: Detailed property and user information
- **Contact Requests**: Complete contact form data
- **Career Applications**: Resume and application details
- **Newsletter**: Blog post notifications with links

### Email Recipients
- All emails are sent to configured admin email addresses
- Automatic user creation when forms are submitted
- Confirmation emails sent to form submitters

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set up all environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Production Environment Variables
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
EMAIL_USER="your-production-email"
EMAIL_PASS="your-production-email-password"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
GOOGLE_MAPS_API="your-production-google-maps-key"
NEXT_PUBLIC_GOOGLE_MAPS_API="your-production-google-maps-key"
```

### Database Migration
```bash
# Run migrations in production
pnpm db:migrate

# Generate Prisma client
pnpm db:generate
```

## 🧪 Testing & Development

### API Testing
```bash
# Test admin registration
curl -X POST http://localhost:3000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","phone":"1234567890","password":"admin123","firstName":"Test","lastName":"Admin"}'

# Test property creation
curl -X POST http://localhost:3000/api/admin/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Property","price":500000,"location":"Test Location","propertyType":"house"}'

# Test health check
curl http://localhost:3000/api/health
```

### Development Scripts
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database with sample data
pnpm db:reset         # Reset database

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

## 🔧 Configuration

### Image Management
- **Local Storage**: Images stored in `/public/properties/` directory
- **Supabase Storage**: Optional cloud storage for production
- **Image Structure**: 
  - Banner images: `/properties/property-banner/property-{id}/`
  - Gallery images: `/properties/property-images/property-{id}/`

### Property Categories
The system supports multiple property categories:
- `luxury villas` - Premium residential properties
- `flats` - Apartment complexes
- `new buildings` - Recently constructed properties
- `farm house` - Rural properties
- `sites` - Development plots
- `commercial` - Business properties
- `investment` - Investment properties

### Search & Filtering
- **Text Search**: Title, location, description, property type
- **Category Filter**: Filter by property category
- **Bedroom Filter**: Filter by number of bedrooms
- **Pagination**: Configurable page size and navigation

## 🆘 Support & Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL is correct
2. **Email Not Working**: Check EMAIL_USER and EMAIL_PASS
3. **Admin Login Issues**: Verify JWT_SECRET is set
4. **Image Upload**: Check Supabase configuration if using cloud storage

### Health Check
Visit `/api/health` to check system status and environment configuration.

### Logs
- Development: Check console output
- Production: Monitor Vercel function logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏢 About The BLX Realty

The BLX Realtyis a premium real estate platform designed for luxury property management. The platform provides comprehensive tools for property listing, client management, and content marketing, making it ideal for real estate agencies and property developers.

---

**For technical support or questions, please contact the development team or create an issue in the repository.**