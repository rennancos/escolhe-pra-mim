const pool = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function exportUsersToCSV() {
  try {
    console.log('📤 Exporting users to CSV...');
    
    const [users] = await pool.query('SELECT id, name, email, created_at FROM users');
    
    if (users.length === 0) {
      console.log('⚠️ No users found to export.');
      return;
    }

    // Create CSV content manually
    const headers = 'id,name,email,created_at';
    const rows = users.map(user => {
      // Escape quotes and wrap strings in quotes if needed (simple CSV handling)
      const name = `"${user.name.replace(/"/g, '""')}"`;
      const email = `"${user.email}"`;
      const date = user.created_at ? user.created_at.toISOString() : '';
      return `${user.id},${name},${email},${date}`;
    });

    const csvContent = [headers, ...rows].join('\n');
    const filePath = path.join(__dirname, 'users_export.csv');

    fs.writeFileSync(filePath, csvContent);
    console.log(`✅ CSV saved to: ${filePath}`);

  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    pool.end();
  }
}

exportUsersToCSV();
