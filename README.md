# ALLCRYPT

**ALLCRYPT** is an open, modern MERN-stack encryption utility built for secure data transmission. It features military-grade encryption algorithms (AES-256, AES-192, AES-128, DES) and a stunning premium UI with glassmorphism and dark mode aesthetics. 

## Features
- **Open Access**: No login or authentication required. Simply generate a key and encrypt.
- **Client & Server Integration**: Uses a modern React (Vite) frontend with a Node/Express backend that handles cryptographic buffering safely.
- **Multiple Algorithms**: Dynamically select between AES-128, AES-192, AES-256, and DES.
- **Password-Derived Keys**: Utilizes `scrypt` to securely hash custom passwords into exact byte-length keys.
- **Interactive About Guide**: Includes a built-in Glassmorphism modal explaining fundamental encryption mechanics instantly to new users.

## Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS (Glassmorphism design), Framer Motion, Axios
- **Backend**: Node.js, Express.js, native `crypto` API

## Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.

### 1. Installation
Clone the repository and install dependencies for both the client and server.

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Configuration
In the `server/` directory, ensure your `.env` file has the following configurations:
```env
PORT=5000
```

### 3. Running the Project
You will need two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
node index.js
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be automatically running on `http://localhost:5173`.

## Usage
1. Enter the plain text you wish to secure into the input field.
2. Select your desired encryption algorithm from the dropdown.
3. Click **Generate Random Key** (or type a memorable password yourself).
4. Click **Auto-Encrypt Data**.
5. Copy the combined output (IV + Ciphertext) alongside the password to share securely.

## License
Created as a final semester project. Open MIT License.
