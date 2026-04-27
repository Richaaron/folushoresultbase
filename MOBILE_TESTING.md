# Mobile Testing Guide

## Quick Start Testing

### 1. Desktop Browser Testing (Easiest)

#### Chrome/Edge
```
1. Start your app: npm run dev
2. Open: http://localhost:5173
3. Press: Ctrl+Shift+M (Windows) or Cmd+Shift+M (Mac)
4. Select device from dropdown (iPhone 12, iPad, etc.)
```

#### Firefox
```
1. Start your app: npm run dev
2. Open: http://localhost:5173
3. Press: Ctrl+Shift+M (Windows) or Cmd+Shift+M (Mac)
4. Test at different screen sizes
```

#### Safari (Mac only)
```
1. Start your app: npm run dev
2. Open: http://localhost:5173
3. Develop menu → Enter Responsive Design Mode
```

### 2. Real Device Testing

#### For iPhone/iPad:
```
1. Get your computer's local IP: ipconfig getifaddr en0
2. On your phone, visit: http://<IP>:5173
3. Test all pages and interactions
```

#### For Android:
```
1. Get your computer's local IP: ipconfig getifaddr en0
2. On your Android phone, visit: http://<IP>:5173
3. Test all pages and interactions
```

### 3. What to Test

#### Login Page
- [ ] Select different roles (Admin, Teacher, Parent)
- [ ] Form is easy to fill on small screen
- [ ] Buttons are tappable (not tiny)
- [ ] Text is readable

#### Admin Dashboard (Mobile)
- [ ] Hamburger menu appears
- [ ] Menu opens/closes smoothly
- [ ] Navigation links are clickable
- [ ] Main content is readable
- [ ] No horizontal scrolling (except tables)

#### Teacher Dashboard (Mobile)
- [ ] Hamburger menu works
- [ ] Can navigate to all sections
- [ ] Record results form is usable
- [ ] Attendance tracking works

#### Parent Dashboard (Mobile)
- [ ] Children list displays well
- [ ] Can select children
- [ ] Results show clearly
- [ ] Attendance section scrolls
- [ ] PDF download works

#### Broadsheet Page (Mobile)
- [ ] Filters are accessible
- [ ] Table scrolls horizontally
- [ ] Rankings display correctly
- [ ] Print button works

### 4. Device Simulation Sizes

Test at these breakpoints:
```
Small Mobile:  320px  (iPhone SE, old phones)
Standard Mobile: 375px  (iPhone 12, 13)
Large Mobile:  425px  (iPhone 12 Pro Max)
Tablet:        768px  (iPad, Tab)
Desktop:       1024px+ (Laptops, desktops)
```

### 5. Interaction Testing

#### Touch Interactions
- [ ] Can tap all buttons without accidentally tapping neighbors
- [ ] Swipe navigation works (if implemented)
- [ ] Scrolling is smooth
- [ ] Forms are easy to fill

#### Orientation Testing
- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] Content reflows correctly
- [ ] No content hidden

#### Performance Testing
- [ ] Page loads quickly (< 3 seconds)
- [ ] No lag when scrolling
- [ ] Animations are smooth
- [ ] No memory leaks (use DevTools)

### 6. Browser-Specific Testing

#### iOS Safari
```
1. iPhone model: iPhone 12, 13, 14, 15
2. iOS version: 16+
3. Things to check:
   - Status bar display
   - Safe area handling
   - Touch keyboard behavior
```

#### Android Chrome
```
1. Device: Any Android 8+
2. Browser: Chrome, Samsung Internet
3. Things to check:
   - Safe area handling
   - System navigation buttons
   - Keyboard behavior
```

#### iOS Chrome
```
1. iPhone: Latest models
2. Issues to watch:
   - Font rendering
   - Video playback
   - Keyboard behavior
```

### 7. Common Mobile Issues Checklist

- [ ] Text is not too small (minimum 16px for body)
- [ ] Buttons are minimum 44×44px
- [ ] Touch targets have spacing between them
- [ ] No horizontal scrolling (except tables)
- [ ] Forms don't require excessive scrolling
- [ ] Modals don't cover important content
- [ ] Colors have good contrast
- [ ] Links are clearly distinguishable
- [ ] Images load on mobile networks
- [ ] No pop-ups blocking interaction

### 8. Performance Metrics

Use browser DevTools:

#### Lighthouse Score (Chrome)
```
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Generate mobile report
4. Aim for:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 80
```

#### Network Testing
```
1. DevTools → Network tab
2. Throttle to 4G/3G
3. Check:
   - Page load time < 3s
   - Total size < 1MB
   - No excessive requests
```

#### Memory Testing
```
1. DevTools → Memory tab
2. Take heap snapshot
3. Look for:
   - No memory leaks
   - Reasonable memory use (< 50MB)
```

### 9. Accessibility Testing

- [ ] Can navigate with keyboard only
- [ ] Screen reader friendly (VoiceOver on iOS, TalkBack on Android)
- [ ] Color blindness - test with accessibility tools
- [ ] High contrast mode works
- [ ] Text can be zoomed up to 200%

### 10. Test Cases by User Role

#### Admin on Mobile
```
1. Login as admin
2. Navigate menu → Open/close smoothly?
3. View students → List displays well?
4. View subjects → Can edit/delete?
5. View teachers → Easy to manage?
6. Broadsheet → Table scrolls horizontally?
7. Settings → Form is fillable?
8. Logout → Works correctly?
```

#### Teacher on Mobile
```
1. Login as teacher
2. View dashboard → Stats display?
3. Record results → Can enter scores?
4. Release results → Can toggle?
5. Attendance → Checkboxes work?
6. Broadsheet → Can view rankings?
7. Settings → Can update password?
8. Logout → Works correctly?
```

#### Parent on Mobile
```
1. Login as parent
2. Select child → Easy to tap?
3. View results → Readable format?
4. Filter by term/year → Works smoothly?
5. View attendance → Scrolls well?
6. Download PDF → File generates?
7. Contact school → Button appears?
8. Logout → Works correctly?
```

### 11. Bug Report Template

If you find an issue:

```
Device: [iPhone 12 / Samsung Galaxy S21 / etc.]
OS: [iOS 16 / Android 12 / etc.]
Browser: [Safari / Chrome / etc.]
Screen Size: [375px / 768px / etc.]

Issue: [What doesn't work?]

Expected: [What should happen?]

Actual: [What actually happens?]

Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Screenshots: [Include if possible]
```

### 12. Automated Testing (Optional)

To set up automated mobile testing:

```bash
# Install Playwright for E2E testing
npm install -D @playwright/test

# Create test file: e2e/mobile.spec.ts
# Test across different devices automatically
```

### 13. Before Going Live

Checklist before deployment:

- [ ] Tested on iPhone (iOS)
- [ ] Tested on Android device
- [ ] Tested on tablet
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Images scale properly
- [ ] Forms work smoothly
- [ ] Navigation is intuitive
- [ ] No broken layouts
- [ ] Performance is acceptable
- [ ] Accessibility features work
- [ ] PDFs generate correctly
- [ ] External links open properly
- [ ] Push notifications (if any) work

### 14. Continuous Testing Strategy

After launch:

1. **Weekly**: Test on latest devices
2. **Monthly**: Check performance metrics
3. **Quarterly**: Update browser versions
4. **As-needed**: Test with new OS versions

### 15. Useful Browser Extensions

- Mobile Simulator Pro (Chrome)
- Responsive Viewer (Chrome)
- XScope (Chrome/Firefox)
- Responsively App (Standalone tool)

### 16. Quick Testing Workflow

```bash
# Terminal 1: Start dev server
cd frontend-react
npm run dev

# Terminal 2: Open in browser
# Desktop: http://localhost:5173
# Mobile: http://<your-ip>:5173

# DevTools (F12)
# Press Ctrl+Shift+M for mobile view
# Select device from dropdown
# Test all interactions
```

### 17. Known Mobile Considerations

1. **Touch Events**: May be slower than mouse
2. **Network**: Mobile networks can be slower
3. **Battery**: Animations affect battery life
4. **Bandwidth**: Keep images optimized
5. **Orientation**: Support both portrait & landscape
6. **Keyboard**: Mobile keyboard takes up screen space

### 18. Success Criteria

Your app is mobile-ready when:

✅ Works on all major devices
✅ No console errors
✅ Navigation is intuitive
✅ Forms are fillable easily
✅ Tables scroll appropriately
✅ Performance is good (< 3s load)
✅ Accessibility works
✅ All features functional
✅ Layout doesn't break
✅ User testing positive feedback

---

**Quick Start**: 
```bash
npm run dev
# Then Ctrl+Shift+M in browser to test
```

**Last Updated**: April 2025
**Status**: Ready for testing ✅
