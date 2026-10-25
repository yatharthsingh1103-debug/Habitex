/**
 * AUTHENTICATION SIMULATION & SESSION MANAGER
 * Manages frontend sessions in localStorage, user profiles, roles, and route guards.
 */

const AuthManager = {
  USER_STORAGE_KEY: "estatecraft_current_user",
  USERS_LIST_KEY: "estatecraft_registered_users",

  DEFAULT_USERS: [
    {
      id: "usr-001",
      name: "Yatharth",
      email: "yatharth@habitex.in",
      phone: "9810123456",
      role: "Seller",
      company: "Yatharth Capital Real Estate",
      joined: "Jan 2024"
    },
    {
      id: "usr-002",
      name: "Aaditi Sharma",
      email: "aaditi.sharma@example.com",
      phone: "9871234567",
      role: "Buyer",
      company: "Individual",
      joined: "Mar 2024"
    }
  ],

  init() {
    if (!localStorage.getItem(this.USERS_LIST_KEY)) {
      localStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(this.DEFAULT_USERS));
    }
    // Only auto-seed Yatharth on first run if user hasn't explicitly logged out
    const isExplicitlyLoggedOut = localStorage.getItem("estatecraft_logged_out") === "true";
    const existing = this.getUser();
    if (existing && existing.email === "yatharth@estatecraft.in") {
      existing.email = "yatharth@habitex.in";
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(existing));
    }
    if (!existing && !isExplicitlyLoggedOut) {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(this.DEFAULT_USERS[0]));
    }
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return this.getUser() !== null;
  },

  login(email, password, rememberMe = true) {
    this.init();
    localStorage.removeItem("estatecraft_logged_out");
    const users = JSON.parse(localStorage.getItem(this.USERS_LIST_KEY) || "[]");
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    // If not found in mock list, create a session based on the email
    if (!user) {
      const namePart = email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = {
        id: "usr-" + Date.now().toString(36),
        name: formattedName,
        email: email.trim(),
        phone: "9812345678",
        role: "Seller",
        joined: "Today"
      };
      users.push(user);
      localStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(users));
    }

    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("estatecraft-auth-changed", { detail: { user } }));
    return { success: true, user };
  },

  register(userData) {
    this.init();
    localStorage.removeItem("estatecraft_logged_out");
    const users = JSON.parse(localStorage.getItem(this.USERS_LIST_KEY) || "[]");

    // Check duplicate email
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase().trim())) {
      return { success: false, message: "An account with this email address already exists." };
    }

    const newUser = {
      id: "usr-" + Date.now().toString(36),
      name: userData.fullName.trim(),
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone.trim(),
      role: userData.role || "Buyer",
      company: userData.company || "",
      joined: "Today"
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(users));
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(newUser));

    window.dispatchEvent(new CustomEvent("estatecraft-auth-changed", { detail: { user: newUser } }));
    return { success: true, user: newUser };
  },

  logout(redirectUrl = "logout.html") {
    const currentUser = this.getUser();
    if (currentUser) {
      localStorage.setItem("estatecraft_last_logged_out_user", JSON.stringify(currentUser));
    }
    localStorage.setItem("estatecraft_logged_out", "true");
    localStorage.removeItem(this.USER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("estatecraft-auth-changed", { detail: { user: null } }));
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  requireAuth(redirectUrl = "login.html") {
    if (!this.isLoggedIn()) {
      window.location.href = `${redirectUrl}?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }
    return true;
  }
};

AuthManager.init();
window.AuthManager = AuthManager;
