CREATE DATABASE IF NOT EXISTS sims_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sims_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS attendance_records;
DROP TABLE IF EXISTS attendance_sessions;
DROP TABLE IF EXISTS student_enrollments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS combinations;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS academic_years;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO roles (role_name) VALUES ('admin'), ('animation'), ('secretary');

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(150) NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE academic_years (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year_name VARCHAR(30) NOT NULL UNIQUE,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('upcoming','active','completed') NOT NULL DEFAULT 'upcoming'
) ENGINE=InnoDB;

CREATE TABLE terms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  academic_year_id INT NOT NULL,
  term_number TINYINT NOT NULL,
  term_name VARCHAR(40) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('upcoming','active','completed') NOT NULL DEFAULT 'upcoming',
  UNIQUE KEY uq_term_year_number (academic_year_id, term_number),
  CONSTRAINT fk_terms_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
) ENGINE=InnoDB;

CREATE TABLE levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO levels (level_name) VALUES ('L3'), ('L4'), ('L5');

CREATE TABLE combinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_id INT NOT NULL,
  combination_name VARCHAR(80) NOT NULL,
  description VARCHAR(255) NULL,
  UNIQUE KEY uq_combination_level (level_id, combination_name),
  CONSTRAINT fk_combinations_level FOREIGN KEY (level_id) REFERENCES levels(id)
) ENGINE=InnoDB;

INSERT INTO combinations (level_id, combination_name)
SELECT id, 'General' FROM levels;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_number VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  gender ENUM('Male','Female','Other') NOT NULL,
  date_of_birth DATE NULL,
  phone VARCHAR(30) NULL,
  guardian_name VARCHAR(120) NULL,
  guardian_phone VARCHAR(30) NULL,
  address VARCHAR(255) NULL,
  status ENUM('active','inactive','graduated') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE student_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  academic_year_id INT NOT NULL,
  combination_id INT NOT NULL,
  enrollment_date DATE NOT NULL,
  status ENUM('active','completed','transferred') NOT NULL DEFAULT 'active',
  UNIQUE KEY uq_student_year (student_id, academic_year_id),
  CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_enrollment_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
  CONSTRAINT fk_enrollment_combination FOREIGN KEY (combination_id) REFERENCES combinations(id)
) ENGINE=InnoDB;

CREATE TABLE attendance_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  term_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  session_name ENUM('Morning','Afternoon','Full day') NOT NULL DEFAULT 'Full day',
  recorded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_session (term_id, attendance_date, session_name),
  CONSTRAINT fk_session_term FOREIGN KEY (term_id) REFERENCES terms(id),
  CONSTRAINT fk_session_user FOREIGN KEY (recorded_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE attendance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  enrollment_id INT NOT NULL,
  attendance_status ENUM('Present','Absent','Late','Excused') NOT NULL,
  remarks VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_session_enrollment (session_id, enrollment_id),
  CONSTRAINT fk_record_session FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_record_enrollment FOREIGN KEY (enrollment_id) REFERENCES student_enrollments(id)
) ENGINE=InnoDB;

-- Optional first academic year and terms. Edit these values for your school.
INSERT INTO academic_years (year_name, status) VALUES ('2026', 'active');
INSERT INTO terms (academic_year_id, term_number, term_name, status)
VALUES (1, 1, 'Term I', 'active'), (1, 2, 'Term II', 'upcoming'), (1, 3, 'Term III', 'upcoming');
     



     CREATE TABLE IF NOT EXISTS student_material_check_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term_id INT NOT NULL,
    checking_date DATE NOT NULL,
    enrollment_id INT NOT NULL,
    checked_by INT NOT NULL,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_material_session (
        term_id,
        checking_date,
        enrollment_id
    ),

    CONSTRAINT fk_material_session_term
        FOREIGN KEY (term_id)
        REFERENCES terms(id),

    CONSTRAINT fk_material_session_enrollment
        FOREIGN KEY (enrollment_id)
        REFERENCES student_enrollments(id),

    CONSTRAINT fk_material_session_user
        FOREIGN KEY (checked_by)
        REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_material_check_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_session_id INT NOT NULL,
    material_key VARCHAR(60) NOT NULL,
    material_status ENUM('OK', 'NYC') NOT NULL,

    UNIQUE KEY uq_material_session_item (
        check_session_id,
        material_key
    ),

    CONSTRAINT fk_material_item_session
        FOREIGN KEY (check_session_id)
        REFERENCES student_material_check_sessions(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;




