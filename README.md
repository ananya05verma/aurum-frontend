# Aurum Frontend

Frontend for Aurum, a SIP portfolio tracking dashboard.

## Features
- User authentication (login/signup)
- Dashboard with portfolio summary
- Pie chart for allocation
- Create SIPs using dropdown of mutual funds (auto-filled scheme codes)
- Rule-based investment insights
- Responsive UI

## Tech Stack
- React (Vite)
- Axios
- Recharts
- Tailwind CSS
- Deployed on Vercel

## Run Locally
git clone https://github.com/your-username/aurum-frontend.git  
cd aurum-frontend  
npm install  

Create .env file:
VITE_API_BASE_URL=https://your-backend-url.onrender.com  

Run:
npm run dev  

## Live Demo
Frontend: https://aurum-frontend-kappa.vercel.app/ 
Backend: https://aurum-backend-vd0a.onrender.com

## Notes
- Frontend communicates with backend APIs for all data
- JWT token stored in localStorage and sent with requests
- Mutual fund selection uses backend scheme list to reduce user input errors
- Insights shown on dashboard are rule-based

## License
MIT