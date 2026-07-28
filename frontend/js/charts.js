/* =========================================================
   STUDENT MANAGEMENT SYSTEM - DASHBOARD CHARTS (Chart.js)
   ========================================================= */

let genderChart, departmentChart, attendanceChart, gpaChart;

function initAdminCharts(statsData) {
  // Chart Colors (Gradient / Dark aware)
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#f8fafc' : '#1e293b';

  // 1. Gender Doughnut Chart (Boys vs Girls)
  const ctxGender = document.getElementById('genderChart');
  if (ctxGender) {
    if (genderChart) genderChart.destroy();
    genderChart = new Chart(ctxGender, {
      type: 'doughnut',
      data: {
        labels: ['Male Students', 'Female Students'],
        datasets: [{
          data: [statsData.totalMale || 65, statsData.totalFemale || 45],
          backgroundColor: ['#4f46e5', '#06b6d4'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Outfit' } } }
        },
        cutout: '70%'
      }
    });
  }

  // 2. Department Bar Chart
  const ctxDept = document.getElementById('departmentChart');
  if (ctxDept) {
    if (departmentChart) departmentChart.destroy();

    const deptLabels = statsData.departmentDistribution ? Object.keys(statsData.departmentDistribution) : ['CSE', 'ECE', 'MECH', 'CIVIL'];
    const deptCounts = statsData.departmentDistribution ? Object.values(statsData.departmentDistribution) : [45, 30, 20, 15];

    departmentChart = new Chart(ctxDept, {
      type: 'bar',
      data: {
        labels: deptLabels,
        datasets: [{
          label: 'Total Enrolled',
          data: deptCounts,
          backgroundColor: '#6366f1',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { ticks: { color: textColor }, grid: { color: 'rgba(150, 150, 150, 0.1)' } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
}

function initStudentAttendanceChart(attendancePercentage = 92) {
  const ctx = document.getElementById('studentAttendanceChart');
  if (!ctx) return;

  if (attendanceChart) attendanceChart.destroy();
  attendanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Attendance %',
        data: [95, 90, 88, 94, 96, 92, attendancePercentage],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 60, max: 100 }
      }
    }
  });
}
