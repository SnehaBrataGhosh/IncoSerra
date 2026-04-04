-- IncoSerra MySQL schema
-- Create database and tables for the beta application.

CREATE DATABASE IF NOT EXISTS incoserra_db;
USE incoserra_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(32) NOT NULL,
  aadhaar CHAR(12) NOT NULL UNIQUE,
  domain ENUM('E-commerce', 'Fast commerce', 'Taxi', 'Food delivery') NOT NULL,
  password VARCHAR(255) NOT NULL,
  plan ENUM('silver', 'gold', 'platinum') NULL,
  plan_change_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_name (name)
);

CREATE TABLE IF NOT EXISTS deposits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_deposits_user_date (user_id, date)
);

CREATE TABLE IF NOT EXISTS claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('approved', 'rejected', 'review') NOT NULL,
  payout_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  risk_score INT NOT NULL,
  reason TEXT,
  weather_summary VARCHAR(128) NULL,
  activity_level VARCHAR(32) NULL,
  movement VARCHAR(8) NULL,
  demand_simulated VARCHAR(32) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_claims_user (user_id)
);
