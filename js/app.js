let currentPage = 1;
const pageSize = 6;
let employees = JSON.parse(localStorage.getItem("employees")) || [];

let currentSort = "";

const sortSelect = document.getElementById("sort");
const paginationSelect = document.getElementById("pagination");

const employeeGrid = document.getElementById("employeeGrid");
const modal = document.getElementById("employeeModal");
const form = document.getElementById("employeeForm");
const addBtn = document.getElementById("addEmployeeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeBtn = document.querySelector(".close");
const modalTitle = document.getElementById("modalTitle");




const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const paginationInfo = document.getElementById("paginationInfo");

const searchInput = document.getElementById("searchInput");


const firstNameFilter = document.getElementById("filterFirstName");
const departmentFilter = document.getElementById("filterDepartment");
const roleFilter = document.getElementById("filterRole");



// Save employees to localStorage
function saveToLocalStorage() {
  localStorage.setItem("employees", JSON.stringify(employees));
}

// Clear error messages
function clearErrors() {
  document.querySelectorAll(".error-message").forEach(e => e.textContent = "");
}

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}



cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


// Submit form
function handleSubmit(e) {
  e.preventDefault();
  clearErrors();


  const editId = form.editId.value; // this will be "" for add mode
  const ID = form.employeeId.value.trim();
  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const department = form.department.value;
  const role = form.role.value;

  let hasError = false;
  if (!ID) { showError("employeeIdError", "Employee ID is required"); hasError = true; }
  if (!firstName) { showError("firstNameError", "First name is required"); hasError = true; }
  if (!lastName) { showError("lastNameError", "Last name is required"); hasError = true; }
  if (!email || !/\S+@\S+\.\S+/.test(email)) { showError("emailError", "Valid email required"); hasError = true; }
  if (!department) { showError("departmentError", "Please select department"); hasError = true; }
  if (!role) { showError("roleError", "Please select role"); hasError = true; }

  if (hasError) return;

 // const existingId = form.employeeId.value;
 const uniqueId = editId || Date.now().toString(); // Use editId if available, else generate new ID

  const employee = {
    id: uniqueId,
          employeeId: ID,
    firstName,
    lastName,
    email,
    department,
    role
  };
  const existingIndex = employees.findIndex(emp => emp.id === uniqueId);

  if (existingIndex !== -1) {
    employees[existingIndex] = employee; // Update existing
  } else {
    employees.push(employee); // Add new
  }

  saveToLocalStorage();
  renderEmployees();
  closeModal();
  form.reset();
  //form.editId.value = "";
};

function saveToLocalStorage() {
  localStorage.setItem("employees", JSON.stringify(employees));
}

//const employees = JSON.parse(localStorage.getItem("employees")) || [];
renderEmployees();



// Modal open/close handlers
function openModal() {
  form.reset();
  form.editId.value = "";
   modalTitle.textContent = "Add Employee";
   modal.classList.remove("hidden");
  modal.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "justify-center", "items-center", "z-50");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "justify-center", "items-center", "z-50");
}


document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", openModal);
  cancelBtn.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

    form.addEventListener("submit", handleSubmit);
  renderEmployees();
});





// Render employee cards
function renderEmployees(data = employees) {
  const query = searchInput.value.toLowerCase();
  const firstNameFilter = document.getElementById("filterFirstName")?.value.toLowerCase() || "";
const departmentFilterVal = document.getElementById("filterDepartment")?.value.toLowerCase() || "";
const roleFilterVal = document.getElementById("filterRole")?.value.toLowerCase() || "";


  const filtered = data.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = emp.email.toLowerCase();
    return (
      (fullName.includes(query) || email.includes(query)) &&
      (!firstNameFilter || emp.firstName.toLowerCase().includes(firstNameFilter)) &&
      (!departmentFilterVal || emp.department.toLowerCase().includes(departmentFilterVal)) &&
      (!roleFilterVal || emp.role.toLowerCase().includes(roleFilterVal))
    );
  });


    if (filtered.length === 0) {
    employeeGrid.innerHTML = `<p class="text-gray-500">No employees found.</p>`;
    paginationInfo.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  const totalPages = Math.ceil(filtered.length / pageSize);
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);


  
    // Update pagination info
    
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;



    // Clear previous cards

  employeeGrid.innerHTML = "";


  paginated.forEach(emp => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow flex flex-col justify-between";

    card.innerHTML = `
  <div>
    <h3 class="text-xl font-bold">${emp.firstName} ${emp.lastName}</h3>
    <p class="text-sm text-gray-500">ID: ${emp.employeeId}</p>
    <p class="text-gray-600 text-sm">${emp.email}</p>
    <p class="text-gray-500">${emp.department} - ${emp.role}</p>
  </div>
  <div class="flex justify-end gap-2 mt-4">
    <button class="editBtn text-blue-600 hover:underline" data-id="${emp.id}">Edit</button>
    <button class="deleteBtn text-red-500 hover:underline" data-id="${emp.id}">Delete</button>
  </div>
`;



// Filter employees based on search
//const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(query) ||
    emp.lastName.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query)
  );

  renderEmployees(filteredEmployees);
  
});


// Pagination
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderEmployees();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  renderEmployees();
});



// Attach edit event
card.querySelector(".editBtn").addEventListener("click", () => {
  form.editId.value = emp.id || "";
  form.employeeId.value = emp.employeeId || "";
  form.firstName.value = emp.firstName || "";
  form.lastName.value = emp.lastName || "";
  form.email.value = emp.email || "";
  form.department.value = emp.department || "";
  form.role.value = emp.role || "";

  modalTitle.textContent = "Edit Employee";
  modal.classList.remove("hidden");
  modal.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "justify-center", "items-center", "z-50");
});

// Attach delete event
card.querySelector(".deleteBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this employee?")) {
  employees = employees.filter(e => e.id !== emp.id);
  saveToLocalStorage();
  renderEmployees();
      }
});
    employeeGrid.appendChild(card);
  });
}



// Sidebar toggle
document.getElementById("toggleFilterSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("filterSidebar");
  sidebar.classList.toggle("-translate-x-full");
});

// // Apply filter

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  // If query is empty, show all employees
  if (!query) {
    renderEmployees(); // Will call with full data using filters & pagination
    return;
  }

  // Otherwise, filter based on query
  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(query) ||
    emp.lastName.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query)
  );

  renderEmployees(filteredEmployees);

  // Re-bind delete buttons for filtered list
  const deleteButtons = document.querySelectorAll(".deleteBtn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idToDelete = e.target.dataset.id;
      employees = employees.filter(emp => emp.id !== idToDelete);
      localStorage.setItem("employees", JSON.stringify(employees));

      // Re-filter after delete
      const currentQuery = searchInput.value.toLowerCase();
      const updatedFiltered = currentQuery
        ? employees.filter(emp =>
            emp.firstName.toLowerCase().includes(currentQuery) ||
            emp.lastName.toLowerCase().includes(currentQuery) ||
            emp.email.toLowerCase().includes(currentQuery)
          )
        : employees;

      renderEmployees(updatedFiltered);
    });
  });
});




// Search and filters
searchInput.addEventListener("input", renderEmployees);
firstNameFilter.addEventListener("change", renderEmployees);
departmentFilter.addEventListener("change", renderEmployees);
roleFilter.addEventListener("change", renderEmployees);


// Reset filter
function resetFilter() {
  document.getElementById("filterFirstName").value = "";
  document.getElementById("filterDepartment").value = "";
  document.getElementById("filterRole").value = "";

  currentPage = 1;
  renderEmployees(employees);
}

// Sort employees
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  renderEmployees();
});

paginationSelect.addEventListener("change", () => {
  pageSize = parseInt(paginationSelect.value, 10);
  currentPage = 1;
  renderEmployees();
});


document.getElementById("saveEmployeeBtn").addEventListener("click", () => {
  console.log("Save button clicked");
});

document.getElementById("applyFilterBtn").addEventListener("click", () => {
  currentPage = 1;
  renderEmployees();
});

// Initial render
renderEmployees();
