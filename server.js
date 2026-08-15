const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database('database.db');
const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@example.com',
        pass: process.env.EMAIL_PASS || 'your-email-password'
    }
});

const sendLoginNotification = async (email, role) => {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email notification skipped: EMAIL_HOST, EMAIL_USER, or EMAIL_PASS is not configured.');
        return;
    }

    const info = await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Login Notification from PharmaConnect AI',
        text: `A new login to PharmaConnect AI occurred using this email address (${email}) as ${role}. If this was not you, please secure your account.`,
        html: `<p>A new login to <strong>PharmaConnect AI</strong> occurred using this email address (<strong>${email}</strong>) as <strong>${role}</strong>.</p><p>If this was not you, please change your password or contact support immediately.</p>`
    });

    console.log('Login notification email sent:', info.messageId);
};

// Create schema
const schema = [
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        semester TEXT,
        students_count INTEGER DEFAULT 0,
        progress INTEGER DEFAULT 0,
        faculty_id INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        link TEXT,
        uploaded_at TEXT NOT NULL,
        faculty_id INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        due_date TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        faculty_id INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        faculty_id INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS doubts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        question TEXT NOT NULL,
        status TEXT NOT NULL,
        answer TEXT,
        created_at TEXT NOT NULL,
        faculty_id INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        faculty_id INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject TEXT NOT NULL,
        present INTEGER NOT NULL,
        total INTEGER NOT NULL,
        date TEXT NOT NULL,
        faculty_id INTEGER NOT NULL
    )`
];

schema.forEach(sql => db.prepare(sql).run());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'pharma-connect-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

const ensureFaculty = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'faculty') {
        return next();
    }
    res.status(403).json({ message: 'Access denied' });
};

const sendFacultyDashboard = (req, res) => {
    if (req.session.user.role !== 'faculty') {
        return res.redirect('/student-dashboard.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'faculty-dashboard.html'));
};

app.get('/faculty-dashboard.html', ensureAuthenticated, sendFacultyDashboard);
app.get('/student-dashboard.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

const studentPages = [
    '/ai-doubt-solver.html',
    '/study-materials.html',
    '/quiz.html',
    '/assignments.html',
    '/mock-tests.html',
    '/subjects.html',
    '/classes.html',
    '/community.html'
];

studentPages.forEach(page => {
    app.get(page, ensureAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', page.slice(1)));
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const insertDefaultFacultyData = (facultyId) => {
    const subjectData = [
        { name: 'Pharmaceutics I', semester: 'B.Pharm 3rd Semester', students_count: 42, progress: 78 },
        { name: 'Pharmaceutical Chemistry', semester: 'B.Pharm 2nd Semester', students_count: 38, progress: 65 },
        { name: 'Pharmacology I', semester: 'B.Pharm 3rd Semester', students_count: 24, progress: 70 },
        { name: 'Pharmaceutics Practical', semester: 'B.Pharm 3rd Semester', students_count: 24, progress: 80 }
    ];

    const classData = [
        { title: 'Pharmaceutics I', subject: 'Pharmaceutics I', date: '2025-05-15', start_time: '09:00', end_time: '09:50', location: 'Classroom 203', type: 'Offline' },
        { title: 'Pharmaceutical Chemistry', subject: 'Pharmaceutical Chemistry', date: '2025-05-15', start_time: '11:00', end_time: '11:50', location: 'Online Class', type: 'Online' },
        { title: 'Pharmaceutics Practical', subject: 'Pharmaceutics Practical', date: '2025-05-15', start_time: '14:00', end_time: '14:50', location: 'Lab 1', type: 'Practical' },
        { title: 'Doubt Solving Session', subject: 'Open Forum', date: '2025-05-15', start_time: '16:00', end_time: '16:30', location: 'Online', type: 'Online' }
    ];

    const materials = [
        { title: 'Micromeritics Properties.pdf', subject: 'Pharmaceutics I', link: 'https://example.com/micromeritics.pdf' },
        { title: 'Drug Synthesis Notes', subject: 'Pharmaceutical Chemistry', link: 'https://example.com/drug-synthesis.pdf' },
        { title: 'Pharmacology Overview Slides', subject: 'Pharmacology I', link: 'https://example.com/pharmacology-slides.pdf' }
    ];

    const assignments = [
        { title: 'Unit 2 Questions', subject: 'Pharmaceutics I', due_date: '2025-05-22', type: 'Assignment' },
        { title: 'Dosage Form Quiz', subject: 'Pharmaceutical Chemistry', due_date: '2025-05-25', type: 'Quiz' }
    ];

    const announcements = [
        { title: 'Internal Assessment Schedule', message: 'Internal assessment for all subjects will start from May 20, 2025.' },
        { title: 'Practicals File Submission', message: 'Submit your practical files before May 25, 2025.' }
    ];

    const doubts = [
        { student_name: 'Rahul Verma', subject: 'Pharmaceutics I', question: 'What is angle of repose?', status: 'Answered', answer: 'Angle of repose is the steepest angle at which material remains stable.', created_at: new Date().toISOString() },
        { student_name: 'Anjali Sharma', subject: 'Pharmaceutical Chemistry', question: 'Explain SN1 reaction with example', status: 'Answered', answer: 'SN1 is a two-step nucleophilic substitution mechanism with a carbocation intermediate.', created_at: new Date().toISOString() },
        { student_name: 'Neha Patel', subject: 'Pharmacology I', question: 'Difference between absorption and distribution?', status: 'Pending', answer: '', created_at: new Date().toISOString() },
        { student_name: 'Karan Patel', subject: 'Pharmaceutics Practical', question: 'What is Carr’s index?', status: 'Answered', answer: 'Carr’s index measures powder flow and compressibility.', created_at: new Date().toISOString() }
    ];

    db.prepare('INSERT INTO subjects (name, semester, students_count, progress, faculty_id) VALUES (?, ?, ?, ?, ?)')
        .run(subjectData[0].name, subjectData[0].semester, subjectData[0].students_count, subjectData[0].progress, facultyId);
    db.prepare('INSERT INTO subjects (name, semester, students_count, progress, faculty_id) VALUES (?, ?, ?, ?, ?)')
        .run(subjectData[1].name, subjectData[1].semester, subjectData[1].students_count, subjectData[1].progress, facultyId);
    db.prepare('INSERT INTO subjects (name, semester, students_count, progress, faculty_id) VALUES (?, ?, ?, ?, ?)')
        .run(subjectData[2].name, subjectData[2].semester, subjectData[2].students_count, subjectData[2].progress, facultyId);
    db.prepare('INSERT INTO subjects (name, semester, students_count, progress, faculty_id) VALUES (?, ?, ?, ?, ?)')
        .run(subjectData[3].name, subjectData[3].semester, subjectData[3].students_count, subjectData[3].progress, facultyId);

    classData.forEach(cls => {
        db.prepare('INSERT INTO classes (title, subject, date, start_time, end_time, location, type, faculty_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(cls.title, cls.subject, cls.date, cls.start_time, cls.end_time, cls.location, cls.type, facultyId);
    });

    materials.forEach(item => {
        db.prepare('INSERT INTO materials (title, subject, link, uploaded_at, faculty_id) VALUES (?, ?, ?, ?, ?)')
            .run(item.title, item.subject, item.link, new Date().toISOString(), facultyId);
    });

    assignments.forEach(item => {
        db.prepare('INSERT INTO assignments (title, subject, due_date, type, created_at, faculty_id) VALUES (?, ?, ?, ?, ?, ?)')
            .run(item.title, item.subject, item.due_date, item.type, new Date().toISOString(), facultyId);
    });

    announcements.forEach(item => {
        db.prepare('INSERT INTO announcements (title, message, created_at, faculty_id) VALUES (?, ?, ?, ?)')
            .run(item.title, item.message, new Date().toISOString(), facultyId);
    });

    doubts.forEach(item => {
        db.prepare('INSERT INTO doubts (student_name, subject, question, status, answer, created_at, faculty_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(item.student_name, item.subject, item.question, item.status, item.answer, item.created_at, facultyId);
    });
};

const formatShortDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

app.post('/api/register', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Sabhi fields required hain.' });
    }

    if (role === 'faculty' && !email.endsWith('.edu.in')) {
        return res.status(400).json({ message: 'Faculty ke liye .edu.in email hona zaruri hai.' });
    }

    try {
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Ye Email pehle se registered hai.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(email, hashedPassword, role);

        if (role === 'faculty') {
            insertDefaultFacultyData(result.lastInsertRowid);
        }

        res.status(201).json({ message: 'Registration successful! Redirecting to login...' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email, role);
        if (!user) {
            return res.status(400).json({ message: 'User nahi mila ya Role galat chuna hai.' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password galat hai.' });
        }

        req.session.user = { id: user.id, email: user.email, role: user.role };
        const redirectUrl = user.role === 'faculty' ? '/faculty-dashboard.html' : '/student-dashboard.html';

        sendLoginNotification(user.email, user.role).catch((emailErr) => {
            console.error('Login notification email failed:', emailErr);
        });

        res.status(200).json({ message: 'Login Successful', redirectUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred.' });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

app.get('/api/user', ensureAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

const getMockAIAnswer = (question) => {
    const q = question.toLowerCase();
    if (q.includes('dose') || q.includes('dosage')) {
        return 'Dosage depends on the drug, patient weight, and indication. Generally, always refer to the standard pharmacopeia dosing table and adjust for age, renal function, and contraindications. For example, paracetamol is usually 15 mg/kg per dose in children.';
    }
    if (q.includes('pharmacokinetics') || q.includes('absorption') || q.includes('distribution')) {
        return 'Pharmacokinetics describes how the body handles a drug through absorption, distribution, metabolism, and excretion. Absorption is how the drug enters the bloodstream, while distribution describes how it reaches tissues.';
    }
    if (q.includes('stability') || q.includes('shelf life')) {
        return 'Stability refers to how long a drug product maintains its identity, purity, and potency under specified storage conditions. Shelf life is the time period during which the drug remains within specifications.';
    }
    if (q.includes('adverse') || q.includes('side effect')) {
        return 'Adverse effects are unintended responses to a drug. Monitor patients carefully, counsel on common reactions, and manage supportively if they occur.\n\n- Identify severity and stop the drug if needed\n- Report serious reactions immediately\n- Use supportive therapy as indicated\n\nRelated topics: drug safety, pharmacovigilance, patient counselling';
    }
    return `Search result summary: ${question} can be approached by focusing on the key pharmacy principles behind the topic.\n\n- Review the core definition or mechanism first\n- Highlight the most relevant drug or process\n- Give a concise clinical or exam tip\n\nRelated topics: pharmacology overview, exam preparation, concept revision`;
};

app.post('/api/ai/solve', ensureAuthenticated, async (req, res) => {
    const { question } = req.body;
    if (!question || !question.trim()) {
        return res.status(400).json({ message: 'Question is required.' });
    }

    const prompt = `You are PharmaConnect AI. Answer like a Google Search result: first give a concise summary, then provide 2-3 brief bullet points, and finish with a short "Related topics" section when appropriate. Keep the response clear, direct, and helpful for pharmacy students. Question: ${question}`;

    try {
        if (process.env.OPENAI_API_KEY) {
            const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful study assistant for pharmacy students.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 450,
                    temperature: 0.7
                })
            });

            if (!openAIResponse.ok) {
                const errorText = await openAIResponse.text();
                console.error('OpenAI API error:', errorText);
                throw new Error('AI service error.');
            }

            const data = await openAIResponse.json();
            const answer = data.choices?.[0]?.message?.content?.trim();
            return res.json({ answer: answer || getMockAIAnswer(question), source: 'openai' });
        }

        const fallbackAnswer = getMockAIAnswer(question);
        return res.json({ answer: fallbackAnswer, source: 'local-demo' });
    } catch (err) {
        console.error('AI solve failed:', err);
        return res.status(500).json({ message: 'Unable to generate an answer at this time.' });
    }
});

app.get('/api/student/dashboard', ensureAuthenticated, (req, res) => {
    const user = req.session.user;
    const studentName = user.email.split('@')[0].replace('.', ' ');
    const semester = 'B.Pharm 3rd Sem';
    const subjects = db.prepare('SELECT name, semester, progress FROM subjects WHERE semester LIKE ? ORDER BY progress DESC LIMIT 4').all('%3rd Semester%');
    const assignments = db.prepare('SELECT title, subject, due_date FROM assignments WHERE due_date >= ? ORDER BY due_date ASC LIMIT 4').all(new Date().toISOString().slice(0, 10));
    const materials = db.prepare('SELECT title, subject, link FROM materials ORDER BY uploaded_at DESC LIMIT 4').all();
    const announcements = db.prepare('SELECT title, message, created_at FROM announcements ORDER BY created_at DESC LIMIT 3').all();
    const doubts = db.prepare('SELECT student_name, subject, question, status FROM doubts ORDER BY created_at DESC LIMIT 3').all();

    const upcomingTasks = assignments.length ? assignments.map(item => ({
        title: item.title,
        subject: item.subject,
        due: item.due_date
    })) : [
        { title: 'Pharmaceutics Assignment', subject: 'Pharmaceutics I', due: '2025-05-22' },
        { title: 'Pharmaceutical Chemistry Quiz', subject: 'Pharmaceutical Chemistry', due: '2025-05-25' }
    ];

    const defaultSubjects = subjects.length ? subjects : [
        { name: 'Pharmaceutics I', semester, progress: 80 },
        { name: 'Pharmaceutical Chemistry', semester, progress: 65 },
        { name: 'Pharmacology I', semester, progress: 70 },
        { name: 'Pharmacognosy', semester, progress: 60 }
    ];

    const recommended = materials.length ? materials.slice(0, 3).map((item, index) => ({
        title: item.title,
        subject: item.subject,
        type: ['PDF', 'Video', 'MCQs'][index] || 'Notes',
        author: ['Dr. Ramesh Verma', 'Dr. Anjali Sharma', 'Dr. Mohit Bansal'][index] || 'Dr. Priya Singh',
        rating: ['4.8', '4.7', '4.6'][index] || '4.5',
        reviews: ['4.7k', '890', '1.5k'][index] || '1.1k',
        link: item.link || '#'
    })) : [
        { title: 'Pharmaceutics I Notes', subject: 'Pharmaceutics I', type: 'PDF', author: 'Dr. Ramesh Verma', rating: '4.8', reviews: '4.7k', link: '#' },
        { title: 'Pharmaceutical Chemistry Reactions', subject: 'Pharmaceutical Chemistry', type: 'Video', author: 'Dr. Anjali Sharma', rating: '4.7', reviews: '890', link: '#' },
        { title: 'Pharmacology MCQs Practice Set - 2', subject: 'Pharmacology I', type: 'MCQs', author: 'Dr. Mohit Bansal', rating: '4.6', reviews: '1.5k', link: '#' }
    ];

    const activity = [
        { title: 'You solved a doubt on Hypertension', time: '2 min ago' },
        { title: 'You completed quiz on Pharmaceutical Chemistry', time: '1 hour ago' },
        { title: 'You downloaded Pharmaceutics I Notes', time: '3 hours ago' },
        { title: 'You attended live class on Pharmacology', time: 'Yesterday' }
    ];

    const leaderboard = [
        { name: 'Rahul Verma', score: '2500 XP' },
        { name: 'Anjali Sharma', score: '2300 XP' },
        { name: 'You (Vinay)', score: '2100 XP' },
        { name: 'Karan Patel', score: '1800 XP' },
        { name: 'Neha Singh', score: '1600 XP' }
    ];

    res.json({
        studentName,
        semester,
        metrics: {
            semester: '3rd',
            subjectsCount: defaultSubjects.length,
            overallProgress: 72,
            streak: 15
        },
        quickAccess: [],
        upcomingTasks,
        subjects: defaultSubjects,
        recommended,
        dailyGoals: {
            studyHours: '12.5 / 15 hrs',
            mcqsSolved: '45 / 60',
            topicsCompleted: '8 / 10'
        },
        activity,
        announcements: announcements.length ? announcements : [
            { title: 'GPAT 2025 Crash Course is Live!', message: 'Enroll now and get access to live classes, tests & study materials.', created_at: '2025-05-15' },
            { title: 'Live Session: Pharmaceutical Analysis', message: 'Join Dr. Priya Sharma tomorrow at 7:00 PM.', created_at: '2025-05-14' },
            { title: 'Quiz of the Week', message: 'Participate and win exciting rewards!', created_at: '2025-05-13' }
        ],
        leaderboard,
        profile: {
            name: studentName,
            semester,
            college: 'Delhi Pharmacy College',
            completion: '75%'
        }
    });
});

app.get('/api/faculty/dashboard', ensureAuthenticated, ensureFaculty, (req, res) => {
    const id = req.session.user.id;
    const now = new Date().toISOString().slice(0, 10);

    const totalClasses = db.prepare('SELECT COUNT(*) AS count FROM classes WHERE faculty_id = ?').get(id).count;
    const totalStudents = db.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('student').count;
    const materialsUploaded = db.prepare('SELECT COUNT(*) AS count FROM materials WHERE faculty_id = ?').get(id).count;
    const assignmentsActive = db.prepare('SELECT COUNT(*) AS count FROM assignments WHERE faculty_id = ? AND due_date >= ?').get(id, now).count;
    const doubtsAnswered = db.prepare('SELECT COUNT(*) AS count FROM doubts WHERE faculty_id = ? AND status = ?').get(id, 'Answered').count;

    const subjects = db.prepare('SELECT id, name, semester, students_count AS students, progress FROM subjects WHERE faculty_id = ?').all(id);
    const classes = db.prepare('SELECT title, subject, date, start_time, end_time, location, type FROM classes WHERE faculty_id = ? ORDER BY date, start_time LIMIT 5').all(id);
    const materials = db.prepare('SELECT title, subject, uploaded_at FROM materials WHERE faculty_id = ? ORDER BY uploaded_at DESC LIMIT 5').all(id);
    const assignments = db.prepare('SELECT title, subject, due_date FROM assignments WHERE faculty_id = ? ORDER BY created_at DESC LIMIT 5').all(id);
    const announcements = db.prepare('SELECT title, message, created_at FROM announcements WHERE faculty_id = ? ORDER BY created_at DESC LIMIT 5').all(id);
    const doubts = db.prepare('SELECT id, student_name, subject, question, status FROM doubts WHERE faculty_id = ? ORDER BY created_at DESC LIMIT 5').all(id);
    const attendanceRecords = db.prepare('SELECT subject, present, total, date FROM attendance WHERE faculty_id = ? ORDER BY date DESC LIMIT 5').all(id);

    const teachingOverview = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        classesConducted: [32, 29, 34, 31, 33, 32],
        attendanceAvg: [84, 87, 83, 88, 90, 87],
        doubtsAnswered: [18, 22, 17, 25, 21, 24]
    };

    const performance = {
        totalStudents,
        excellent: 38,
        good: 56,
        average: 24,
        poor: 10
    };

    const topStudents = [
        { rank: 1, name: 'Rahul Verma', score: '92%' },
        { rank: 2, name: 'Anjali Sharma', score: '89%' },
        { rank: 3, name: 'Vikram Singh', score: '87%' },
        { rank: 4, name: 'Neha Patel', score: '85%' },
        { rank: 5, name: 'Karan Patel', score: '84%' }
    ];

    const defaultSubjects = [
        { name: 'Pharmaceutics I', semester: 'B.Pharm 3rd Semester', students: 42, progress: 78 },
        { name: 'Pharmaceutical Chemistry', semester: 'B.Pharm 2nd Semester', students: 38, progress: 65 },
        { name: 'Pharmacology I', semester: 'B.Pharm 3rd Semester', students: 24, progress: 70 },
        { name: 'Pharmaceutics Practical', semester: 'B.Pharm 3rd Semester', students: 24, progress: 80 }
    ];

    res.json({
        welcomeName: req.session.user.email.split('@')[0].replace('.', ' '),
        metrics: {
            totalClasses,
            totalStudents,
            materialsUploaded,
            assignmentsActive,
            doubtsAnswered
        },
        teachingOverview,
        schedule: classes.length ? classes : [
            { title: 'Pharmaceutics I', subject: 'B.Pharm 3rd Semester', date: '2025-05-15', start_time: '09:00', end_time: '09:50', location: 'Classroom 203', type: 'Offline' },
            { title: 'Pharmaceutical Chemistry', subject: 'B.Pharm 2nd Semester', date: '2025-05-15', start_time: '11:00', end_time: '11:50', location: 'Online Class', type: 'Online' },
            { title: 'Pharmaceutics Practical', subject: 'B.Pharm 3rd Semester', date: '2025-05-15', start_time: '14:00', end_time: '14:50', location: 'Lab 1', type: 'Practical' },
            { title: 'Doubt Solving Session', subject: 'Open for All Students', date: '2025-05-15', start_time: '16:00', end_time: '16:30', location: 'Online', type: 'Online' }
        ],
        subjects: subjects.length ? subjects : defaultSubjects,
        materials: materials.length ? materials : [
            { title: 'Micromeritics Properties.pdf', subject: 'Pharmaceutics I', uploaded_at: new Date().toISOString() },
            { title: 'Unit 2 Questions', subject: 'Pharmaceutical Chemistry', uploaded_at: new Date().toISOString() }
        ],
        assignments: assignments.length ? assignments : [
            { title: 'Unit 2 Questions', subject: 'Pharmaceutics I', due_date: '2025-05-22' }
        ],
        announcements: announcements.length ? announcements : [
            { title: 'Internal Assessment Schedule', message: 'Internal assessment for all subjects will start from May 20, 2025.', created_at: new Date().toISOString() },
            { title: 'Practicals File Submission', message: 'Submit your practical files before May 25, 2025.', created_at: new Date().toISOString() }
        ],
        doubts: doubts.length ? doubts : [
            { id: 1, student_name: 'Rahul Verma', subject: 'Pharmaceutics I', question: 'What is angle of repose?', status: 'Answered' },
            { id: 2, student_name: 'Anjali Sharma', subject: 'Pharmaceutical Chemistry', question: 'Explain SN1 reaction with example', status: 'Answered' },
            { id: 3, student_name: 'Neha Patel', subject: 'Pharmacology I', question: 'Difference between absorption and distribution?', status: 'Pending' },
            { id: 4, student_name: 'Karan Patel', subject: 'Pharmaceutics Practical', question: 'What is Carr’s index?', status: 'Answered' }
        ],
        attendance: attendanceRecords
    });
});

app.post('/api/faculty/materials', ensureAuthenticated, ensureFaculty, (req, res) => {
    const { title, subject, link } = req.body;
    if (!title || !subject) {
        return res.status(400).json({ message: 'Title and subject are required.' });
    }

    db.prepare('INSERT INTO materials (title, subject, link, uploaded_at, faculty_id) VALUES (?, ?, ?, ?, ?)')
        .run(title, subject, link || '', new Date().toISOString(), req.session.user.id);

    res.json({ message: 'Material uploaded successfully.' });
});

app.post('/api/faculty/assignments', ensureAuthenticated, ensureFaculty, (req, res) => {
    const { title, subject, due_date, type } = req.body;
    if (!title || !subject || !due_date) {
        return res.status(400).json({ message: 'Title, subject and due date are required.' });
    }

    db.prepare('INSERT INTO assignments (title, subject, due_date, type, created_at, faculty_id) VALUES (?, ?, ?, ?, ?, ?)')
        .run(title, subject, due_date, type || 'Assignment', new Date().toISOString(), req.session.user.id);

    res.json({ message: `${type || 'Assignment'} created successfully.` });
});

app.post('/api/faculty/announcements', ensureAuthenticated, ensureFaculty, (req, res) => {
    const { title, message } = req.body;
    if (!title || !message) {
        return res.status(400).json({ message: 'Title and message are required.' });
    }

    db.prepare('INSERT INTO announcements (title, message, created_at, faculty_id) VALUES (?, ?, ?, ?)')
        .run(title, message, new Date().toISOString(), req.session.user.id);

    res.json({ message: 'Announcement posted successfully.' });
});

app.post('/api/faculty/attendance', ensureAuthenticated, ensureFaculty, (req, res) => {
    const { subject, present, total, date } = req.body;
    if (!subject || present == null || total == null || !date) {
        return res.status(400).json({ message: 'Subject, present, total and date are required.' });
    }

    db.prepare('INSERT INTO attendance (subject, present, total, date, faculty_id) VALUES (?, ?, ?, ?, ?)')
        .run(subject, parseInt(present, 10), parseInt(total, 10), date, req.session.user.id);

    res.json({ message: 'Attendance saved successfully.' });
});

app.post('/api/faculty/live-class', ensureAuthenticated, ensureFaculty, (req, res) => {
    const { title, subject, date, start_time, end_time, location, type } = req.body;
    if (!title || !subject || !date || !start_time || !end_time || !location || !type) {
        return res.status(400).json({ message: 'All live class fields are required.' });
    }

    db.prepare('INSERT INTO classes (title, subject, date, start_time, end_time, location, type, faculty_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(title, subject, date, start_time, end_time, location, type, req.session.user.id);

    res.json({ message: 'Live class scheduled successfully.' });
});

app.post('/api/faculty/doubts/answer', ensureAuthenticated, ensureFaculty, (req, res) => {
    const { id, answer } = req.body;
    if (!id || !answer) {
        return res.status(400).json({ message: 'Doubt id and answer are required.' });
    }

    const existing = db.prepare('SELECT * FROM doubts WHERE id = ? AND faculty_id = ?').get(id, req.session.user.id);
    if (!existing) {
        return res.status(404).json({ message: 'Doubt not found.' });
    }

    db.prepare('UPDATE doubts SET status = ?, answer = ? WHERE id = ?').run('Answered', answer, id);
    res.json({ message: 'Doubt answered successfully.' });
});

// Google Gemini AI Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { question, image } = req.body;

        if (!question && !image) {
            return res.status(400).json({ success: false, message: 'Question or image is required.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not configured. Using mock response.');
            return res.json({
                success: true,
                answer: getMockAIAnswer(question || 'Image analysis'),
                source: 'mock'
            });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let prompt = '';
        let messageParts = [];

        // Create system instruction
        const systemInstruction = `You are DobtWise AI, an expert educational assistant for students studying pharmacy, biology, chemistry, and other academic subjects. 
Your role is to:
- Answer academic questions clearly and comprehensively
- Explain concepts in simple, understandable language
- Provide real examples when applicable
- Help students understand difficult topics
- If an image is provided, analyze it and answer questions about it
- Always be helpful, encouraging, and professional

Format your responses clearly with bullet points where appropriate.`;

        // Handle text-only questions
        if (question && !image) {
            messageParts.push(question);
            prompt = question;
        }

        // Handle image with optional question
        if (image) {
            const base64Data = image.split(',')[1] || image;
            const imageData = {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg'
                }
            };

            messageParts.push(imageData);

            if (question) {
                messageParts.push(question);
                prompt = question;
            } else {
                messageParts.push('Please analyze this image and explain what you see. If it\'s from an academic subject, provide relevant information.');
                prompt = 'Image analysis requested';
            }
        }

        // Call Gemini API
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: messageParts
                }
            ],
            systemInstruction: systemInstruction,
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.7,
            }
        });

        const response = await result.response;
        const answer = response.text();

        res.json({
            success: true,
            answer: answer,
            source: 'gemini-1.5-flash'
        });

    } catch (error) {
        console.error('Chat API Error:', error);

        // Provide fallback response
        const fallbackAnswer = getMockAIAnswer(req.body.question || 'Your question');
        res.json({
            success: true,
            answer: fallbackAnswer,
            source: 'fallback'
        });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));