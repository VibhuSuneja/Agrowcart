# 🧪 AgrowCart - Complete Testing Checklist

**Version:** 1.0  
**Last Updated:** 2026-02-03  
**Website:** https://agrowcart.com

---

## 📋 How to Use This Checklist

- ✅ = Pass
- ❌ = Fail (Note the issue)
- ⏳ = In Progress / Blocked
- N/A = Not Applicable

---

# 🔐 1. AUTHENTICATION (All Users)

## 1.1 Registration
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.1.1 | Register with Email | Go to `/register`, fill form, submit | Account created, redirected to login |done |
| 1.1.2 | Register with Google | Click "Continue with Google" | OAuth flow completes, account created |done |
| 1.1.3 | Terms & Conditions | Register without accepting T&C | Should show error, cannot proceed |done |
| 1.1.4 | Duplicate Email | Register with existing email | Should show "Email already exists" |done |
| 1.1.5 | Invalid Email Format | Enter invalid email format | Should show validation error |done |
| 1.1.6 | Weak Password | Enter password < 6 chars | Should show password strength error |done |

## 1.2 Login
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.2.1 | Login with Email | Go to `/login`, enter credentials | Logged in, redirected to dashboard |done |
| 1.2.2 | Login with Google | Click "Continue with Google" | OAuth flow completes, logged in |done |
| 1.2.3 | Wrong Password | Enter wrong password | Should show "Invalid credentials" |done |
| 1.2.4 | Non-existent Email | Enter unregistered email | Should show appropriate error |done |
| 1.2.5 | Session Persistence | Login, close tab, reopen | Should remain logged in |done |
| 1.2.6 | Logout | Click logout button | Session cleared, redirected to home |done |

---

# 👤 2. REGULAR USER (Customer)

## 2.1 Homepage & Navigation
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1.1 | Homepage Load | Visit `/` | Page loads with products, navigation |done |
| 2.1.2 | Navigation Menu | Click all nav links | All pages load correctly |done |
| 2.1.3 | Responsive Design | Test on mobile viewport | Layout adapts properly |done |
| 2.1.4 | Google Translate | Use language selector | Content translates |done |

## 2.2 Marketplace & Products
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.2.1 | Browse Marketplace | Go to `/marketplace` | Products displayed with images/prices |done |
| 2.2.2 | Category Filter | Click a category | Products filter by category |done |
| 2.2.3 | Product Details | Click on a product | `/product/[id]` shows full details |done |
| 2.2.4 | Product Images | View product images | Images load, zoom works |done |
| 2.2.5 | Price Display | Check product prices | Prices shown in ₹ correctly |done |
| 2.2.6 | Stock Status | View out-of-stock item | Should show "Out of Stock" |done |

## 2.3 Cart & Checkout
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.3.1 | Add to Cart | Click "Add to Cart" | Product added, cart count updates |done |
| 2.3.2 | View Cart | Go to `/user/cart` | All cart items displayed |done |
| 2.3.3 | Update Quantity | Change item quantity | Total recalculates |done |
| 2.3.4 | Remove from Cart | Click remove button | Item removed, total updates |done |
| 2.3.5 | Empty Cart | Remove all items | Shows "Cart is empty" message |done |
| 2.3.6 | Proceed to Checkout | Click checkout button | Redirects to `/user/checkout` |done |

## 2.4 Checkout & Payment
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.4.1 | Address Form | Fill delivery address | Form validates, accepts input |done|
| 2.4.2 | Location Detection | Click "Use My Location" | GPS coordinates captured |done|
| 2.4.3 | COD Payment | Select "Cash on Delivery" | Order placed successfully |done|
| 2.4.4 | Online Payment | Select "Pay Online" | Razorpay modal opens |done|
| 2.4.5 | Payment Success | Complete payment | Redirected to success page |done|
| 2.4.6 | Payment Failure | Cancel/fail payment | Error handled gracefully |done|
| 2.4.7 | Order Confirmation | After successful order | Order ID shown, email sent |done|

## 2.5 My Orders
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.5.1 | View Orders | Go to `/user/my-orders` | All orders listed |done|
| 2.5.2 | Order Status | Check order status | Shows pending/out for delivery/delivered |done|
| 2.5.3 | Order Details | Click on an order | Shows items, address, payment info |done|
| 2.5.4 | Track Order Button | Click "Track Order" | Redirects to tracking page |done|

## 2.6 Order Tracking (⭐ CRITICAL)
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.6.1 | Map Display | Open tracking page | Map loads with markers |done |
| 2.6.2 | Marker Legend | Check below map | Legend shows Delivery Partner (green) & Your Location (blue) |done |
| 2.6.3 | Live Location | Wait for updates | Delivery boy marker moves in real-time |done |
| 2.6.4 | Recenter Button | Click "Recenter View" | Map recenters on markers |done |
| 2.6.5 | Delivery OTP | When driver arrives | OTP displayed on screen |done |
| 2.6.6 | Chat with Driver | Type and send message | Message appears in chat |done |
| 2.6.7 | Receive Message | Driver sends message | Message appears instantly |done |
| 2.6.8 | AI Suggest (No Messages) | Click "AI Suggest" before any chat | Shows starter suggestions |not working properly |
| 2.6.9 | AI Suggest (With Messages) | Click "AI Suggest" after chat | Shows contextual suggestions |not working properly |
| 2.6.10 | Use Suggestion | Click a suggestion | Text fills in message input |not working properly |

## 2.7 Community Forum
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.7.1 | Browse Forum | Go to `/community` | Threads displayed |done |
| 2.7.2 | Create Thread | Click "New Thread", fill form | Thread created |done |
| 2.7.3 | Reply to Thread | Open thread, add reply | Reply posted |done |
| 2.7.4 | AI Forum Assist | Ask farm-related question | AI provides helpful answer |checking as daily credits vanished |

## 2.8 Recipes
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.8.1 | Browse Recipes | Go to `/recipes` | Recipe cards displayed |done |
| 2.8.2 | View Recipe | Click a recipe | Full recipe with ingredients, steps |done but audio note not able to listen |
| 2.8.3 | AI Recipe Suggestion | On product page, click recipe | AI generates recipe for that millet | checking as daily credits vanished    |

## 2.9 AI Features
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.9.1 | AI Chatbot | Click chat widget | Chatbot responds to queries |checking as daily credits vanished |
| 2.9.2 | Crop Doctor | Upload crop image | AI analyzes and provides diagnosis |done , need to add sample checker name rather than vibhu also close button not working and back button needed|
| 2.9.3 | Agricultural News | Check news section | AI-generated news displayed |done |

---

# 🚚 3. DELIVERY PARTNER

## 3.1 Dashboard
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1.1 | Dashboard Load | Login as delivery boy | Dashboard loads with stats |yes, but have to refresh again and again to see stats |
| 3.1.2 | Earning Display | Check earnings card | Today's earnings shown | done|
| 3.1.3 | Go Online | Click "Go Online" | Status changes, ready for orders |working |
| 3.1.4 | Check New | Click "Check New" | Refreshes assignment list | working|

## 3.2 Order Assignments (⭐ CRITICAL)
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.2.1 | Receive Assignment | Wait for broadcast | New assignment appears with toast | yes, but no toast notification|
| 3.2.2 | Accept Assignment | Click "Accept" | Assignment accepted, shows on map | yes working|
| 3.2.3 | Accept when Busy | Accept while having active order | Shows "already assigned to other order" error | yes working|
| 3.2.4 | Reject Assignment | Click "Reject" | Assignment removed from list | yes working|
| 3.2.5 | Expired Assignment | Try to accept stale order | Shows "assignment expired" error | not checked yet|

## 3.3 Active Delivery
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.3.1 | Map with Route | Accept order | Map shows user location and route | yes working|
| 3.3.2 | Delivery Address | Check address section | Full address displayed |yes |
| 3.3.3 | Chat with Customer | Send message | Message delivered to customer |yes |
| 3.3.4 | Receive Message | Customer sends message | Message appears instantly |yes|
| 3.3.5 | AI Suggest (Delivery Boy) | Click "AI Suggest" | Shows delivery-relevant suggestions | ai credits over for today check later|

## 3.4 Delivery Completion (⭐ CRITICAL)
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.4.1 | Arrived at Location | Click "Arrived at Location" | OTP input appears | yes|
| 3.4.2 | Enter Wrong OTP | Enter incorrect OTP | Shows "Incorrect OTP" error | yes|
| 3.4.3 | Enter Correct OTP | Enter customer's OTP | Shows "Delivery Successful!" |yes |
| 3.4.4 | Map Clears | After successful delivery | Map disappears, returns to dashboard | yes|
| 3.4.5 | Accept New Order | After completing delivery | Can accept new order without error | yes|
| 3.4.6 | Earnings Update | After delivery | Earnings reflect new delivery | yes but have to refresh|

---

# 🛠️ 4. ADMIN

## 4.1 Dashboard Access
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1.1 | Admin Login | Login as admin | Redirected to admin dashboard | yes|
| 4.1.2 | Unauthorized Access | Non-admin visits `/admin` | Redirected to unauthorized page |yes |

## 4.2 Product Management
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.2.1 | View Products | Go to `/admin/view-products` | All products listed | yes|
| 4.2.2 | Add Product | Go to `/admin/add-product`, fill form | Product created, redirects |done |
| 4.2.3 | Edit Product | Click edit on a product | Form pre-filled, can update | yes|
| 4.2.4 | Delete Product | Click delete | Product removed |yes |
| 4.2.5 | Upload Image | Upload product image | Image uploads to Cloudinary |**FIXED - Check server console for detailed logs** |

## 4.3 Order Management
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.3.1 | View Orders | Go to `/admin/manage-orders` | All orders listed |yes |
| 4.3.2 | Assign Delivery | Click "Assign Delivery" | Broadcasts to nearby delivery boys |i click on out of delivery and it will brodcasted to nearby delivery boys no assign delivery is there  |
| 4.3.3 | Order Status | Check order statuses | Shows correct status for each | working|
| 4.3.4 | **Cancel Order** | Change order status to "cancelled" | **Stock automatically returned, delivery boy notified** | **NEW - TEST REQUIRED** |

---

# 🌾 5. FARMER / SHG DASHBOARD

## 5.1 Dashboard Features
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 5.1.1 | Dashboard Load | Login as farmer | Dashboard loads | true |
| 5.1.2 | **Crop Analysis** | Go to farmer dashboard, upload crop photo in "AI Quality Inspector" section | **AI analyzes crop and shows health, grade, issues** | **FIXED - TEST REQUIRED** |
| 5.1.3 | **Market Prices** | View farmer dashboard | **Live millet prices from APMCs displayed in "Today's Millet Rates" widget** | **FIXED - TEST REQUIRED** |
| 5.1.4 | AI Farming Advice | Ask farming question | AI provides advice | chatbot is there but i dont understand what u are saying|

---

# 🔧 6. TECHNICAL & PERFORMANCE

## 6.1 Real-time Features
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.1.1 | Socket Connection | Open app | Socket connects (check console) |yes |
| 6.1.2 | Live Chat | Send message | Received in < 1 second |yes |
| 6.1.3 | Location Updates | Move device (delivery) | Location updates on customer map |yes |
| 6.1.4 | Order Notifications | Assign order | Delivery boy receives toast |no toast notification |

## 6.2 Error Handling
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.2.1 | **Network Offline** | Disable network, perform action | **Red banner "No Internet Connection" appears at top** | **FIXED - TEST REQUIRED** |
| 6.2.2 | Invalid Route | Visit `/random-page` | 404 page displayed |yes |
| 6.2.3 | API Timeout | Slow network | Loading states show, no crash |yes |

## 6.3 Security
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.3.1 | Protected Routes | Visit `/user/*` without login | Redirected to login |yes |
| 6.3.2 | Admin Routes | Non-admin visits admin pages | Access denied |yes |
| 6.3.3 | API Auth | Call API without session | Returns 401 Unauthorized |i dont understand |

---

# 📱 7. MOBILE RESPONSIVENESS

| # | Test Case | Device | Status |
|---|-----------|--------|--------|
| 7.1 | Homepage | iPhone 14 |yes |
| 7.2 | Marketplace | iPhone 14 |yes |
| 7.3 | Product Detail | iPhone 14 | yes|
| 7.4 | Cart | iPhone 14 |yes |
| 7.5 | Checkout | iPhone 14 |done |yes
| 7.6 | Order Tracking | iPhone 14 |yes |
| 7.7 | Delivery Dashboard | iPhone 14 | |
| 7.8 | Chat Interface | iPhone 14 | |

---

# 🐛 Bug Report Template

```
**Bug ID:** BUG-XXX
**Date Found:** 
**Severity:** Critical / High / Medium / Low
**Test Case #:** 
**Description:** 
**Steps to Reproduce:**
1. 
2. 
3. 
**Expected Result:** 
**Actual Result:** 
**Screenshot/Video:** 
**Browser/Device:** 
```

---

## ✅ Testing Sign-off

| Role | Tester Name | Date | Status |
|------|-------------|------|--------|
| User Flow | | | |
| Delivery Flow | | | |
| Admin Flow | | | |
| Mobile Testing | | | |

---


**Document Maintained By:** AgrowCart Engineering Team

---

# 🆕 8. NEW FEATURES TO TEST

## 8.1 Account Management
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.1.1 | **Delete Account** | Open mobile menu → Scroll down → Click "Delete My Account" | Confirmation prompt appears, account deleted on confirm | **NEW - TEST REQUIRED** |
| 8.1.2 | **Delete Account with Active Orders** | Try to delete account with pending orders | Error: "Cannot delete account with active orders" | **NEW - TEST REQUIRED** |

## 8.2 Crop Doctor Updates
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.2.1 | **Close Button Fix** | Upload image in Crop Doctor → Click ✕ button | Image preview disappears | **FIXED - TEST REQUIRED** |
| 8.2.2 | **Verification Label** | Analyze crop | Shows "Analysis Verified By: AgrowCart AI Specialist • Cluster-01-Haryana" at bottom | **FIXED - TEST REQUIRED** |

## 8.3 User Order Cancellation
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.3.1 | **View Cancelled Order** | Go to My Orders after admin cancels | Order shows red "Order Cancelled" badge | **NEW - TEST REQUIRED** |
| 8.3.2 | **Cancelled Order Details** | View cancelled order details | Delivery info hidden, red status throughout | **NEW - TEST REQUIRED** |

## 8.4 Delivery Partner Updates
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.4.1 | **Cancellation Notification** | Admin cancels order assigned to delivery boy | Delivery boy gets toast: "Order #XXXXXX has been cancelled" | **NEW - TEST REQUIRED** |
| 8.4.2 | **Dashboard Auto-Refresh** | Order cancelled | Dashboard updates automatically without manual refresh | **NEW - TEST REQUIRED** |

---

# ✅ INSTRUCTIONS FOR TESTING NEW FEATURES

## 1. Crop Analysis (Farmer Dashboard)
- Login as farmer → Scroll to **"Crop Quality Analysis"** section (blue gradient card)
- Upload crop image → Click **"Analyze Quality"** → Verify results displayed

## 2. Market Prices (Farmer Dashboard)
- Login as farmer → Look for **"Today's Millet Rates"** green card
- Click refresh icon → Verify prices update

## 3. Network Offline
- Turn off Wi-Fi/Mobile data → Observe **red banner at top**
- Turn back on → Observe success toast **"Back online!"**

## 4. Account Deletion
- Login → Open hamburger menu (mobile) → Scroll to bottom
- Click **"Delete My Account"** → Confirm

## 5. Order Cancellation Flow
- **Admin**: Cancel an order → Check stock increased
- **User**: Check order page → Should see red "Cancelled" badge
- **Delivery Boy**: Should receive toast notification

## 6. Cloudinary Upload Debug
- Admin: Try to add product with image
- Check server console for detailed Cloudinary logs
- Look for **"Cloudinary: Upload successful"** or error messages

---
