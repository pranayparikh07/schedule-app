export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { day, month, college, collegeStart, collegeEnd, tuition_start, tuition_end } = req.body;

  const oct_dec_subjects = ["MAD", "CC", "CNS", "COA", "AI", "Physics", "Chemistry", "Maths", "English"];
  const jan_apr_subjects = ["Physics", "Chemistry", "Maths", "English"];
  const subjects = ["October","November","December"].includes(month) ? oct_dec_subjects : jan_apr_subjects;

  const schedule = [];

  schedule.push({ task: "Wake Up", start: "05:45 AM", end: "06:30 AM", note: "Get ready & breakfast" });

  if(day !== "Sunday") {
    // College
    if(college) {
      const start = collegeStart || "07:00";
      const end = collegeEnd || "13:15";
      schedule.push({ task: "College", start: convertTo12Hr(start), end: convertTo12Hr(end) });
    }

    // Tuition (optional)
    if(tuition_start && tuition_end) {
      const tuitionStartMinutes = toMinutes(tuition_start);
      const tuitionEndMinutes = toMinutes(tuition_end);

      // Self-study before tuition if college exists
      let studyStartMinutes = college ? toMinutes(collegeEnd || "13:15") + 30 : 6*60; // 6:00 AM if no college
      if(studyStartMinutes < tuitionStartMinutes) {
        schedule.push({ task: "Self Study", start: minutesTo12Hr(studyStartMinutes), end: convertTo12Hr(tuition_start) });
      }

      schedule.push({ task: "Tuition (DDCET)", start: convertTo12Hr(tuition_start), end: convertTo12Hr(tuition_end) });

      const eveningStudyStart = tuitionEndMinutes + 30;
      schedule.push({ task: "Evening Study/Revision", start: minutesTo12Hr(eveningStudyStart), end: "09:00 PM" });

    } else {
      // No tuition: study after college or from 6 AM if no college
      let studyStartMinutes = college ? toMinutes(collegeEnd || "13:15") + 30 : 6*60;
      schedule.push({ task: "Self Study", start: minutesTo12Hr(studyStartMinutes), end: "09:00 PM" });
    }
  } else {
    // Sunday schedule
    schedule.push({ task: "Tuition (Morning)", start: "07:00 AM", end: "09:00 AM" });
    schedule.push({ task: "Self Study", start: "09:30 AM", end: "11:00 AM" });
    schedule.push({ task: "Sunday Test", start: "11:00 AM", end: "01:30 PM" });
    schedule.push({ task: "Lunch/Relax", start: "01:30 PM", end: "02:30 PM" });
    schedule.push({ task: "Evening Study", start: "02:30 PM", end: "06:00 PM" });
  }

  schedule.push({ task: "Dinner/Relax", start: "09:00 PM", end: "10:00 PM" });
  schedule.push({ task: "Sleep", start: "10:30 PM", end: "05:45 AM" });

  // Assign subjects to study slots
  const studySlots = schedule.filter(s => s.task.toLowerCase().includes("study"));
  studySlots.forEach((slot, idx) => {
    slot.subject = subjects[idx % subjects.length];
  });

  res.status(200).json({ day, schedule });
}

// Helpers
function minutesTo12Hr(minutes) {
  const h = Math.floor(minutes/60);
  const m = minutes % 60;
  return convertTo12Hr(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`);
}

function convertTo12Hr(time24) {
  let [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if(h === 0) h = 12;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${ampm}`;
}

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h*60 + m;
}
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { day, month, college, collegeStart, collegeEnd, tuition_start, tuition_end } = req.body;

  const oct_dec_subjects = ["MAD", "CC", "CNS", "COA", "AI", "Physics", "Chemistry", "Maths", "English"];
  const jan_apr_subjects = ["Physics", "Chemistry", "Maths", "English"];
  const subjects = ["October","November","December"].includes(month) ? oct_dec_subjects : jan_apr_subjects;

  const schedule = [];

  schedule.push({ task: "Wake Up", start: "05:45 AM", end: "06:30 AM", note: "Get ready & breakfast" });

  if(day !== "Sunday") {
    // College
    if(college) {
      const start = collegeStart || "07:00";
      const end = collegeEnd || "13:15";
      schedule.push({ task: "College", start: convertTo12Hr(start), end: convertTo12Hr(end) });
    }

    // Tuition (optional)
    if(tuition_start && tuition_end) {
      const tuitionStartMinutes = toMinutes(tuition_start);
      const tuitionEndMinutes = toMinutes(tuition_end);

      // Self-study before tuition if college exists
      let studyStartMinutes = college ? toMinutes(collegeEnd || "13:15") + 30 : 6*60; // 6:00 AM if no college
      if(studyStartMinutes < tuitionStartMinutes) {
        schedule.push({ task: "Self Study", start: minutesTo12Hr(studyStartMinutes), end: convertTo12Hr(tuition_start) });
      }

      schedule.push({ task: "Tuition (DDCET)", start: convertTo12Hr(tuition_start), end: convertTo12Hr(tuition_end) });

      const eveningStudyStart = tuitionEndMinutes + 30;
      schedule.push({ task: "Evening Study/Revision", start: minutesTo12Hr(eveningStudyStart), end: "09:00 PM" });

    } else {
      // No tuition: study after college or from 6 AM if no college
      let studyStartMinutes = college ? toMinutes(collegeEnd || "13:15") + 30 : 6*60;
      schedule.push({ task: "Self Study", start: minutesTo12Hr(studyStartMinutes), end: "09:00 PM" });
    }
  } else {
    // Sunday schedule
    schedule.push({ task: "Tuition (Morning)", start: "07:00 AM", end: "09:00 AM" });
    schedule.push({ task: "Self Study", start: "09:30 AM", end: "11:00 AM" });
    schedule.push({ task: "Sunday Test", start: "11:00 AM", end: "01:30 PM" });
    schedule.push({ task: "Lunch/Relax", start: "01:30 PM", end: "02:30 PM" });
    schedule.push({ task: "Evening Study", start: "02:30 PM", end: "06:00 PM" });
  }

  schedule.push({ task: "Dinner/Relax", start: "09:00 PM", end: "10:00 PM" });
  schedule.push({ task: "Sleep", start: "10:30 PM", end: "05:45 AM" });

  // Assign subjects to study slots
  const studySlots = schedule.filter(s => s.task.toLowerCase().includes("study"));
  studySlots.forEach((slot, idx) => {
    slot.subject = subjects[idx % subjects.length];
  });

  res.status(200).json({ day, schedule });
}

// Helpers
function minutesTo12Hr(minutes) {
  const h = Math.floor(minutes/60);
  const m = minutes % 60;
  return convertTo12Hr(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`);
}

function convertTo12Hr(time24) {
  let [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if(h === 0) h = 12;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${ampm}`;
}

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h*60 + m;
}
