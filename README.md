# Kings & Queen Marketplace

A React + Vite starter marketplace prepared for the Kings & Queen project.

## Included
- Responsive marketplace homepage and product catalogue
- Search and category filters
- Shopping cart
- Customer sign-up and sign-in using Supabase Auth
- Vendor store application (submitted as pending)
- Bank-transfer checkout display
- Sample products when the database has no approved products
- Netlify-ready Vite build configuration

## Important setup
1. Create a file named `.env` in the project root.
2. Copy the values from `.env.example` into `.env`.
3. Replace the placeholders with your Supabase Project URL and Publishable/Anon key.
4. Install dependencies with `npm install`.
5. Run locally with `npm run dev`.
6. Build for deployment with `npm run build`. The deploy folder is `dist`.

Do not put a Supabase service-role key in this website or upload `.env` to GitHub.

## Supabase notes
This starter expects tables named `Products`, `Stores`, and `Orders`, matching the names used in the project setup. The exact column names and Row Level Security policies must match your Supabase schema before live sign-up, vendor applications, product retrieval, and orders can work. The checkout insert is a starter example; verify the `Orders` table columns and connect order items before accepting real customer payments.

The product query expects an `status` column with value `approved` and common product fields such as `name`, `price`, `category`, `description`, and `image_url`. Adjust `src/App.jsx` if your actual columns differ.

## Payments
Bank-transfer details are displayed at checkout. Payment verification is manual. Paystack has not been integrated yet. Confirm that the account details are correct before making the site public.

## GitHub / Netlify
Upload the project files and folders to the root of your GitHub repository (not just the ZIP file). In Netlify, import the GitHub repository and set:
- Build command: `npm run build`
- Publish directory: `dist`

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Netlify environment variables before deploying.
