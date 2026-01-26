# 🚀 Investor Showcase: Manual Testing Checklist

## 1. 🔐 Authentication & Roles
- [ ] **Login as Farmer**: Verify successful login with a farmer account.
- [ ] **Login as Buyer**: Verify successful login with a buyer account (use a separate browser/incognito window).
- [ ] **Session Persistence**: Refresh the page and ensure you stay logged in.

## 2. 💬 Real-time Negotiation Chat
**Pre-requisite**: Open Farmer and Buyer accounts in two side-by-side windows.
- [ ] **Send Message**: Send a text from Buyer to Farmer. Verify instant appearance on Farmer's screen.
- [ ] **Receive Message**: Reply from Farmer. Verify instant appearance on Buyer's screen.
- [ ] **Typing Indicators**: Type in one window (without sending) and check if "Partner is typing..." appears in the other window.
- [ ] **Online Status**: Check if the green "Online" dot is visible near the user's name.
- [ ] **Message History**: Refresh the page and ensure previous status/messages persist.
- [ ] **Mobile Responsiveness**: Resize the browser to mobile width and ensure the chat interface looks good.

## 3. 🤖 AI Features (The "Wow" Factor)
- [ ] **AI Suggestions**: Click the "Get Advise" (Sparkle) button in the chat.
- [ ] **Response Quality**: strict check that the AI suggests relevant negotiation responses based on the context.
- [ ] **Fast Application**: Click a suggestion chips and ensure it populates the input field.

## 4. 📞 Voice & Video Communication
- [ ] **Initiate Call**: Click the Phone icon from one user.
- [ ] **Incoming Alert**: Verify the other user sees the "Incoming Call" popup with ringtone/sound.
- [ ] **Accept Call**: Answer the call and verify `"Connected"` status.
- [ ] **Audio Check**: Speak and ensure audio is heard on the other end (test Mute/Unmute button).
- [ ] **End Call**: Hang up and ensure the call screen closes for *both* users.

## 5. 🔔 Notifications & Alerts
- [ ] **Toast Notifications**: When on a different page (or dashboard), have the other user send a message. Verify a toast notification appears.
- [ ] **Sound Effects**: Verify distinct sounds for:
    - [ ] Incoming Text Message
    - [ ] Incoming Call Ringtone
- [ ] **Browser Permissions**: Ensure Microphone and Notification permissions are handled gracefully (no crashes if denied).

## 6. 📍 Logistics (If enabled in UI)
- [ ] **Real-time Location**: If you have a map view, verify that location updates (simulated or real) are reflecting on the socket connection.

## 7. 🛠️ System Reliability (The "Pull the Plug" Test)
- [ ] **Disconnect Test**: Turn off your internet (or kill the server terminal) and verify the app shows "Disconnected" or handles it gracefully without crashing.
- [ ] **Reconnection**: Turn internet back on and verify the socket automatically reconnects (`🟢 SocketProvider: Connected`).
