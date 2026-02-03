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
| 1.1.1 | Register with Email | Go to `/register`, fill form, submit | Account created, redirected to login | |
| 1.1.2 | Register with Google | Click "Continue with Google" | OAuth flow completes, account created | |
| 1.1.3 | Terms & Conditions | Register without accepting T&C | Should show error, cannot proceed | |
| 1.1.4 | Duplicate Email | Register with existing email | Should show "Email already exists" | |
| 1.1.5 | Invalid Email Format | Enter invalid email format | Should show validation error | |
| 1.1.6 | Weak Password | Enter password < 6 chars | Should show password strength error | |

## 1.2 Login
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.2.1 | Login with Email | Go to `/login`, enter credentials | Logged in, redirected to dashboard | |
| 1.2.2 | Login with Google | Click "Continue with Google" | OAuth flow completes, logged in | |
| 1.2.3 | Wrong Password | Enter wrong password | Should show "Invalid credentials" | |
| 1.2.4 | Non-existent Email | Enter unregistered email | Should show appropriate error | |
| 1.2.5 | Session Persistence | Login, close tab, reopen | Should remain logged in | |
| 1.2.6 | Logout | Click logout button | Session cleared, redirected to home | |

---

# 👤 2. REGULAR USER (Customer)

## 2.1 Homepage & Navigation
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1.1 | Homepage Load | Visit `/` | Page loads with products, navigation | |
| 2.1.2 | Navigation Menu | Click all nav links | All pages load correctly | |
| 2.1.3 | Responsive Design | Test on mobile viewport | Layout adapts properly | |
| 2.1.4 | Google Translate | Use language selector | Content translates | |

## 2.2 Marketplace & Products
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.2.1 | Browse Marketplace | Go to `/marketplace` | Products displayed with images/prices | |
| 2.2.2 | Category Filter | Click a category | Products filter by category | |
| 2.2.3 | Product Details | Click on a product | `/product/[id]` shows full details | |
| 2.2.4 | Product Images | View product images | Images load, zoom works | |
| 2.2.5 | Price Display | Check product prices | Prices shown in ₹ correctly | |
| 2.2.6 | Stock Status | View out-of-stock item | Should show "Out of Stock" | |

## 2.3 Cart & Checkout
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.3.1 | Add to Cart | Click "Add to Cart" | Product added, cart count updates | |
| 2.3.2 | View Cart | Go to `/user/cart` | All cart items displayed | |
| 2.3.3 | Update Quantity | Change item quantity | Total recalculates | |
| 2.3.4 | Remove from Cart | Click remove button | Item removed, total updates | |
| 2.3.5 | Empty Cart | Remove all items | Shows "Cart is empty" message | |
| 2.3.6 | Proceed to Checkout | Click checkout button | Redirects to `/user/checkout` | |

## 2.4 Checkout & Payment
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.4.1 | Address Form | Fill delivery address | Form validates, accepts input | |
| 2.4.2 | Location Detection | Click "Use My Location" | GPS coordinates captured | |
| 2.4.3 | COD Payment | Select "Cash on Delivery" | Order placed successfully | |
| 2.4.4 | Online Payment | Select "Pay Online" | Razorpay modal opens | |
| 2.4.5 | Payment Success | Complete payment | Redirected to success page | |
| 2.4.6 | Payment Failure | Cancel/fail payment | Error handled gracefully | |
| 2.4.7 | Order Confirmation | After successful order | Order ID shown, email sent | |

## 2.5 My Orders
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.5.1 | View Orders | Go to `/user/my-orders` | All orders listed | |
| 2.5.2 | Order Status | Check order status | Shows pending/out for delivery/delivered | |
| 2.5.3 | Order Details | Click on an order | Shows items, address, payment info | |
| 2.5.4 | Track Order Button | Click "Track Order" | Redirects to tracking page | |

## 2.6 Order Tracking (⭐ CRITICAL)
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.6.1 | Map Display | Open tracking page | Map loads with markers | |
| 2.6.2 | Marker Legend | Check below map | Legend shows Delivery Partner (green) & Your Location (blue) | |
| 2.6.3 | Live Location | Wait for updates | Delivery boy marker moves in real-time | |
| 2.6.4 | Recenter Button | Click "Recenter View" | Map recenters on markers | |
| 2.6.5 | Delivery OTP | When driver arrives | OTP displayed on screen | |
| 2.6.6 | Chat with Driver | Type and send message | Message appears in chat | |
| 2.6.7 | Receive Message | Driver sends message | Message appears instantly | |
| 2.6.8 | AI Suggest (No Messages) | Click "AI Suggest" before any chat | Shows starter suggestions | |
| 2.6.9 | AI Suggest (With Messages) | Click "AI Suggest" after chat | Shows contextual suggestions | |
| 2.6.10 | Use Suggestion | Click a suggestion | Text fills in message input | |

## 2.7 Community Forum
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.7.1 | Browse Forum | Go to `/community` | Threads displayed | |
| 2.7.2 | Create Thread | Click "New Thread", fill form | Thread created | |
| 2.7.3 | Reply to Thread | Open thread, add reply | Reply posted | |
| 2.7.4 | AI Forum Assist | Ask farm-related question | AI provides helpful answer | |

## 2.8 Recipes
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.8.1 | Browse Recipes | Go to `/recipes` | Recipe cards displayed | |
| 2.8.2 | View Recipe | Click a recipe | Full recipe with ingredients, steps | |
| 2.8.3 | AI Recipe Suggestion | On product page, click recipe | AI generates recipe for that millet | |

## 2.9 AI Features
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.9.1 | AI Chatbot | Click chat widget | Chatbot responds to queries | |
| 2.9.2 | Crop Doctor | Upload crop image | AI analyzes and provides diagnosis | |
| 2.9.3 | Agricultural News | Check news section | AI-generated news displayed | |

---

# 🚚 3. DELIVERY PARTNER

## 3.1 Dashboard
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1.1 | Dashboard Load | Login as delivery boy | Dashboard loads with stats | |
| 3.1.2 | Earning Display | Check earnings card | Today's earnings shown | |
| 3.1.3 | Go Online | Click "Go Online" | Status changes, ready for orders | |
| 3.1.4 | Check New | Click "Check New" | Refreshes assignment list | |

## 3.2 Order Assignments (⭐ CRITICAL)
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.2.1 | Receive Assignment | Wait for broadcast | New assignment appears with toast | |
| 3.2.2 | Accept Assignment | Click "Accept" | Assignment accepted, shows on map | |
| 3.2.3 | Accept when Busy | Accept while having active order | Shows "already assigned to other order" error | |
| 3.2.4 | Reject Assignment | Click "Reject" | Assignment removed from list | |
| 3.2.5 | Expired Assignment | Try to accept stale order | Shows "assignment expired" error | |

## 3.3 Active Delivery
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.3.1 | Map with Route | Accept order | Map shows user location and route | |
| 3.3.2 | Delivery Address | Check address section | Full address displayed | |
| 3.3.3 | Chat with Customer | Send message | Message delivered to customer | |
| 3.3.4 | Receive Message | Customer sends message | Message appears instantly | |
| 3.3.5 | AI Suggest (Delivery Boy) | Click "AI Suggest" | Shows delivery-relevant suggestions | |

## 3.4 Delivery Completion (⭐ CRITICAL)
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.4.1 | Arrived at Location | Click "Arrived at Location" | OTP input appears | |
| 3.4.2 | Enter Wrong OTP | Enter incorrect OTP | Shows "Incorrect OTP" error | |
| 3.4.3 | Enter Correct OTP | Enter customer's OTP | Shows "Delivery Successful!" | |
| 3.4.4 | Map Clears | After successful delivery | Map disappears, returns to dashboard | |
| 3.4.5 | Accept New Order | After completing delivery | Can accept new order without error | |
| 3.4.6 | Earnings Update | After delivery | Earnings reflect new delivery | |

---

# 🛠️ 4. ADMIN

## 4.1 Dashboard Access
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1.1 | Admin Login | Login as admin | Redirected to admin dashboard | |
| 4.1.2 | Unauthorized Access | Non-admin visits `/admin` | Redirected to unauthorized page | |

## 4.2 Product Management
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.2.1 | View Products | Go to `/admin/view-products` | All products listed | |
| 4.2.2 | Add Product | Go to `/admin/add-product`, fill form | Product created | |
| 4.2.3 | Edit Product | Click edit on a product | Form pre-filled, can update | |
| 4.2.4 | Delete Product | Click delete | Product removed | |
| 4.2.5 | Upload Image | Upload product image | Image uploads to Cloudinary | |

## 4.3 Order Management
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.3.1 | View Orders | Go to `/admin/manage-orders` | All orders listed | |
| 4.3.2 | Assign Delivery | Click "Assign Delivery" | Broadcasts to nearby delivery boys | |
| 4.3.3 | Order Status | Check order statuses | Shows correct status for each | |

---

# 🌾 5. FARMER / SHG DASHBOARD

## 5.1 Dashboard Features
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 5.1.1 | Dashboard Load | Login as farmer | Dashboard loads | |
| 5.1.2 | Crop Analysis | Upload crop photo | AI analyzes quality | |
| 5.1.3 | Market Prices | View market prices | Current millet prices shown | |
| 5.1.4 | AI Farming Advice | Ask farming question | AI provides advice | |

---

# 🔧 6. TECHNICAL & PERFORMANCE

## 6.1 Real-time Features
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.1.1 | Socket Connection | Open app | Socket connects (check console) | |
| 6.1.2 | Live Chat | Send message | Received in < 1 second | |
| 6.1.3 | Location Updates | Move device (delivery) | Location updates on customer map | |
| 6.1.4 | Order Notifications | Assign order | Delivery boy receives toast | |

## 6.2 Error Handling
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.2.1 | Network Offline | Disable network, perform action | Graceful error message | |
| 6.2.2 | Invalid Route | Visit `/random-page` | 404 page displayed | |
| 6.2.3 | API Timeout | Slow network | Loading states show, no crash | |

## 6.3 Security
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.3.1 | Protected Routes | Visit `/user/*` without login | Redirected to login | |
| 6.3.2 | Admin Routes | Non-admin visits admin pages | Access denied | |
| 6.3.3 | API Auth | Call API without session | Returns 401 Unauthorized | |

---

# 📱 7. MOBILE RESPONSIVENESS

| # | Test Case | Device | Status |
|---|-----------|--------|--------|
| 7.1 | Homepage | iPhone 14 | |
| 7.2 | Marketplace | iPhone 14 | |
| 7.3 | Product Detail | iPhone 14 | |
| 7.4 | Cart | iPhone 14 | |
| 7.5 | Checkout | iPhone 14 | |
| 7.6 | Order Tracking | iPhone 14 | |
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
