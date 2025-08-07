# Davie Ecommerce Web App

A full-featured, visually stunning ecommerce web application built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🎯 Features

### Public Storefront
- **Modern Design**: Clean, responsive design with custom color scheme
- **Product Catalog**: Browse products with filtering and search
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add/remove items with real-time updates
- **Checkout Process**: Streamlined checkout with multiple payment options
- **Responsive Design**: Mobile-first approach for all devices

### Admin Panel
- **Secure Authentication**: Protected admin routes with NextAuth
- **Dashboard**: Overview of sales, orders, and analytics
- **Product Management**: CRUD operations for products
- **Order Management**: View and manage customer orders
- **Offer Management**: Create and manage promotional offers
- **User Management**: Admin user management (optional)

## 🎨 Design System

### Color Palette
- **Primary**: #1E3A8A (Royal Blue) - Navbar, buttons, headers
- **Accent**: #06B6D4 (Vibrant Teal) - Icons, CTAs, badges
- **Background**: #F4F4F5 (Light Gray) - General background
- **Text**: #1F2937 (Charcoal Gray) - Default text
- **Success**: #10B981 (Neon Green) - Success states, discounts
- **Sky Blue**: #38BDF8 - Offers and notices

### UI Components
- Rounded corners (rounded-xl)
- Soft shadows (shadow-md/lg)
- Smooth transitions
- Modern typography (Inter font)
- Responsive grid layouts

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Prisma + SQLite
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd davie-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   ```

4. **Initialize the database**
   ```bash
   # Set environment variable and push schema
   $env:DATABASE_URL="file:./dev.db"; npx prisma db push
   
   # Seed the database with sample data
   $env:DATABASE_URL="file:./dev.db"; npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

### Demo Credentials
- **Email**: admin@davie.com
- **Password**: admin123

### Access Admin Panel
1. Go to `/admin/login`
2. Enter the credentials above
3. Access the dashboard at `/admin/dashboard`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   └── offers/        # Offer management
│   ├── products/          # Public product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── contact/           # Contact page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── product/          # Product-related components
│   ├── admin/            # Admin-specific components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── auth/             # Authentication setup
│   └── db/               # Database client
└── types/                # TypeScript type definitions
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database with sample data

## 🎯 Key Features Implementation

### Phase 1: Public Storefront MVP ✅
- [x] Responsive navigation with search
- [x] Hero section with call-to-action
- [x] Featured products carousel
- [x] Best sellers section
- [x] Product cards with hover effects
- [x] Shopping cart functionality
- [x] Checkout process
- [x] Contact page

### Phase 2: Admin Panel ✅
- [x] Secure admin authentication
- [x] Admin dashboard with statistics
- [x] Product management interface
- [x] Order management system
- [x] Protected admin routes
- [x] Admin-only navigation

### Phase 3: Advanced Features (Future)
- [ ] Product filtering and search
- [ ] Discount management
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] M-PESA integration
- [ ] Role-based access control

## 🎨 Customization

### Colors
Update the color scheme in `src/app/globals.css`:
```css
:root {
  --primary: 30 58 138; /* #1E3A8A */
  --accent: 6 182 212;  /* #06B6D4 */
  /* ... other colors */
}
```

### Components
All components are built with shadcn/ui and can be customized by modifying the component files in `src/components/ui/`.

## 🔒 Security Features

- **Protected Routes**: Admin routes are protected with middleware
- **Authentication**: Secure login with bcrypt password hashing
- **Session Management**: JWT-based sessions with NextAuth
- **Input Validation**: Form validation with Zod schemas

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Use the Next.js template
- **Docker**: Use the official Next.js Docker image

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: info@davie.com

---

**Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS**
