INSERT INTO department (name) VALUES
  ('Marketing'),
  ('Operations');


INSERT INTO role (title, salary, department_id) VALUES
  ('Marketing Manager', 85000.00, 5),
  ('Operations Analyst', 60000.00, 6);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Michael', 'Johnson', 7, 1),
  ('Emily', 'Wilson', 8, 6);