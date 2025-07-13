let employees = JSON.parse(localStorage.getItem("employees")) || [];

window.onload = function () {
  const editData = JSON.parse(localStorage.getItem("editEmployee"));
  if (editData) {
    document.getElementById("form-title").textContent = "Edit Employee";
    document.getElementById("employeeId").value = editData.id;
    document.getElementById("firstName").value = editData.firstName;
    document.getElementById("lastName").value = editData.lastName;
    document.getElementById("email").value = editData.email;
    document.getElementById("department").value = editData.department;
    document.getElementById("role").value = editData.role;
  }
};

function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("employeeId").value || Date.now().toString();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();
  const role = document.getElementById("role").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!firstName || !lastName || !emailRegex.test(email) || !department || !role) {
    alert("Please fill all fields correctly.");
    return;
  }

  const employeeData = { id, firstName, lastName, email, department, role };

  const existingIndex = employees.findIndex(emp => emp.id === id);
  if (existingIndex >= 0) {
    employees[existingIndex] = employeeData;
  } else {
    employees.push(employeeData);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.removeItem("editEmployee");

  alert("Employee saved successfully!");
  window.location.href = "index.html"; // redirect to dashboard
}
