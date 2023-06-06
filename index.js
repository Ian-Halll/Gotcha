const inquirer = require('inquirer');
const connection = require('./connection');
const consoleTable = require('console.table');

// Function to start the application
function startApp() {
  // Prompt the user for the desired action
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      // Call the appropriate function based on the user's choice
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  // Fetch department data from the database
  connection
    .query('SELECT * FROM departments')
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
      startApp();
    })
    .catch(error => {
      console.error('Error: ', error);
      startApp();
    });
}

// Function to view all roles
function viewAllRoles() {
  // Fetch role data from the database
  connection
    .query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id')
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
      startApp();
    })
    .catch(error => {
      console.error('Error: ', error);
      startApp();
    });
}

// Function to view all employees
function viewAllEmployees() {
  // Fetch employee data from the database
  connection
    .query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
            FROM employees
            LEFT JOIN roles ON employees.role_id = roles.id
            LEFT JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees managers ON employees.manager_id = managers.id`)
    .then(([rows]) => {
      console.log('\n');
      console.table(rows);
      startApp();
    })
    .catch(error => {
      console.error('Error: ', error);
      startApp();
    });
}

// Function to add a department
function addDepartment() {
  // Prompt the user to enter the department name
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:'
    })
    .then(answer => {
      // Insert the new department into the database
      connection
        .query('INSERT INTO departments (name) VALUES (?)', [answer.departmentName])
        .then(() => {
          console.log('Department added successfully!');
          startApp();
        })
        .catch(error => {
          console.error('Error: ', error);
          startApp();
        });
    });
}

// Function to add a role
function addRole() {
  // Fetch department data from the database
  connection
    .query('SELECT * FROM departments')
    .then(([departments]) => {
      // Prompt the user to enter role details
      inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:'
          },
          {
            name: 'salary',
            type: 'number',
            message: 'Enter the salary for the role:'
          },
          {
            name: 'departmentId',
            type: 'list',
            message: 'Select the department for the role:',
            choices: departments.map(department => ({
              name: department.name,
              value: department.id
            }))
          }
        ])
        .then(answer => {
          // Insert the new role into the database
          connection
            .query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answer.title, answer.salary, answer.departmentId])
            .then(() => {
              console.log('Role added successfully!');
              startApp();
            })
            .catch(error => {
              console.error('Error: ', error);
              startApp();
            });
        });
    });
}

// Function to add an employee
async function addEmployee() {
  try {
    // Prompt for employee details
    const employee = await inquirer.prompt([
      // Prompt for first name
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter the employee\'s first name:',
      },
      // Prompt for last name
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter the employee\'s last name:',
      },
      // Prompt for role
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the employee\'s role:',
        choices: async () => {
          const rolesQuery = 'SELECT id, title FROM roles';
          const [rows] = await connection.query(rolesQuery);
          return rows.map((row) => ({ name: row.title, value: row.id }));
        },
        pageSize: 10,
      },
      // Prompt for manager
      {
        name: 'manager_id',
        type: 'list',
        message: 'Select the employee\'s manager:',
        choices: async () => {
          const managersQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees';
          const [rows] = await connection.query(managersQuery);
          return rows.map((row) => ({ name: row.manager, value: row.id }));
        },
        pageSize: 10,
      },
    ]);

    // Insert the new employee into the database
    const insertQuery = 'INSERT INTO employees SET ?';
    await connection.query(insertQuery, employee);

    console.log('Employee added successfully!');
    // Call the main menu function again to continue the application flow
    mainMenu();
  } catch (error) {
    console.log('Error adding employee:', error);
  }
}

function mainMenu() {
  inquirer
  .prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ])
  .then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
      default:
        console.log('Invalid action. Please try again.');
        mainMenu();
    }
  });
}

// Call the mainMenu function to start the application



// Function to update an employee role
async function updateEmployeeRole() {
  try {
    // Retrieve employees and roles from the database
    const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employees');
    const [roles] = await connection.query('SELECT id, title FROM roles');

    // Prompt for the employee and new role
    const { employee_id, role_id } = await inquirer.prompt([
      // Prompt for employee
      {
        name: 'employee_id',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employees.map((employee) => ({ name: employee.employee, value: employee.id })),
        pageSize: 10,
      },
      // Prompt for new role
      {
        name: 'role_id',
        type: 'list',
        message: 'Select the new role:',
        choices: roles.map((role) => ({ name: role.title, value: role.id })),
        pageSize: 10,
      },
    ]);

    // Update the employee's role in the database
    await connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [role_id, employee_id]);

    console.log('Employee role updated successfully!');
    mainMenu(); // Add this line to return to the main menu
  } catch (error) {
    console.log('Error updating employee role:', error);
    mainMenu(); // Add this line to return to the main menu
  }
}


// Start the application
startApp();