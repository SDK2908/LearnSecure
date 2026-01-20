function showForm() {
  document.getElementById("formSection").classList.remove("hidden");
  document.getElementById("formSection").scrollIntoView({ behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const content = document.querySelector(".fade-on-scroll");
  if (window.scrollY > 80) {
    content.classList.add("scrolled");
  } else {
    content.classList.remove("scrolled");
  }
});

const form = document.getElementById("userForm");
const message = document.getElementById("message");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const togglePassword = document.getElementById("togglePassword");
const checklist = document.getElementById("passwordChecklist");

const lengthCheck = document.getElementById("length");
const uppercaseCheck = document.getElementById("uppercase");
const numberCheck = document.getElementById("number");

const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const ageInput = document.getElementById("age");
const submitBtn = document.getElementById("submitBtn");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

passwordInput.addEventListener("focus", () => {
  checklist.classList.remove("hidden");
});

passwordInput.addEventListener("blur", () => {
  checklist.classList.add("hidden");
});

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  lengthCheck.style.color = value.length >= 8 ? "green" : "red";
  uppercaseCheck.style.color = /[A-Z]/.test(value) ? "green" : "red";
  numberCheck.style.color = /\d/.test(value) ? "green" : "red";
  checkFormValidity();
});

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  confirmPasswordInput.type = type;
  togglePassword.textContent = type === "text" ? "hide" : "show";
});

function validateInput(input, condition) {
  if (condition) {
    input.classList.add("valid");
    input.classList.remove("invalid");
  } else {
    input.classList.add("invalid");
    input.classList.remove("valid");
  }
  checkFormValidity();
}

emailInput.addEventListener("input", () => {
  validateInput(emailInput, emailRegex.test(emailInput.value.trim()));
});

phoneInput.addEventListener("input", () => {
  validateInput(phoneInput, phoneRegex.test(phoneInput.value.trim()));
});

ageInput.addEventListener("input", () => {
  const age = Number(ageInput.value);
  validateInput(ageInput, age >= 18 && age <= 60);
});

submitBtn.disabled = true;

function checkFormValidity() {
  const name = document.getElementById("name").value.trim();
  const emailValid = emailRegex.test(emailInput.value.trim());
  const phoneValid = phoneRegex.test(phoneInput.value.trim());
  const age = Number(ageInput.value);
  const ageValid = age >= 18 && age <= 60;
  const passwordValid = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwordInput.value);
  const passwordsMatch =
    passwordInput.value && passwordInput.value === confirmPasswordInput.value;

  if (
    name &&
    emailValid &&
    phoneValid &&
    ageValid &&
    passwordValid &&
    passwordsMatch
  ) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
  } else {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
  }
}

document.getElementById("name").addEventListener("input", checkFormValidity);
passwordInput.addEventListener("input", checkFormValidity);
confirmPasswordInput.addEventListener("input", checkFormValidity);

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = emailInput.value.trim();
  const age = ageInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!name || !email || !age || !phone || !password || !confirmPassword) {
    message.style.color = "red";
    message.textContent = "All fields are required";
    return;
  }

  if (password !== confirmPassword) {
    message.style.color = "red";
    message.textContent = "Passwords do not match";
    return;
  }

  try {
    const response = await fetch("http://localhost:5002/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        age,
        phone,
        password,
        confirmPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Something went wrong";
      return;
    }

    message.style.color = "green";
    message.textContent = "User created successfully";
    form.reset();
    checklist.classList.add("hidden");
    togglePassword.textContent = "show";
    passwordInput.type = "password";
    confirmPasswordInput.type = "password";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
  } catch {
    message.style.color = "red";
    message.textContent = "Server error";
  }
});
