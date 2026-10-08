# SkillTab — Smart Student Career Profile

A web-based career intelligence platform that combines student profile management with career-oriented skill analysis. Built for a hackathon.

## Features

- **Digital Career Profile** — Personal info, academic details, and achievements
- **Skill Management** — Add technical and soft skills with 5-level proficiency (Beginner to Expert)
- **Project Showcase** — Record projects with technologies used, links, and dates
- **Certifications** — Track certifications with issuer, domain, and credential IDs
- **Internship Experience** — Log internships with company, role, skills gained, and dates
- **Career Selection** — Choose from 7 target careers:
  - Data Analyst
  - Data Scientist
  - Software Developer
  - Machine Learning Engineer
  - Cybersecurity Analyst
  - UI/UX Designer
  - Product Manager
- **Skill Gap Analysis** — Compares your skills against career requirements:
  - **Matched** — You meet or exceed the required proficiency
  - **Partial** — You have the skill but below the required level
  - **Missing** — You don't have the skill yet
- **Career Readiness Score** — A score out of 100 based on how many required skills you fully meet
- **Recommendations** — Actionable suggestions to bridge identified skill gaps

## Tech Stack

| Component   | Technology              |
|-------------|------------------------|
| Frontend    | React.js + TypeScript  |
| Styling     | Tailwind CSS           |
| Icons       | Lucide React           |
| Backend     | Supabase (PostgreSQL)  |
| Build Tool  | Vite                   |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skilltab.git
cd skilltab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Add your Supabase project URL and anon key to `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the database migration:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20261008093929_create_skilltab_schema.sql`
   - Run the query

5. Start the development server:
```bash
npm run dev
```

6. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

```bash
npm run build
npm run preview
```

## Database Schema

The application uses 5 tables in PostgreSQL:

- **profiles** — Student personal & academic info, target career selection
- **skills** — Technical and soft skills with proficiency levels (1-5)
- **projects** — Project entries with technologies, links, and dates
- **certifications** — Certifications with issuer, domain, and credential info
- **internships** — Internship records with company, role, and skills gained

All tables use Row Level Security (RLS) with public read/write policies (single-tenant demo app).

## How the Readiness Score Works

1. The student selects a target career (e.g., "Data Scientist")
2. The system has a predefined list of required skills with minimum proficiency levels for each career
3. It compares the student's current skills against the requirements:
   - **Matched**: Student's proficiency ≥ required level
   - **Partial**: Student has the skill but below the required level
   - **Missing**: Student doesn't have the skill
4. Readiness Score = (Matched Skills / Total Required Skills) × 100
5. Recommendations are generated for partial and missing skills

## Project Structure

```
src/
├── App.tsx                  # Main app component with routing
├── main.tsx                 # React entry point
├── index.css                # Tailwind CSS imports
├── lib/
│   ├── supabase.ts          # Supabase client & TypeScript types
│   ├── careers.ts           # Career definitions with required skills
│   ├── useProfileData.ts    # Custom hook for data loading
│   └── analysis.ts          # Skill gap analysis engine
└── components/
    ├── Sidebar.tsx          # Navigation sidebar
    ├── ui.tsx               # Reusable UI components (Button, Input, Modal, etc.)
    ├── Dashboard.tsx        # Overview dashboard
    ├── ProfilePage.tsx      # Personal & academic info form
    ├── SkillsPage.tsx       # Skills management with proficiency
    ├── ProjectsPage.tsx     # Project showcase
    ├── CertificationsPage.tsx # Certification tracker
    ├── InternshipsPage.tsx  # Internship records
    └── AnalysisPage.tsx     # Career analysis & readiness score
```

## License

This project is licensed under the MIT License.
