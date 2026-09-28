const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const ENTRIES_FILE = path.join(__dirname, 'demo_entries.json');

// Ensure the entries file exists
if (!fs.existsSync(ENTRIES_FILE)) {
    fs.writeFileSync(ENTRIES_FILE, JSON.stringify([]));
}

app.post('/api/book-demo', (req, res) => {
    const { name, email, company, time } = req.body;
    
    if (!name || !email || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEntry = {
        id: Date.now().toString(),
        name,
        email,
        company: company || 'N/A',
        time,
        createdAt: new Date().toISOString()
    };

    try {
        const entries = JSON.parse(fs.readFileSync(ENTRIES_FILE, 'utf8'));
        entries.push(newEntry);
        fs.writeFileSync(ENTRIES_FILE, JSON.stringify(entries, null, 2));
        
        console.log(`[New Demo Request] from ${name} (${email}) for ${time}`);
        res.status(201).json({ message: 'Demo booked successfully' });
    } catch (err) {
        console.error('Error saving entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Demo entries are being saved locally to: ${ENTRIES_FILE}`);
    console.log('To host these entries in production, you have a few options:');
    console.log('1. Database: MongoDB, PostgreSQL, or SQLite');
    console.log('2. BaaS: Firebase, Supabase, or Appwrite');
    console.log('3. No-Code tools: Formspree, Google Sheets (via API), or Airtable');
});
