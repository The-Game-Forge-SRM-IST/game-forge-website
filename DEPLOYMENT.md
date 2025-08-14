# Deployment Guide

## Pre-deployment Checklist

### 1. Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint warnings addressed (`npm run lint`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Bundle analysis reviewed (`npm run build:analyze`)

### 2. Performance Requirements
- [ ] Desktop Lighthouse score ≥ 90
- [ ] Mobile Lighthouse score ≥ 70
- [ ] Accessibility score ≥ 95
- [ ] Core Web Vitals within thresholds:
  - [ ] FCP < 1.5s
  - [ ] LCP < 2.5s
  - [ ] CLS < 0.1
  - [ ] FID < 100ms

### 3. Functionality Testing
- [ ] All navigation links work
- [ ] Three.js canvas loads properly
- [ ] Forms validate correctly
- [ ] Images load with proper optimization
- [ ] Responsive design works on all breakpoints

### 4. Accessibility Testing
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility
- [ ] ARIA labels present
- [ ] Color contrast compliance
- [ ] Skip links available

### 5. Security
- [ ] Security headers configured
- [ ] No sensitive data in client bundle
- [ ] HTTPS enforced (production)
- [ ] CSP headers configured (if applicable)

## Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables to set:
# NODE_ENV=production
# NEXT_TELEMETRY_DISABLED=1
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: .next
# Environment variables:
# NODE_ENV=production
# NEXT_TELEMETRY_DISABLED=1
```

### Self-hosted (Docker)
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## Performance Optimization

### Bundle Size Optimization
- Three.js chunks are split separately
- Framer Motion is code-split
- Vendor libraries are bundled efficiently
- Static assets are compressed

### Image Optimization
- WebP and AVIF formats enabled
- Responsive image sizes configured
- Lazy loading implemented
- CDN-friendly caching headers

### Caching Strategy
- Static assets: 1 year cache
- API responses: 1 hour cache with stale-while-revalidate
- Images: Long-term caching with optimization

## Monitoring

### Performance Monitoring
```bash
# Run performance tests
npm run test:lighthouse

# Check bundle size
npm run build:analyze
```

### Error Monitoring
- Console errors are logged
- Three.js errors are caught with error boundaries
- Form validation errors are handled gracefully

## Post-deployment Verification

1. **Functionality Check**
   - [ ] All sections load correctly
   - [ ] Navigation works smoothly
   - [ ] Forms submit successfully
   - [ ] Three.js effects render properly

2. **Performance Check**
   - [ ] Run Lighthouse audit
   - [ ] Check Core Web Vitals
   - [ ] Verify mobile performance

3. **Accessibility Check**
   - [ ] Test with screen reader
   - [ ] Verify keyboard navigation
   - [ ] Check color contrast

4. **Cross-browser Testing**
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)
   - [ ] Mobile browsers

## Rollback Plan

If issues are detected post-deployment:

1. **Immediate Rollback**
   ```bash
   # Vercel
   vercel rollback [deployment-url]
   
   # Netlify
   # Use Netlify dashboard to rollback
   ```

2. **Fix and Redeploy**
   - Identify and fix the issue
   - Run full test suite
   - Deploy with confidence

## Environment Variables

Production environment should include:
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
SECURITY_HEADERS_ENABLED=true
WEBGL_ENABLED=true
PERFORMANCE_MODE=auto
```

## SSL/TLS Configuration

Ensure HTTPS is enforced:
- Certificate is valid and not expired
- HTTP redirects to HTTPS
- HSTS headers are set
- Mixed content warnings are resolved