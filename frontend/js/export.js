/* =========================================================
   STUDENT MANAGEMENT SYSTEM - EXPORT UTILITIES (PDF & EXCEL)
   ========================================================= */

// Export HTML Table Data to Excel (.xlsx)
function exportTableToExcel(tableId, filename = 'Student_Data.xlsx') {
  const table = document.getElementById(tableId);
  if (!table) {
    showToast('Table not found for export', 'error');
    return;
  }

  try {
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, filename);
    showToast('Successfully exported data to Excel!', 'success');
  } catch (error) {
    console.error('Excel Export Error:', error);
    showToast('Error exporting to Excel. Make sure XLSX library is loaded.', 'error');
  }
}

// Export Report / Table to PDF
function exportToPDF(elementId, title = 'Student Report Card') {
  const element = document.getElementById(elementId);
  if (!element) {
    showToast('Element not found for PDF export', 'error');
    return;
  }

  showLoading();

  if (window.jspdf && window.html2canvas) {
    const { jsPDF } = window.jspdf;
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
      hideLoading();
      showToast('PDF Document generated successfully!', 'success');
    }).catch(err => {
      hideLoading();
      window.print();
    });
  } else {
    hideLoading();
    window.print();
  }
}
