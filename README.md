# DAVIETECH - Your One-Stop Tech Hub

A full-featured, production-ready ecommerce web application for technology products, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components — now fully wired to a real database, protected admin APIs, and real-time updates.

## 🎯 Features

### Public Storefront
- **Modern Design**: Clean, responsive design (Poppins/Inter) and compact grids
- **Dynamic Catalog**: Products come from Prisma DB (no mock data)
- **Powerful Search/Filters**: Navbar search + products-page filters
- **Was/Now Pricing**: Discounted items show red strikethrough “Was” + green “Now”
- **Real‑time Updates (SSE)**: Offers/Banners auto-refresh via `/api/updates/stream`
- **Banner Carousel**: Single-slide, full-width, 5s auto-advance with crossfade
- **Shopping Cart**: LocalStorage-backed cart with `CartProvider`
- **Checkout**: Clean “Customer Details” modal (guest checkout supported)
- **Responsive Design**: Mobile-first with compact components

### Admin Panel
- **Secure Authentication**: NextAuth with role checks (ADMIN-only mutations)
- **Dashboard (Live Stats)**: `/api/admin/stats` for totals + 30‑day deltas; live via SSE
- **Products**: Full CRUD via `/api/products`
- **Offers**: Link selected products; discounts applied/reverted automatically
- **Banners**: Full CRUD; public banner carousel updates instantly
- **Orders**: Admin GET/PUT/DELETE with safe number formatting on UI
- **Real‑time Broadcasts**: Offers/Banners/Products/Stats trigger SSE events

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
- **Authentication**: NextAuth.js (JWT sessions; role-based)
- **Realtime**: Server-Sent Events (SSE)
- **Payments**: M‑Pesa Daraja (STK Push + callbacks)
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

    # Optional: M‑Pesa (Daraja) — required to test STK
    DARAJA_CONSUMER_KEY="your-consumer-key"
    DARAJA_CONSUMER_SECRET="your-consumer-secret"
    MPESA_SHORTCODE="174379"                  # sandbox or your shortcode
    MPESA_PASSKEY="your-lipa-na-mpesa-passkey"
    MPESA_CALLBACK_URL="http://localhost:3000/api/payments/mpesa/callback"
   ```

4. **Initialize the database**
   ```bash
   # Apply migrations and generate client
   npx prisma migrate dev --name init
   npx prisma generate

   # If drift or errors occur
   # npx prisma migrate reset --force
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

### Demo Credentials (example)
- **Email**: admin@davietech.com
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
├── lib/                  # Utilities
│   ├── auth/             # NextAuth config
│   └── mpesa.ts          # Daraja helpers (STK/Auth)
└── types/                # TypeScript type definitions
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema (alt)
- `npm run db:seed` - Seed (if you add seed data)

## 🎯 Current Status

### Completed
- [x] Real product data via Prisma (no mock data)
- [x] Admin-protected APIs (products, offers, banners, orders)
- [x] Offers link products and apply discounts (Was/Now pricing)
- [x] Banner carousel with 5s crossfade loop
- [x] SSE real-time updates (offers/banners/products/stats)
- [x] Admin dashboard stats with 30‑day changes + recent orders
- [x] LocalStorage cart + `CartProvider`
- [x] Customer signup/login (separate from admin)
- [x] Compact, responsive product grids; search/filters wired

### In Progress / Next
- [ ] M‑Pesa live configuration and production callback URLs
- [ ] Advanced analytics and email notifications
- [ ] More payment options

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

## 🔒 Security & Access Control

- **Protected Admin APIs**: Role checks via NextAuth session/JWT
- **Authentication**: Secure login with bcrypt password hashing
- **Session Management**: JWT-based sessions with NextAuth
- **Input Validation**: Form validation with Zod (areas)

## 🔌 API Overview

- `GET /api/products` — List products (supports filters such as `featured`, `bestSeller`, `take`)
- `GET /api/products/[id]` — Get product
- `GET/POST /api/offers` — Public list; ADMIN create (links `productIds` and applies discounts)
- `GET/PUT/DELETE /api/offers/[id]` — Public read; ADMIN update/delete (updates linked products)
- `GET/POST /api/banners` — Public list; ADMIN create
- `GET/PUT/DELETE /api/banners/[id]` — Public read; ADMIN update/delete
- `GET /api/orders` — ADMIN only
- `GET/PUT/DELETE /api/orders/[id]` — ADMIN only
- `GET /api/admin/stats` — ADMIN only (dashboard totals, deltas, recent orders)
- `GET /api/updates/stream` — Server-Sent Events stream (offers/banners/products/stats)
- `POST /api/auth/register` — Customer signup
- `POST /api/payments/mpesa/stk` — Initiate M‑Pesa STK Push
- `POST /api/payments/mpesa/callback` — STK callback URL
- `POST /api/payments/mpesa/c2b/register|validation|confirmation` — C2B endpoints (optional)
- `POST /api/payments/mpesa/transaction-status` — Transaction status query

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
- Contact: info@davietech.com

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, Prisma, and SSE**
