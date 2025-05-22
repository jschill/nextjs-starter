# nextjs-starter

## Mininal:ish Next.js starter using
 - [Next.js](https://nextjs.org/) 15.x
 - [Supabase](https://supabase.com/) auth
 - [Postgres](https://www.postgresql.org/) (via Supabase to be able to join in auth tables)
 - [Drizzle ORM](https://orm.drizzle.team/)
 - UI: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Tailwind](https://tailwindcss.com/)
 - [Zod](https://zod.dev/), [react-hook-form](https://react-hook-form.com/)
 - [zustand](https://github.com/pmndrs/zustand) state managment
 - [Stripe](https://stripe.com/) subscriptions
 - Server actions preferred over API which has its pros and cons.

## What's the special sauce?
 - Organizations with a many-to-many relationship to the users with roles
    - Admin
    - Member
  - SaaS infused where organizations can subscribe on different tiers

## Requirements
 - Stripe account
 - Supabase account
 - Create products with re-accuring payments, and use its `lookup_key` to fetch them from the code

## What is missing/TODO
 - A way for users to update/remove subscriptions
 - Better README :-) and installation instructions
 - .env description
 - RBAC
 - Implement activity logging, similar to the one in Vercel's saas starter.


This project was inspired by the [Next.js saas starter](https://github.com/nextjs/saas-starter), but i did not
want to deal with auth myself and i needed organizations to work a little different than their teams for my use case.

Need support? My company, [jschill](https://knub.be), can help.
