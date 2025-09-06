// auth.js - For public pages like login.html and signup.html

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://vkaiqzjabhqaqowahlkn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWlxemphYmhxYXFvd2FobGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzIwMjMsImV4cCI6MjA3MjY0ODAyM30.5xk8Skc1K_kD8rNb6dkmEFWiPNQKsnBdmJUAK8fHIJM";
const supabase = createClient(supabaseUrl, supabaseKey);

/* signup */
const signupForm = document.getElementById("signup-form"); // Use ID from our HTML
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("Signup failed: " + error.message);
    } else {
      alert("Signup successful! Please check your email to confirm your account and then log in.");
      // After signup, always go to login page to confirm
      window.location.href = "login.html";
    }
  });
}

/* signin */
const loginForm = document.getElementById("login-form"); // Use ID from our HTML
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      // On successful login, go to the main dashboard
      window.location.href = "index.html";
    }
  });
}
// app-auth.js - For protected pages like index.html, recipe.html, etc.

// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// const supabaseUrl = "https://vkaiqzjabhqaqowahlkn.supabase.co";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWlxemphYmhxYXFvd2FobGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzIwMjMsImV4cCI6MjA3MjY0ODAyM30.5xk8Skc1K_kD8rNb6dkmEFWiPNQKsnBdmJUAK8fHIJM";
// const supabase = createClient(supabaseUrl, supabaseKey);

// --- Page Protection & Logout ---

// 1. Check if the user is logged in
async function checkUserSession() {
    const { data, error } = await supabase.auth.getSession();
    
    // If there is no active session, or an error, redirect to login
    async function checkUserSession() {
  const { data, error } = await supabase.auth.getSession();

  // Get the current page
  const currentPage = window.location.pathname.split("/").pop();

  if (!data.session && currentPage !== "login.html" && currentPage !== "signup.html") {
    console.log("No active session found. Redirecting to login page.");
    window.location.href = "login.html";
  } else if (data.session && (currentPage === "login.html" || currentPage === "signup.html")) {
    console.log("User already logged in. Redirecting to dashboard.");
    window.location.href = "index.html"; 
  } else {
    console.log("Session valid or on correct page. No redirect needed.");
  }
}

}

// 2. Handle Logout
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert("Logout failed: " + error.message);
    } else {
        // Redirect to the login page after successful logout
        window.location.href = "login.html";
    }
}

// 3. Attach event listener to the logout button
document.addEventListener('DOMContentLoaded', () => {
    // Run the session check as soon as the page loads
    checkUserSession();

    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }
});
if (!user && window.location.pathname !== "/login") {
    window.location.href = "/login";
}
form.addEventListener("submit", (e) => {
    e.preventDefault(); // stops auto refresh
    // handle login/signup
});
useEffect(() => {
  if (user) {
    navigate("/dashboard");
  }
}, [user]);
localStorage.setItem("authToken", token);
