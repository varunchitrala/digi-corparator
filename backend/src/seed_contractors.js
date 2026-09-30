const mysql = require('mysql2/promise');

async function run() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'digital_corporator'
    });

    await conn.query(`
      INSERT INTO contractors (contractor_id, corporation_id, company_name, license_number, contact_person, phone, email, status)
      VALUES
        ('cnt-001', 'c-demo-001', 'Apex Infrastructure Pvt Ltd', 'PWD-LIC-2026-99', 'Suresh Deshmukh', '9822012345', 'contact@apexinfrastructure.com', 'ACTIVE'),
        ('cnt-002', 'c-demo-001', 'Marathwada Roadways & Constructions', 'PWD-LIC-2026-104', 'Ramesh Patil', '9822054321', 'ramesh@marathwadaroads.com', 'ACTIVE'),
        ('cnt-003', 'c-demo-001', 'Shivaji Electrical & Solar Works', 'ELE-LIC-2026-12', 'Ganesh Kadam', '9822099887', 'info@shivajelectrical.com', 'ACTIVE')
      ON DUPLICATE KEY UPDATE company_name = VALUES(company_name)
    `);

    console.log('Demo contractors seeded successfully!');
    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
