// auth.js - For public pages like login.html and signup.html

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://vkaiqzjabhqaqowahlkn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWlxemphYmhxYXFvd2FobGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzIwMjMsImV4cCI6MjA3MjY0ODAyM30.5xk8Skc1K_kD8rNb6dkmEFWiPNQKsnBdmJUAK8fHIJM";
const supabase = createClient(supabaseUrl, supabaseKey);

/* signup */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupname").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("Signup failed: " - error.message);
    } else {
      alert("Signup successful! Please check your email to confirm your account and then login.");
      window.location.href = "login.html";
    }
  });
}

/* signin */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("loginpassword").value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Login successful!");
      window.location.href = "index.html";
    }
  });
}