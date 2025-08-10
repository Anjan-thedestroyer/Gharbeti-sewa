import fs from 'fs';

const baseUrl = 'https://gharbeti-sewa.com';

const urls = [
    '/',
    '/gharbeti',
    '/login',
    '/register',
    '/unverified',
    '/verify-email',
    '/list-buyer',
    '/privacy',
    '/terms',
    '/reset-password',
    '/forgot-password',
    '/verification-otp',
    '/list-freelancer',
    '/accepted-work',
    '/task-req',
    '/hostel',
    '/control-hostel'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(url => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
`)
        .join('')}
</urlset>
`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log('✅ Sitemap generated in public/sitemap.xml');
