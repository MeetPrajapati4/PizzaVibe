const { exec, execSync } = require('child_process');

/**
 * Automates starting XAMPP MySQL for Windows environments.
 * Checks if MySQL is already running before attempting to start.
 */
function startMySQL() {
    const mysqlPath = 'C:\\xampp\\mysql\\bin\\mysqld.exe';
    const clientPath = 'C:\\xampp\\mysql\\bin\\mysql.exe';
    const iniPath = 'C:\\xampp\\mysql\\bin\\my.ini';

    try {
        const stdout = execSync('tasklist /FI "IMAGENAME eq mysqld.exe" /NH').toString();
        
        if (!stdout.includes('mysqld.exe')) {
            console.log('🚀 Starting XAMPP MySQL...');
            const command = `start /B "" "${mysqlPath}" --defaults-file="${iniPath}" --standalone`;
            exec(command);
            console.log('⏳ Waiting for MySQL to initialize (5s)...');
            // Wait for MySQL to be ready
            execSync('powershell Start-Sleep -s 5');
        } else {
            console.log('✅ XAMPP MySQL is already running.');
        }

        // Ensure database exists
        console.log('🔍 Checking database "pizzavibe"...');
        try {
            execSync(`"${clientPath}" -u root -e "CREATE DATABASE IF NOT EXISTS pizzavibe;"`);
            console.log('✅ Database "pizzavibe" is ready.');
        } catch (dbError) {
            console.warn('⚠️  Could not automatically verify/create database "pizzavibe".');
            console.log('   Please ensure MySQL root has no password (default XAMPP) or create it manually.');
        }

    } catch (error) {
        console.error('❌ Error in MySQL automation:', error.message);
    }
}

startMySQL();
