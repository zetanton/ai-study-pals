const { User } = require('../models/User');

async function generateStudentCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    code = Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const existing = await User.findOne({ where: { studentCode: code }});
    if (!existing) return code;
  } while (true);
}

module.exports = { generateStudentCode }; 