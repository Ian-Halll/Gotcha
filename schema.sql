-- Drop the employee_trackerdb if it already exists
DROP DATABASE IF EXISTS employee_trackerdb;

-- Create the employee_trackerdb database
CREATE DATABASE employee_trackerdb;

-- Use the employee_trackerdb database
USE employee_trackerdb;

-- Create the department table
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Insert sample data into the department table
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Human Resources');

-- Insert sample data into the role table
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 80000.00, 1),
  ('Sales Representative', 50000.00, 1),
  ('Software Engineer', 90000.00, 2),
  ('Database Administrator', 85000.00, 2),
  ('Financial Analyst', 70000.00, 3),
  ('HR Manager', 75000.00, 4);

-- Insert sample data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1),
  ('Sarah', 'Williams', 4, 2),
  ('David', 'Brown', 5, 3),
  ('Emily', 'Davis', 6, 4);