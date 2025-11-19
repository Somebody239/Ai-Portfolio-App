# Setup Instructions

## Simple Steps to Run the App (using pnpm)

### Step 1: Install pnpm (if not already installed)
```bash
npm install -g pnpm
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Start Development Server
```bash
pnpm dev
```

### Step 4: Open Browser
Visit: http://localhost:3000

That's it! The app should be running with mock data displaying on the dashboard.

## What You'll See

- Dashboard with GPA calculation (3.75 based on mock courses)
- SAT score display (1480)
- University targets with risk analysis (Safety/Target/Reach/High Reach)
- AI recommendations panel
- Standardized testing breakdown
- Extracurricular insights

## Next Steps (Optional)

1. **Connect to Supabase**: Add `.env.local` with your Supabase credentials
2. **Replace Mock Data**: Update `DashboardView.tsx` to fetch real data from Supabase
3. **Add Authentication**: Implement Supabase Auth for user management

