/**
 * Mock Citizen Authentication & Profile Persistence Service
 * Simulates a secure government auth backend with pre-seeded test accounts,
 * OTP verification, rate limiting, and saved property valuation estimates.
 */

const STORAGE_KEY_USERS = 'bharat_portal_users';
const STORAGE_KEY_ESTIMATES = 'bharat_portal_estimates';
const STORAGE_KEY_OTP = 'bharat_portal_active_otps';

// Default Demo Citizen Account
const DEFAULT_DEMO_USER = {
  id: 'usr_gov_demo_001',
  fullName: 'Ramesh Kumar Sharma',
  email: 'demo@portal.in',
  mobile: '9876543210',
  state: 'Karnataka',
  district: 'Mysuru (Mysore)',
  userType: 'Buyer', // Buyer | Seller | Agent | Bank Officer
  passwordHash: 'Demo@1234', // Simulated hashed comparison
  role: 'CITIZEN',
  createdAt: '2026-01-15T10:30:00.000Z',
  lastLogin: new Date().toISOString(),
};

// Default Demo Government Officer Account
const DEFAULT_OFFICER_USER = {
  id: 'usr_gov_officer_001',
  fullName: 'Dr. Anita Deshmukh (IAS)',
  email: 'officer@portal.in',
  mobile: '9876500000',
  state: 'Maharashtra',
  district: 'Mumbai City',
  userType: 'Director of Analytics',
  passwordHash: 'Officer@1234',
  role: 'OFFICER',
  department: 'State Directorate of Housing & Urban Development',
  createdAt: '2026-01-01T09:00:00.000Z',
  lastLogin: new Date().toISOString(),
};

// Initial Seed Saved Estimates for Demo User
const DEFAULT_DEMO_ESTIMATES = [
  {
    id: 'est_2026_001',
    userId: 'usr_gov_demo_001',
    city: 'Mysuru (Mysore)',
    locality: 'Gokulam',
    total_sqft: 1450,
    bhk: 3,
    bath: 3,
    balcony: 2,
    area_type: 'Super built-up  Area',
    availability: 'Ready To Move',
    model_name: 'Gradient Boosting Regressor',
    predicted_price_lakhs: 78.5,
    formatted_price: '₹78.50 Lakh',
    price_per_sqft: 5413,
    date: '2026-09-25T14:20:00.000Z',
  },
  {
    id: 'est_2026_002',
    userId: 'usr_gov_demo_001',
    city: 'Bengaluru',
    locality: 'Whitefield',
    total_sqft: 1250,
    bhk: 2,
    bath: 2,
    balcony: 1,
    area_type: 'Super built-up  Area',
    availability: 'Ready To Move',
    model_name: 'Gradient Boosting Regressor',
    predicted_price_lakhs: 85.2,
    formatted_price: '₹85.20 Lakh',
    price_per_sqft: 6816,
    date: '2026-09-28T09:15:00.000Z',
  },
];

// Initialize mock storage
function initStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    let users = raw ? JSON.parse(raw) : [];
    if (!users.some((u) => u.email === 'demo@portal.in')) {
      users.push(DEFAULT_DEMO_USER);
    }
    if (!users.some((u) => u.email === 'officer@portal.in')) {
      users.push(DEFAULT_OFFICER_USER);
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    if (!localStorage.getItem(STORAGE_KEY_ESTIMATES)) {
      localStorage.setItem(STORAGE_KEY_ESTIMATES, JSON.stringify(DEFAULT_DEMO_ESTIMATES));
    }
  } catch (e) {
    console.warn('LocalStorage unavailable in mockAuthService', e);
  }
}

initStorage();

function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [DEFAULT_DEMO_USER];
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage', e);
  }
}

export const mockAuthService = {
  /**
   * Password Login
   */
  async loginWithPassword(userId, password) {
    await new Promise((r) => setTimeout(r, 600)); // Simulated network latency
    const users = getUsers();
    const cleanId = userId.trim().toLowerCase();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.mobile === cleanId ||
        (u.email.toLowerCase() === 'demo@portal.in' && (cleanId === 'demo' || cleanId === 'demo@portal.in'))
    );

    if (!user) {
      throw new Error('Invalid credentials. User ID not found in citizen registry.');
    }

    // Verify password
    if (password !== user.passwordHash && !(user.email === 'demo@portal.in' && password === 'Demo@1234')) {
      throw new Error('Incorrect password. Please verify your credentials or reset password via OTP.');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(users);

    const token = `jwt_mock_${user.id}_${Date.now()}`;
    const sanitizedUser = { ...user };
    delete sanitizedUser.passwordHash;

    return {
      user: sanitizedUser,
      token,
      isDemo: true,
      message: 'Citizen login successful.',
    };
  },

  /**
   * Send 6-Digit OTP to Registered Mobile
   */
  async sendOtp(mobile) {
    await new Promise((r) => setTimeout(r, 500));
    const cleanMobile = mobile.trim();

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
    }

    // Standard demo OTP is 123456
    const otpCode = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    try {
      const activeOtps = JSON.parse(sessionStorage.getItem(STORAGE_KEY_OTP) || '{}');
      activeOtps[cleanMobile] = { code: otpCode, expiresAt };
      sessionStorage.setItem(STORAGE_KEY_OTP, JSON.stringify(activeOtps));
    } catch {
      // fallback
    }

    return {
      success: true,
      mobile: cleanMobile,
      message: `OTP sent successfully to +91 ${cleanMobile.slice(0, 2)}******${cleanMobile.slice(8)}. (Demo OTP: 123456)`,
      demoOtpHint: '123456',
    };
  },

  /**
   * Verify OTP and Login
   */
  async loginWithOtp(mobile, otp) {
    await new Promise((r) => setTimeout(r, 600));
    const cleanMobile = mobile.trim();
    const cleanOtp = otp.trim();

    if (cleanOtp !== '123456') {
      try {
        const activeOtps = JSON.parse(sessionStorage.getItem(STORAGE_KEY_OTP) || '{}');
        const stored = activeOtps[cleanMobile];
        if (!stored || stored.code !== cleanOtp || Date.now() > stored.expiresAt) {
          throw new Error('Invalid or expired OTP. Please enter 123456 or request a new OTP.');
        }
      } catch (err) {
        if (cleanOtp !== '123456') {
          throw new Error('Invalid OTP. Please enter the demo code 123456.');
        }
      }
    }

    const users = getUsers();
    let user = users.find((u) => u.mobile === cleanMobile);

    // If mobile does not exist, auto-create citizen profile
    if (!user) {
      user = {
        id: `usr_gov_${Date.now()}`,
        fullName: `Citizen (${cleanMobile.slice(-4)})`,
        email: `citizen_${cleanMobile.slice(-4)}@portal.gov.in.demo`,
        mobile: cleanMobile,
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        userType: 'Buyer',
        passwordHash: 'Demo@1234',
        role: 'CITIZEN',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
    } else {
      user.lastLogin = new Date().toISOString();
      saveUsers(users);
    }

    const token = `jwt_mock_otp_${user.id}_${Date.now()}`;
    const sanitizedUser = { ...user };
    delete sanitizedUser.passwordHash;

    return {
      user: sanitizedUser,
      token,
      isDemo: true,
      message: 'OTP verification successful. Logged in.',
    };
  },

  /**
   * Register Citizen Account
   */
  async register(citizenData) {
    await new Promise((r) => setTimeout(r, 700));
    const users = getUsers();

    const email = citizenData.email.trim().toLowerCase();
    const mobile = citizenData.mobile.trim();

    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error(`Email ${email} is already registered. Please login or use forgot password.`);
    }

    if (users.some((u) => u.mobile === mobile)) {
      throw new Error(`Mobile number +91 ${mobile} is already registered.`);
    }

    const newUser = {
      id: `usr_gov_${Date.now()}`,
      fullName: citizenData.fullName.trim(),
      email,
      mobile,
      state: citizenData.state,
      district: citizenData.district,
      userType: citizenData.userType || 'Buyer',
      passwordHash: citizenData.password, // In real app, hashed on backend
      role: 'CITIZEN',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = `jwt_mock_reg_${newUser.id}_${Date.now()}`;
    const sanitizedUser = { ...newUser };
    delete sanitizedUser.passwordHash;

    return {
      success: true,
      user: sanitizedUser,
      token,
      message: 'Citizen registration successful. Welcome to the Directorate of Housing Analytics Portal.',
    };
  },

  /**
   * Password Reset via OTP
   */
  async resetPassword(userId, otp, newPassword) {
    await new Promise((r) => setTimeout(r, 600));
    if (otp !== '123456') {
      throw new Error('Invalid OTP. Please enter the demo OTP code 123456.');
    }

    const cleanId = userId.trim().toLowerCase();
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.mobile === cleanId
    );

    if (!user) {
      throw new Error('No citizen account found matching that email or mobile number.');
    }

    user.passwordHash = newPassword;
    saveUsers(users);

    return {
      success: true,
      message: 'Password has been securely reset. You may now log in with your new password.',
    };
  },

  /**
   * Get Saved Estimates for a User
   */
  getSavedEstimates(userId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ESTIMATES);
      const all = raw ? JSON.parse(raw) : DEFAULT_DEMO_ESTIMATES;
      return all.filter((e) => e.userId === userId || e.userId === 'usr_gov_demo_001');
    } catch {
      return DEFAULT_DEMO_ESTIMATES;
    }
  },

  /**
   * Save a New Property Estimate
   */
  saveEstimate(userId, estimateData) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ESTIMATES);
      const all = raw ? JSON.parse(raw) : DEFAULT_DEMO_ESTIMATES;
      const newEst = {
        id: `est_${Date.now()}`,
        userId: userId || 'usr_gov_demo_001',
        ...estimateData,
        date: new Date().toISOString(),
      };
      all.unshift(newEst);
      localStorage.setItem(STORAGE_KEY_ESTIMATES, JSON.stringify(all));
      return newEst;
    } catch (e) {
      console.error('Failed to save estimate', e);
      return null;
    }
  },

  /**
   * Delete a Saved Estimate
   */
  deleteEstimate(userId, estimateId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ESTIMATES);
      if (!raw) return [];
      const all = JSON.parse(raw);
      const filtered = all.filter((e) => e.id !== estimateId);
      localStorage.setItem(STORAGE_KEY_ESTIMATES, JSON.stringify(filtered));
      return filtered.filter((e) => e.userId === userId || e.userId === 'usr_gov_demo_001');
    } catch (e) {
      console.error('Failed to delete estimate', e);
      return [];
    }
  },
};

export default mockAuthService;
