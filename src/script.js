// ===== ELEMENTOS DEL DOM =====
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// ===== DATOS DE USUARIO =====
const users = [
  {
    email: 'demo@example.com',
    password: 'password123',
    name: 'Usuario Demo'
  },
  {
    email: 'test@example.com',
    password: '123456',
    name: 'Usuario Test'
  }
];

// ===== STATE DEL LOGIN =====
let currentUser = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  checkExistingSession();
  setupEventListeners();
});

// ===== VERIFICAR SESIÓN EXISTENTE =====
function checkExistingSession() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showDashboard();
  }
}

// ===== CONFIGURAR LISTENERS =====
function setupEventListeners() {
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  emailInput.addEventListener('focus', () => clearError('email'));
  passwordInput.addEventListener('focus', () => clearError('password'));
}

// ===== VALIDAR FORMULARIO =====
function validateForm() {
  let isValid = true;

  // Limpiar errores
  clearError('email');
  clearError('password');

  // Validar email
  if (!emailInput.value.trim()) {
    setError('email', 'El correo es requerido');
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setError('email', 'Ingresa un correo válido');
    isValid = false;
  }

  // Validar contraseña
  if (!passwordInput.value.trim()) {
    setError('password', 'La contraseña es requerida');
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    setError('password', 'La contraseña debe tener al menos 6 caracteres');
    isValid = false;
  }

  return isValid;
}

// ===== VALIDAR EMAIL FORMAT =====
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ===== MOSTRAR ERROR =====
function setError(field, message) {
  const errorElement = document.getElementById(`${field}Error`);
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// ===== LIMPIAR ERROR =====
function clearError(field) {
  const errorElement = document.getElementById(`${field}Error`);
  errorElement.textContent = '';
  errorElement.style.display = 'none';
}

// ===== MANEJAR LOGIN =====
function handleLogin(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Buscar usuario
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    setError('email', 'Correo o contraseña incorrectos');
    return;
  }

  // Login exitoso
  currentUser = {
    email: user.email,
    name: user.name,
    loginTime: new Date().toLocaleString()
  };

  // Guardar en localStorage si está marcado "Recuérdame"
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  // Limpiar formulario
  loginForm.reset();

  // Mostrar dashboard
  showDashboard();
}

// ===== MOSTRAR DASHBOARD =====
function showDashboard() {
  if (currentUser) {
    userName.textContent = currentUser.name;
    userEmail.textContent = `Correo: ${currentUser.email}`;

    loginContainer.classList.remove('active');
    dashboardContainer.classList.add('active');
  }
}

// ===== MANEJAR LOGOUT =====
function handleLogout() {
  // Confirmar logout
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Resetear formulario y volver al login
    loginForm.reset();
    loginContainer.classList.add('active');
    dashboardContainer.classList.remove('active');
    clearError('email');
    clearError('password');
  }
}

// ===== ENLACES DE AYUDA =====
document.querySelector('.link-forgot').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Funcionalidad de recuperación de contraseña próximamente');
});

document.querySelector('.link-signup').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Funcionalidad de registro próximamente');
});
