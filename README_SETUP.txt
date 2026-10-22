PORTFOLIO - REACT + NODE.JS + EXPRESS + MYSQL

REQUIREMENTS: Node.js 18+ (you already have it) and XAMPP MySQL running.

1. Extract this zip, e.g. to D:\xampp\htdocs\Portfolio_React   (any folder works)

2. Start MySQL in the XAMPP Control Panel.
   Open server\.env and check DB_PORT matches XAMPP's MySQL port (3307 for you, 3306 is the default).
   The database "portfolio_react", its tables and demo projects are created automatically.

3. Open PowerShell in the project folder and run:
     npm run install-all
     npm run dev

4. Open http://localhost:5173
   (the Node API runs on http://localhost:5000)

ADMIN LOGIN:  http://localhost:5173/login
   email: admin@portfolio.com    password: admin123
   (change them in server\.env)

TWO TERMINALS ALTERNATIVE (if npm run dev fails):
   cd server  &&  npm run dev
   cd client  &&  npm run dev
