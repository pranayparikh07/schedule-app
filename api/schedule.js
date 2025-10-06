export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { tuition_start, tuition_end, month } = req.body;

  const oct_dec_subjects = ["MAD", "CC", "CNS", "COA", "AI", "Physics", "Chemistry", "Maths", "English"];
  const jan_apr_subjects = ["Physics", "Chemistry", "Maths", "English"];
  const subjects = ["October","November","December"].includes(month) ? oct_dec_subjects : jan_apr_subjects;

  const weekDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const weeklySchedule = {};

  weekDays.forEach(day => {
    let schedule = [];

    schedule.push({ task: "Wake Up", start: "05:45", end: "06:30", note: "Get ready & breakfast" });
    schedule.push({ task: "College", start: "07:00", end: "13:15" });

    if(day !== "Sunday") {
      // Self-study before tuition
      const collegeEndMinutes = 13*60+15;
      const tuitionStartParts = tuition_start.split(":");
      const tuitionStartMinutes = parseInt(tuitionStartParts[0])*60 + parseInt(tuitionStartParts[1]);
      const studyStartMinutes = collegeEndMinutes + 30;

      if(studyStartMinutes < tuitionStartMinutes) {
        schedule.push({ task: "Self Study", start: minutesToTime(studyStartMinutes), end: tuition_start });
      }
      schedule.push({ task: "Tuition (DDCET)", start: tuition_start, end: tuition_end });
      const tuitionEndParts = tuition_end.split(":");
      const tuitionEndMinutes = parseInt(tuitionEndParts[0])*60 + parseInt(tuitionEndParts[1]);
      const eveningStudyStart = tuitionEndMinutes + 30;
      schedule.push({ task: "Evening Study/Revision", start: minutesToTime(eveningStudyStart), end: "21:00" });
    } else {
      // Sunday schedule
      schedule.push({ task: "Tuition (Morning)", start: "07:00", end: "09:00" });
      schedule.push({ task: "Self Study", start: "09:30", end: "11:00" });
      schedule.push({ task: "Sunday Test", start: "11:00", end: "13:30" });
      schedule.push({ task: "Lunch/Relax", start: "13:30", end: "14:30" });
      schedule.push({ task: "Evening Study", start: "14:30", end: "18:00" });
    }

    schedule.push({ task: "Dinner/Relax", start: "21:00", end: "22:00" });
    schedule.push({ task: "Sleep", start: "22:30", end: "05:45" });

    // Assign subjects round-robin to study slots
    const studySlots = schedule.filter(s => s.task.toLowerCase().includes("study"));
    studySlots.forEach((slot, idx) => {
      slot.subject = subjects[idx % subjects.length];
    });

    weeklySchedule[day] = schedule;
  });

  res.status(200).json({ weeklySchedule });
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes/60);
  const m = minutes%60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
}
