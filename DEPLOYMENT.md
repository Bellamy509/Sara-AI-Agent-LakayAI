# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/lakay-ai)

## Manual Deployment Steps

### 1. Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Environment variables configured

### 2. Environment Variables
Set the following environment variables in your Vercel dashboard:

```bash
# Choose one of the following:
OPENAI_API_KEY=your_openai_api_key_here
# OR
NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=your_copilot_cloud_api_key_here

# Add other environment variables as needed
NODE_ENV=production
```

### 3. Build Configuration
The project is already configured with:
- `vercel.json` for deployment optimization
- `next.config.ts` with Vercel-specific optimizations
- `.vercelignore` to exclude unnecessary files

### 4. Deploy Commands

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Via Git Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### 5. Build Optimization Features

- **Bundle Analysis**: Run `npm run build:analyze` to analyze bundle size
- **Production Build**: Run `npm run build:production` for optimized production builds
- **Image Optimization**: Configured for remote image patterns
- **Static Optimization**: Enabled for better performance
- **Security Headers**: Added security headers for production

### 6. Performance Monitoring

After deployment, monitor your application:
- Check Vercel Analytics
- Monitor build times
- Review function execution times
- Check Core Web Vitals

### 7. Troubleshooting

Common issues and solutions:

#### Build Failures
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Review build logs in Vercel dashboard

#### Function Timeouts
- API routes are configured with 30s timeout
- Consider using Edge Runtime for faster cold starts
- Optimize database queries and external API calls

#### Memory Issues
- Monitor function memory usage
- Consider upgrading Vercel plan if needed
- Optimize large dependencies

### 8. Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable SSL (automatic with Vercel)

### 9. Monitoring and Alerts

Set up monitoring:
- Vercel Analytics for performance insights
- Uptime monitoring with external services
- Error tracking with Sentry or similar tools

## Advanced Configuration

### Edge Runtime
For API routes that need faster cold starts, consider using Edge Runtime:

```typescript
export const runtime = 'edge';
```

### Incremental Static Regeneration (ISR)
For pages that benefit from ISR:

```typescript
export const revalidate = 60; // Revalidate every 60 seconds
```

### Environment-Specific Builds
Different configurations for different environments can be managed through environment variables and conditional logic in `next.config.ts`. 