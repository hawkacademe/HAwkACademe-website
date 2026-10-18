// HAwk ACademe's own photos (from the institute, October 2026).
// Originals are in images/gallery/photo-N.jpg; `node tools/process-photos.mjs` makes the web copies in
// client/public/img/life (full size and -640 thumbnails).
// Used by the Home hero slideshow and photo cards. The Gallery page shows the copies uploaded to
// photo storage (npm run upload-own-photos), which can be managed in Admin › Gallery.

const photo = (n, category, alt) => ({
  id: `life-${n}`,
  url: `/img/life/photo-${n}.webp`,
  thumbUrl: `/img/life/photo-${n}-640.webp`,
  category, alt
});

export const LIFE_PHOTOS = [
  photo(15, 'Classroom', 'Students and a teacher in a HAwk ACademe classroom with a periodic table chart on the wall'),
  photo(7, 'Classroom', 'Students sitting with notes and books during a class at HAwk ACademe'),
  photo(2, 'Classroom', 'A HAwk ACademe teacher standing with three students in front of a whiteboard'),
  photo(14, 'Celebrations', 'A large HAwk ACademe batch celebrating together in the classroom'),
  photo(4, 'Celebrations', "Students with their teacher in front of a Happy Teachers' Day whiteboard"),
  photo(13, 'Celebrations', 'Students cheering and posing together during a celebration at HAwk ACademe'),
  photo(11, 'Classroom', 'A group of HAwk ACademe students with their teacher'),
  photo(3, 'Celebrations', 'Students presenting a handmade card to their teacher'),
  photo(5, 'Celebrations', "Students and teacher in a classroom decorated with balloons for Teachers' Day"),
  photo(8, 'Celebrations', "A HAwk ACademe teacher holding a framed photo gift from students, with chemistry equations on the board"),
  photo(12, 'Classroom', 'A batch of HAwk ACademe students posing in their classroom'),
  photo(6, 'Celebrations', 'Students taking a selfie with their teacher, holding gifts'),
  photo(9, 'Classroom', 'Students standing with their teacher in a HAwk ACademe classroom'),
  photo(1, 'Classroom', 'A group of students in a bright HAwk ACademe classroom'),
  photo(10, 'Celebrations', 'Students with a teacher holding a cake in the classroom'),
  photo(16, 'Classroom', 'HAwk ACademe students standing together with their teachers in the classroom'),
  photo(17, 'Celebrations', 'Students crowding around their teacher as he receives a wrapped gift'),
  photo(18, 'Classroom', 'A HAwk ACademe batch posing together with their teacher in a bright classroom'),
  photo(19, 'Celebrations', 'A teacher taking a selfie with his students in a classroom decorated with bunting'),
  photo(20, 'Celebrations', 'Students and their teacher in a classroom decorated with balloons and a banner'),
  photo(21, 'Celebrations', 'Students holding gifts with their teachers at a HAwk ACademe celebration')
];

