let employees = Array.from(document.querySelectorAll(".employee-card"));

function filterEmployees() {
  const name = document.getElementById("filterName").value.toLowerCase();
  const dept = document.getElementById("filterDept").value.toLowerCase();
  const role = document.getElementById("filterRole").value.toLowerCase();

  employees.forEach(emp => {
    const content = emp.textContent.toLowerCase();
    emp.style.display = (
      content.includes(name) &&
      content.includes(dept) &&
      content.includes(role)
    ) ? "block" : "none";
  });
}

function resetFilter() {
  document.getElementById("filterName").value = "";
  document.getElementById("filterDept").value = "";
  document.getElementById("filterRole").value = "";
  employees.forEach(emp => emp.style.display = "block");
}

function searchEmployees() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  employees.forEach(emp => {
    emp.style.display = emp.textContent.toLowerCase().includes(keyword) ? "block" : "none";
  });
}

function sortEmployees() {
  const sortBy = document.getElementById("sortSelect").value;
  const grid = document.getElementById("employeeGrid");

  const sorted = [...employees].sort((a, b) => {
    const valA = a.textContent.toLowerCase().match(new RegExp(`${sortBy}:?\s*(\w+)`));
    const valB = b.textContent.toLowerCase().match(new RegExp(`${sortBy}:?\s*(\w+)`));
    return valA && valB && valA[1] > valB[1] ? 1 : -1;
  });

  sorted.forEach(card => grid.appendChild(card));
}

document.getElementById("applyFilter").addEventListener("click", filterEmployees);
document.getElementById("resetFilter").addEventListener("click", resetFilter);
document.getElementById("searchInput").addEventListener("input", searchEmployees);
document.getElementById("sortSelect").addEventListener("change", sortEmployees);

// Pagination Logic

let allEmployees = Array.from(document.querySelectorAll(".employee-card"));
let currentPage = 1;
let pageSize = parseInt(document.getElementById("pageSize").value);
const employeeGrid = document.getElementById("employeeGrid");

function showPage(page) {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  allEmployees.forEach((emp, index) => {
    emp.style.display = index >= start && index < end ? "block" : "none";
  });
}

function updatePageSize() {
  pageSize = parseInt(document.getElementById("pageSize").value);
  currentPage = 1;
  showPage(currentPage);
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  showPage(currentPage);
});

document.getElementById("pageSize").addEventListener("change", updatePageSize);

function editEmployee(id) {
  const employee = employees.find(emp => emp.id === id);
  localStorage.setItem("editEmployee", JSON.stringify(employee));
  window.location.href = "form.html";
}

