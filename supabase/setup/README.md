# Set up the replacement Supabase and Vercel projects

These instructions target a new, empty Supabase database for this checkout.
The SQL files are prepared locally; they have not been run against your hosted project.

## Updating the existing website (fabric wording and reviews)

If your database is already set up, run **`04_product_reviews_update.sql`** once
in its Supabase SQL Editor. It combines migrations 0008 and 0009; it is the update
for an existing installation. Deploy the matching application changes afterward.
The complete unified initialization file below is for a new database.

Migration 0008 removes only matching original sample names/descriptions and the
sample fabric FAQ. It leaves your manually entered fabric details, care
instructions and edited descriptions intact. Historical product/collection URLs
remain valid. Fresh sample content also uses neutral names and empty descriptions.

Migration 0009 enables real 1-5 star ratings and written feedback. Anyone can
read reviews for published products; signed-in accounts can post one review per
product, edit it or remove it. Names come from the account profile, without
exposing email addresses. Product cards show the actual average and count;
empty products have no invented reviews or ratings. Feedback is paginated.
Reviews appear immediately and are not marked as verified purchases.

## 1. Initialize Supabase

Open the **new** Supabase project, open **SQL Editor**, create a query, paste the
entire contents of [`../unified_migrations.sql`](../unified_migrations.sql), and run it once as the dashboard's
`postgres` role. It creates:

- All 18 application tables and their relationships.
- Row Level Security and the application's access policies.
- The public `media` storage bucket and admin upload/delete policies.
- The signup trigger that creates customer profiles.
- Contact messages and all four article-detail columns.
- Explicit API grants, including protection against customers changing their role.
- The starter categories, collections, products, deals and FAQs from migration 0004.
- Product reviews and the view that calculates product rating summaries.

The script runs in a transaction and stops if any application table already
exists. Do not run the individual schema/policy migrations again after this
bundle. It combines all nine migrations, 0001 through 0009, in numeric order,
including 0004 starter content. It does not create Supabase CLI migration-history rows.
If you later adopt `supabase db push`, reconcile the applied migration history
first; otherwise the CLI will try to create the policies again.

Check that the Data API is enabled and `public` is an exposed schema in the new
project's API settings. Tables need both SQL grants and RLS policies; the bundle
sets both. See [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api).

The unified file already includes `../migrations/0004_seed.sql`; run it once.
Its starter content contains demo prices, stock, promotional claims, and store
policies; review them before publishing. It does not upload product photographs.
In particular, its online-payment FAQ is demo copy: this checkout's online
payment provider is still a stub.

For a schema-only setup without demo content, the earlier `01_initialize.sql`
remains available as an alternative. Choose one initialization file; running
both against the same project will stop at the existing-table guard.

## 2. Configure Vercel and local development

Connect the Vercel project to your replacement Git repository under **Settings >
Git**, or import that repository into your new Vercel project. Select your actual
production branch. Use these build settings:

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Root directory | The directory containing package.json (`.` for this checkout) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Leave the framework default |

Repository connections are described in [Vercel's GitHub guide](https://vercel.com/docs/git/vercel-for-github).

Set these exact variable names in **Vercel > Settings > Environment Variables**
for Production. Add them to Preview/Development if those environments should use
this Supabase project too. Use keys and URL from the same **new** Supabase project:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_NEW_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_NEW_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVER_KEY
```

The app's existing variable names accept a public publishable key
(`sb_publishable_...`) and a server secret key (`sb_secret_...`) respectively.
Enabled legacy `anon` and `service_role` keys also work. Keep the server key in
the server-only variable above. The app needs it for guest checkout, coupon
validation, contact submissions and the admin Customers page.
See [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys).

Create/update local `.env.local` with the same three variables if you develop
locally. `.env.example` and the root README still reference the **old** project
URL (`rklgjlxgnbtulnbdacwy`); replace that URL when copying their examples.
The app reads no `DATABASE_URL` or extra `NEXT_PUBLIC_SITE_URL` variable.

After saving the variables, trigger a **new deployment**. Environment changes
apply to new deployments, as explained in [Vercel's environment variable guide](https://vercel.com/docs/environment-variables).
Pushing the SQL files to Git does not apply them to Supabase automatically.

## 3. Configure Supabase Authentication

Under **Authentication > URL Configuration**:

- Set **Site URL** to your final HTTPS website origin, for example
  `https://YOUR_DOMAIN` or `https://YOUR_PROJECT.vercel.app`.
- Allow the production URLs used for authentication, such as your origin and
  `https://YOUR_DOMAIN/login`.
- For local testing, allow `http://localhost:3000/**`.
- If needed, allow your own Vercel preview URLs using the project/account-scoped
  patterns in the [redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls).

Enable the Email provider and allow new user signups. If email confirmation is
enabled, keep the signup template's standard `{{ .ConfirmationURL }}` link,
confirm the email, then sign in manually at `/login`. The current app does not
implement an `/auth/confirm` or code-exchange callback, and its signup UI redirects
immediately even when email verification is still pending. Do not point an email
template at a callback route that does not exist.

For **Email Templates > Reset Password**, the existing form expects a numeric
recovery code. Include `{{ .Token }}` in the email body, for example:

```html
<h2>Reset your Zarnigaar password</h2>
<p>Enter this code on the password reset form:</p>
<p><strong>{{ .Token }}</strong></p>
<p>If you did not request a reset, ignore this email.</p>
```

Configure custom SMTP for customer signup/recovery emails. Supabase's default
mail service is restricted and is unsuitable for production customer delivery.
See [SMTP configuration](https://supabase.com/docs/guides/auth/auth-smtp) and
[email template variables](https://supabase.com/docs/guides/auth/auth-email-templates).
Keep OTP expiration and rate limits enabled. Auth URLs, email templates, SMTP,
Vercel variables and Git connections are dashboard settings, not application SQL.

## 4. Create your administrator

Create your own account at the deployed site's `/login`, or through Supabase
**Authentication > Users**. Complete email verification if required.

Open `02_create_admin.sql`, change the `admin_email` declaration to your actual
account email, and run the entire file in the new project's SQL Editor. It sets
both `profiles.role` and `admin_users` membership. Creating the database schema
does not recreate users or passwords from your previous Supabase project.

Sign out, sign in again, and visit `/admin`. Add real categories/products,
upload images and publish products with status `active`. Uploading uses the
`media` bucket; the existing Next.js image configuration permits public storage
URLs on standard `*.supabase.co` project hosts.

## 5. Verify the new project

Run `03_verify.sql` after initialization and admin setup. The comments describe
the expected result of each query.
Then check the deployed site with real user roles:

- Sign up, confirm email, sign in and complete password recovery.
- As an admin, create a draft product with the four detail fields, upload a photo,
  publish it, and check its product page; upload a deal image too.
- As a customer, save a wishlist item and place a Cash on Delivery order. Confirm
  the order appears in that customer's account and in the admin Orders page.
- Send a contact message and verify that `contact_messages` receives a row.
- Check that a customer cannot open `/admin` or write admin content.

Two existing app behaviors need code changes rather than setup queries:

1. Guest checkout can create an order, but the confirmation page reads it with a
   user-scoped client. Guest orders have no owner, so RLS hides them and the page
   can return 404. Do not grant public access to customer orders to fix this;
   use a private confirmation mechanism in the application.
2. Online payments are a placeholder that throws until a real payment gateway is
   implemented. Cash on Delivery is the implemented payment method.

The new database starts empty. Restoring old customer accounts, inventory,
orders, and Storage files is a separate data migration. This setup script does
not migrate them or rewrite old absolute image URLs.

Regenerate the SQL bundles after editing migrations with
`node scripts/build-supabase-setup.mjs`.
