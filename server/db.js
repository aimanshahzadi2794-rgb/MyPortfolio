import mysql from 'mysql2/promise';

export let pool;

// seed data (inserted only when the projects table is empty)
const SEED = [
  ['ModelForge: No-Code GenAI Platform', 'ai', 'A no-code GenAIOps platform for customizing LLMs through dataset preparation, PDF-based RAG and LoRA/QLoRA fine-tuning. Models can be validated, registered and deployed locally through Ollama, with citation-backed answers and chat inference.', 'Next.js, FastAPI, LangChain, Transformers, PEFT, QLoRA, SQLite'],
  ['Smart Timetable Generator', 'ai', 'An AI-based tool that reads CSV files of rooms and sessions and automatically generates an optimized timetable, cutting down manual scheduling work.', 'HTML, CSS, JavaScript, Python'],
  ['Library Management System', 'web', 'A web-based library management system for managing books and library records, built as a full-stack application with a React front-end and a Node.js back-end.', 'HTML, CSS, JavaScript, React, Node.js'],
  ['Smart Quran Learning App', 'mobile', 'A mobile app with the Quran in Urdu and English translation, daily duas, sunnahs and a location-based Salah time tracker, built to make learning interactive.', 'Flutter, Dart, Firebase'],
  ['Super Mario Game', 'game', 'A complete Super Mario game in Java with all its components, built around core OOP concepts: inheritance, method overriding, method overloading, polymorphism, abstraction and encapsulation.', 'Java, OOP'],
  ['Angry Bird 3D Game', 'game', 'A 3D interactive game for children with custom game mechanics, player controls and engaging gameplay.', 'Unity, C#'],
  ['Flight Reservation System', 'systems', 'A flight booking system built on data structure concepts. Users can view available flights, reserve bookings, and the system stores customer information.', 'C++, Data Structures'],
  ['OS Algorithms Simulator', 'systems', 'A project covering the core algorithms of Operating Systems, implemented and demonstrated end to end.', 'Operating Systems, Algorithms'],
  ['Memory Game in Assembly', 'systems', 'A memory-matching game written entirely in assembly language for the COAL course, handling game logic, input and display at the low level.', 'Assembly Language, COAL'],
  ['Smart Agricultural System', 'systems', 'A smart agriculture model for the CA course, built on an Arduino Uno. It reads soil moisture, air temperature and humidity (DHT11), rain, motion (PIR) and distance (ultrasonic) sensors, shows live readings on an LCD, and drives a relay-controlled water pump for irrigation.', 'Arduino Uno, DHT11, Soil Moisture Sensor, Rain Sensor, PIR, Ultrasonic, Relay'],
];

export async function initDb() {
  const cfg = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };
  const dbName = process.env.DB_NAME || 'portfolio_react';

  // create the database if it does not exist yet
  const conn = await mysql.createConnection(cfg);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await conn.end();

  pool = mysql.createPool({ ...cfg, database: dbName, waitForConnections: true, connectionLimit: 10 });

  await pool.query(`CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NULL,
    link VARCHAR(255) NULL,
    tech_stack VARCHAR(255) NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM projects');
  if (c === 0) {
    for (let i = 0; i < SEED.length; i++) {
      const [title, category, description, tech] = SEED[i];
      await pool.query(
        'INSERT INTO projects (title, category, description, tech_stack, created_at) VALUES (?,?,?,?, NOW() - INTERVAL ? MINUTE)',
        [title, category, description, tech, i]
      );
    }
    console.log('Seeded demo projects');
  }
}
