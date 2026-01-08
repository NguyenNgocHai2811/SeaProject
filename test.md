# System Test Cases

This document contains System Test Cases for the Social Media Platform, covering all features that interact with the backend API.

**Note to Testers:**
- Please execute these test cases in the provided order where possible.
- Fill in the "Actual Results" and "Pass/Fail" columns during execution.
- Ensure the application is running and the database is initialized.

## 1. Authentication (Auth)

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| AUTH_001 | Verify User Registration with valid data | None | Name: Test User<br>Email: new@test.com<br>Password: Password123 | 1. Navigate to Registration page<br>2. Enter Name, Email, Password<br>3. Click Register | Account created, redirected to Login or Home | | |
| AUTH_002 | Verify User Registration with existing email | User with email exists | Email: existing@test.com | 1. Navigate to Registration page<br>2. Enter existing Email<br>3. Click Register | Error message displayed: "Email already exists" | | |
| AUTH_003 | Verify User Login with valid credentials | Registered User | Email: valid@test.com<br>Password: correctPass | 1. Navigate to Login page<br>2. Enter Email and Password<br>3. Click Login | User logged in, redirected to Newsfeed | | |
| AUTH_004 | Verify User Login with invalid credentials | None | Email: wrong@test.com<br>Password: wrongPass | 1. Navigate to Login page<br>2. Enter invalid Email/Password<br>3. Click Login | Error message displayed: "Invalid credentials" | | |

## 2. User Profile

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| USER_001 | View Own Profile | Logged in | None | 1. Click on User Avatar/Name in Header | Profile page loaded with correct user info and posts | | |
| USER_002 | View Other User's Profile | Logged in | Target User ID | 1. Click on a user's name in feed | Target user's profile loaded | | |
| USER_003 | Update Profile Info (Text) | Logged in | Bio: "New Bio"<br>Location: "Hanoi" | 1. Go to Profile > Edit Profile<br>2. Update Bio and Location<br>3. Save | Profile updated with new Bio and Location | | |
| USER_004 | Update Avatar | Logged in | Image: avatar.jpg | 1. Go to Profile > Edit Profile<br>2. Upload new Avatar<br>3. Save | Profile picture updated | | |
| USER_005 | Update Cover Photo | Logged in | Image: cover.jpg | 1. Go to Profile > Edit Profile<br>2. Upload new Cover Photo<br>3. Save | Cover photo updated | | |

## 3. Posts

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| POST_001 | Create Text Post | Logged in | Content: "Hello World" | 1. Click "Create Post"<br>2. Enter text<br>3. Submit | Post created and appears in feed | | |
| POST_002 | Create Image Post | Logged in | Content: "Look at this"<br>Image: pic.jpg | 1. Click "Create Post"<br>2. Enter text and select image<br>3. Submit | Post created with image displayed | | |
| POST_003 | View Newsfeed | Logged in | None | 1. Navigate to Home/Newsfeed | List of posts from friends/system displayed | | |
| POST_004 | Like a Post | Logged in | Target Post ID | 1. Click "Like" on a post | Like count increases, Like button active | | |
| POST_005 | Unlike a Post | Logged in, Liked Post | Target Post ID | 1. Click "Like" again | Like count decreases, Like button inactive | | |
| POST_006 | Delete Own Post | Logged in, Own Post | Target Post ID | 1. Click Options on post > Delete<br>2. Confirm | Post removed from feed | | |

## 4. Comments

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CMT_001 | Add Comment to Post | Logged in | Content: "Nice post!" | 1. Click "Comment" on post<br>2. Enter text<br>3. Send | Comment appears below post, count updates | | |
| CMT_002 | View Comments | Logged in | Post with comments | 1. Click "Comment" or "View Comments" | List of comments displayed | | |
| CMT_003 | Edit Own Comment | Logged in, Own Comment | New Content: "Updated" | 1. Click Edit on comment<br>2. Change text<br>3. Save | Comment text updated | | |
| CMT_004 | Delete Own Comment | Logged in, Own Comment | Target Comment ID | 1. Click Delete on comment<br>2. Confirm | Comment removed | | |

## 5. Friends

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| FR_001 | Search for User | Logged in | Name: "John" | 1. Enter name in Search bar<br>2. Press Enter | List of matching users displayed | | |
| FR_002 | Send Friend Request | Logged in | Target User ID | 1. Go to user profile or search result<br>2. Click "Add Friend" | Button changes to "Request Sent" | | |
| FR_003 | Cancel Friend Request | Logged in, Sent Request | Target User ID | 1. Click "Cancel Request" | Button reverts to "Add Friend" | | |
| FR_004 | Accept Friend Request | Logged in, Received Request | Request ID | 1. Go to Friend Requests page<br>2. Click "Confirm" | Request removed, User added to Friends list | | |
| FR_005 | Reject Friend Request | Logged in, Received Request | Request ID | 1. Go to Friend Requests page<br>2. Click "Delete" | Request removed | | |
| FR_006 | Unfriend User | Logged in, Friend | Target User ID | 1. Go to Friend's profile<br>2. Click "Unfriend"<br>3. Confirm | User removed from Friends list | | |
| FR_007 | View Friend List | Logged in | None | 1. Navigate to Friends page/tab | List of current friends displayed | | |

## 6. Chat

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CHAT_001 | Send Message | Logged in | Msg: "Hi there" | 1. Open Chat with friend<br>2. Type message<br>3. Send | Message appears in conversation history | | |
| CHAT_002 | View Conversation List | Logged in | None | 1. Open Chat page/sidebar | List of recent conversations displayed | | |
| CHAT_003 | Receive Real-time Message | Logged in A & B | Msg from B | 1. User B sends message to A<br>2. User A views chat | Message appears instantly without refresh | | |
| CHAT_004 | Mark Messages as Read | Logged in, Unread Msg | None | 1. Open conversation with unread messages | Unread count decreases | | |

## 7. Notifications

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| NOTI_001 | Receive Notification | Logged in A & B | Action by B | 1. User B likes User A's post | User A receives "Like" notification | | |
| NOTI_002 | View Notifications | Logged in | None | 1. Click Notification icon | List of notifications displayed | | |
| NOTI_003 | Mark Single Notification Read | Logged in, Unread Noti | Target ID | 1. Click on unread notification | Notification marked read, navigates to content | | |
| NOTI_004 | Mark All Read | Logged in, Unread Notis | None | 1. Click "Mark all as read" | All notifications marked as read | | |

## 8. Stories

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| STY_001 | Create Story | Logged in | Video file | 1. Click "Create Story"<br>2. Upload video<br>3. Submit | Story uploaded and appears in story bar | | |
| STY_002 | View Friend's Story | Logged in | Friend has Story | None | 1. Click on friend's story circle | Story video plays | | |

## 9. Admin (If applicable)

| Test Case ID | Test Case Description | Prerequisites | Test Data | Steps | Expected Results | Actual Results | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ADM_001 | View Dashboard Stats | Admin Login | None | 1. Navigate to Admin Dashboard | Stats (Users, Posts) displayed | | |
| ADM_002 | Lock User Account | Admin Login | Target User ID | 1. Find user in list<br>2. Toggle Status to Locked | User status changes to Locked | | |
