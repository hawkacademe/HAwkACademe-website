// Starting values for the editable site settings. Anything in [SQUARE BRACKETS] is a
// placeholder from the design concept and must be replaced with Hawk Academe's real
// details before launch (Admin > Timings & highlights, or `npm run seed`).
export const DEFAULT_SETTINGS = {
  phone: '+91 98765 43210 [PHONE]',
  whatsapp: '919876543210',
  email: 'info@hawkacademe.com',
  address: 'Salt Lake, Kolkata, WB, India [FULL ADDRESS]',
  mapsLink: '',
  mapEmbed: '',
  officeHours: [
    { days: 'Monday to Saturday', hours: '[OFFICE HOURS]' },
    { days: 'Sunday', hours: '[OPEN / CLOSED]' }
  ],
  responseTime: 'within [RESPONSE TIME]',
  enquiryEmail: '',
  social: { facebook: '', instagram: '', youtube: '', linkedin: '' },
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
