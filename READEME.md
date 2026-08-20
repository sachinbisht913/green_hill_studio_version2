Green Hill Studio

A modern wedding photography studio website built with React, Vite,
and Supabase.

Features

Responsive photography studio website

Home, About, Gallery, Collections, Testimonials, and Booking
sections

Category-based photo gallery

Admin dashboard for gallery management

Admin authentication

Upload, update, and delete gallery images

Gallery categories:

Wedding

Mehndi

Pre-Wedding

Engagement / Ring Ceremony

Birthday

Naming Ceremony

Janeu

Retirement

Party

Photoshoot

Other

Client-side image optimization

Large image resizing

WebP conversion before upload

Lazy loading

Responsive images with srcSet and sizes

Supabase Storage for photographs

Supabase PostgreSQL for gallery metadata

Tech Stack

React

Vite

JavaScript

CSS3

Supabase

PostgreSQL

Supabase Storage

Supabase Authentication

Git / GitHub

Project Structure

greenhillstudio/
├── public/
├── src/
│   ├── components/
│   ├── services/
│   │   └── gallery.js
│   ├── lib/
│   │   └── supabase.js
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── migrations/
├── package.json
├── vite.config.js
└── README.md

Getting Started

1. Clone the repository

git clone https://github.com/sachinbisht913/green_hill_studio_version2.git
cd green_hill_studio_version2

2. Install dependencies

npm install

3. Configure Supabase

Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Never commit .env or a Supabase service-role key to GitHub.

4. Start the development server

npm run dev

The application normally runs at:

http://localhost:5173

Gallery Upload

Gallery uploads follow this flow:

Select Image
    ↓
Client-side Optimization
    ↓
Resize Large Images
    ↓
Convert to WebP
    ↓
Upload to Supabase Storage
    ↓
Create Public URL
    ↓
Save Metadata in PostgreSQL

The gallery uses the Supabase Storage bucket:

gallery-images

and the database table:

gallery_images

Performance Optimization

The gallery is optimized using:

Lazy loading for images

Async image decoding

Responsive srcSet

sizes attributes

Priority loading for initial images

Explicit image dimensions

WebP conversion for uploaded images

Browser caching through long cache-control headers

These techniques reduce image transfer size and improve the perceived
loading speed of the gallery.

Supabase

Supabase is used for:

Authentication

PostgreSQL database

Gallery metadata

Image storage

Database migrations are stored in:

supabase/migrations/

Build for Production

npm run build

Preview the production build:

npm run preview

Deployment

The project can be deployed to platforms such as:

Vercel

Netlify

Render

When deploying, configure the Supabase environment variables in the
hosting provider.

GitHub

Repository:

https://github.com/sachinbisht913/green_hill_studio_version2

Future Improvements

Lightbox image viewer

Bulk image upload

Infinite scrolling

Advanced gallery search

Automatic thumbnail generation

Client-specific photo galleries

Booking integration

SEO improvements

Analytics dashboard

Author

Sachin Bisht

Green Hill Studio --- Photography Portfolio & Gallery Management Website

License

This project is intended for the Green Hill Studio website and
portfolio.