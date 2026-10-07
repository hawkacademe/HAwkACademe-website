// Starting values for the editable site settings. Anything in [SQUARE BRACKETS] is a
// placeholder from the design concept and must be replaced with HAwk ACademe's real
// details before launch (Admin > Timings & highlights, or `npm run seed`).
export const DEFAULT_SETTINGS = {
  phone: '+91 98318 25207',
  whatsapp: '919831825207',
  email: 'hawkacademe@gmail.com',
  address: '56/G/1, Rammohan Pally, Nehali, Barasat, Kolkata, West Bengal 700124',
  mapsLink: '',
  mapEmbed: '',
  officeHours: [
    { days: 'Monday to Saturday', hours: '[OFFICE HOURS]' },
    { days: 'Sunday', hours: '[OPEN / CLOSED]' }
  ],
  responseTime: 'within [RESPONSE TIME]',
  enquiryEmail: '',
  social: { facebook: 'https://www.facebook.com/p/hawkacademe-100066454885536/', instagram: 'https://www.instagram.com/hawkacademe/', youtube: 'https://www.youtube.com/channel/UCHVaJRbj3YkqktpuOGEh7AQ', linkedin: '' },
  highlights: [
    { value: '5000+', label: 'Students Trained' },
    { value: '1000+', label: 'Selections in Top Institutes' },
    { value: '150+', label: 'Students in Top 500 (JEE)' },
    { value: '98%', label: 'Student Satisfaction' }
  ],
  programs: [
    { key: 'jee', name: 'JEE (Main & Advanced)', classes: 'Classes 11, 12 & droppers', duration: '[DURATION]', batchSize: '[BATCH SIZE]', mode: '[ONLINE / OFFLINE]', timings: '[BATCH TIMINGS]' },
    { key: 'neet', name: 'NEET (UG)', classes: 'Classes 11, 12 & droppers', duration: '[DURATION]', batchSize: '[BATCH SIZE]', mode: '[ONLINE / OFFLINE]', timings: '[BATCH TIMINGS]' },
    { key: 'foundation', name: 'Foundation Courses', classes: 'Classes 8, 9 & 10', duration: '[DURATION]', batchSize: '[BATCH SIZE]', mode: '[ONLINE / OFFLINE]', timings: '[BATCH TIMINGS]' },
    { key: 'integrated', name: 'Integrated Programs', classes: '[CLASSES]', duration: '[DURATION]', batchSize: '[BATCH SIZE]', mode: '[ONLINE / OFFLINE]', timings: '[BATCH TIMINGS]' }
  ]
};
