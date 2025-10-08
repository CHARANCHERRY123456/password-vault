# 🔐 Password Vault - Secure Password Manager

A modern, privacy-first password manager built with Next.js, featuring client-side encryption and zero-knowledge architecture.

## 🌟 Features

### Core Features
- **🎲 Password Generator**: Generate strong, customizable passwords
  - Length slider (8-32 characters)
  - Toggle numbers, letters, symbols
  - Exclude ambiguous characters option
  - Real-time strength indicator

- **🔒 Secure Vault**: Store and manage passwords safely
  - Title, username, password, URL, notes
  - Client-side AES-256 encryption
  - Zero-knowledge architecture
  - Server never sees plaintext passwords

- **🔍 Search & Filter**: Find passwords quickly
  - Real-time search by title, URL, or notes
  - Filter by tags
  - Clean, organized interface

- **📋 Smart Clipboard**: Copy with auto-clear
  - One-click password copy
  - Automatic clipboard clear after 15 seconds
  - Security-focused design

### Advanced Features
- **🔐 Two-Factor Authentication (2FA)**: TOTP-based security
  - Google Authenticator compatible
  - QR code setup
  - speakeasy implementation

- **🏷️ Tags & Organization**: Categorize your passwords
  - Multiple tags per entry
  - Tag-based filtering
  - Easy organization

- **🌓 Dark Mode**: Eye-friendly themes
  - Light/Dark mode toggle
  - Automatic theme switching
  - Persistent preference

- **💾 Backup & Restore**: Export/Import functionality
  - Export encrypted vault as JSON
  - Import with password confirmation
  - Preserve encryption integrity

## 🛡️ Security Architecture

### Client-Side Encryption
**Library Used**: `crypto-js` (AES-256 encryption)

**Why crypto-js?**
- Lightweight and battle-tested for browser-based encryption
- Zero-knowledge design: encryption key derived from user password using SHA-256
- Server stores only encrypted data, never sees plaintext passwords
- Perfect for client-side encryption with minimal overhead

### Encryption Flow
1. **Key Derivation**: User password → SHA-256 hash → Encryption Key
2. **Storage**: Encryption key stored in localStorage (cleared on logout)
3. **Encryption**: Passwords encrypted client-side before API calls
4. **Decryption**: Passwords decrypted client-side for display
5. **Zero-Knowledge**: Server never has access to plaintext data

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.4** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** (State Management)

### Backend
- **Next.js API Routes**
- **MongoDB** with Mongoose
- **JWT** (HttpOnly cookies)
- **bcryptjs** (Password hashing)

### Security & Encryption
- **crypto-js** (AES encryption)
- **speakeasy** (2FA TOTP)
- **qrcode** (QR generation)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/CHARANCHERRY123456/password-vault.git
cd password-vault
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

## 🎯 Usage Guide

### 1. Create an Account
- Navigate to `/signup`
- Enter email and password
- Confirm password
- Account created with automatic login

### 2. Generate a Password
- Use the password generator on homepage
- Adjust length and character options
- Click "Generate Password"
- Copy to clipboard

### 3. Save to Vault
- Fill in the vault entry form
- Add title, password, URL, notes, tags
- Click "Save to Vault"
- Password is encrypted before saving

### 4. Manage Passwords
- Navigate to `/dashboard`
- Search or filter by tags
- View, edit, or delete entries
- Copy passwords with auto-clear

### 5. Enable 2FA (Optional)
- Go to `/settings`
- Click "Enable 2FA"
- Scan QR code with Google Authenticator
- Enter verification code
- 2FA enabled

### 6. Backup & Restore
- Dashboard → Export Backup (downloads JSON)
- Import → Select JSON file → Confirm password
- All items imported with encryption intact

## 📁 Project Structure

```
password-vault/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── 2fa/
│   │   │       ├── enable/route.ts
│   │   │       └── verify/route.ts
│   │   └── vault/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── PasswordGenerator.tsx
│   ├── VaultEntryForm.tsx
│   ├── VaultItem.tsx
│   ├── AddEditVaultModal.tsx
│   ├── ExportImportButtons.tsx
│   ├── ThemeToggle.tsx
│   ├── Navbar.tsx
│   └── vault/
│       ├── PasswordField.tsx
│       ├── SearchBar.tsx
│       ├── TagFilter.tsx
│       └── EmptyState.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── CryptoContext.tsx
├── lib/
│   ├── crypto.ts
│   ├── auth.ts
│   ├── mongodb.ts
│   ├── session.ts
│   ├── passwordGenerator.ts
│   └── exportImport.ts
├── models/
│   ├── User.ts
│   └── Vault.ts
├── store/
│   └── vaultStore.ts
└── hooks/
    └── useCopyPassword.ts
```

## 🔒 Security Features

- ✅ Client-side AES-256 encryption
- ✅ Zero-knowledge architecture
- ✅ JWT authentication with HttpOnly cookies
- ✅ bcrypt password hashing
- ✅ TOTP-based 2FA
- ✅ Automatic clipboard clearing
- ✅ No plaintext password storage
- ✅ Secure key derivation (SHA-256)
- ✅ Session management
- ✅ CSRF protection

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- Click Deploy

3. **Update Environment**
- Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

### Alternative: Deploy to Netlify

```bash
npm run build
# Follow Netlify deployment instructions
```

## 🧪 Acceptance Criteria

✅ **Sign up, log in, add item**: User can register, login, and create vault entries  
✅ **Encrypted storage**: Only encrypted data visible in DB/network requests  
✅ **Fast generator**: Password generation is instant  
✅ **Auto-clear clipboard**: Clipboard clears after 15 seconds  
✅ **Search functionality**: Search returns expected filtered items  

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**CHARANCHERRY**
- GitHub: [@CHARANCHERRY123456](https://github.com/CHARANCHERRY123456)
- Repository: [password-vault](https://github.com/CHARANCHERRY123456/password-vault)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for database solutions
- crypto-js for encryption capabilities
- speakeasy for 2FA implementation

---

**⚠️ Security Note**: This is a demonstration project. For production use, consider additional security measures like:
- Hardware security keys
- Regular security audits
- Rate limiting
- Advanced threat detection
- Backup encryption keys

**🔐 Privacy First**: Your master password is never sent to the server. All encryption happens in your browser.
