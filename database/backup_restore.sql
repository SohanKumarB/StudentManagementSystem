-- =========================================================
-- Student Management System Database Backup & Restore Guide
-- =========================================================

-- 1. BACKUP DATABASE COMMAND (Run from Command Prompt / Shell):
-- mysqldump -u root -p student_db > student_db_backup.sql

-- 2. RESTORE DATABASE COMMAND:
-- mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS student_db;"
-- mysql -u root -p student_db < student_db_backup.sql

-- 3. STORED PROCEDURE FOR AUTOMATED LOG PURGE (Optional Maintenance):
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS PurgeOldActivityLogs(IN days_old INT)
BEGIN
    DELETE FROM activity_logs WHERE timestamp < NOW() - INTERVAL days_old DAY;
END //
DELIMITER ;
