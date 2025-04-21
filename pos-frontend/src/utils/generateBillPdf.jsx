import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateBillPdf = async (cart, totalPrice, paymentMethod, orderType) => {
  try {
    const pdf = new jsPDF();

    // Set font to Helvetica (default font)
    pdf.setFont("helvetica", "normal");

    // Add a border around the entire bill
    pdf.setLineWidth(1);  // Slightly thicker border
    pdf.rect(5, 5, 200, 287); // x, y, width, height

    // Add Restaurant Name
    pdf.setFontSize(18);
    pdf.text("Your Restaurant Name", 70, 20);

    // Invoice Details
    const now = new Date();
    const day = now.toLocaleDateString("en-GB", { weekday: "long" });
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-GB");

    pdf.setFontSize(12);
    pdf.text(`Bill No: INV-${Math.floor(100000 + Math.random() * 900000)}`, 10, 40);
    pdf.text(`Date: ${date} (${day})`, 140, 40);
    pdf.text(`Time: ${time}`, 140, 50);
    pdf.text(`Order Type: ${orderType}`, 10, 50);

    // Table Headers & Items with Enhanced Borders and Styling
    autoTable(pdf, {
      startY: 60,
      head: [["Dish Name", "Qty", "Price (₹)"]],
      body: cart.map((item) => [item.name, item.qty, `₹ ${item.price * item.qty}`]),
      theme: "grid",
      styles: {
        fontSize: 12,
        font: "helvetica",
        cellPadding: 5,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    let finalY = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(14);
    pdf.text(`Total: ₹ ${totalPrice}`, 10, finalY);
    pdf.text(`Payment Mode: ${paymentMethod}`, 10, finalY + 10);

    // "Thank You" Message
    pdf.setFontSize(16);
    pdf.text("Thank you for visiting us!", 55, finalY + 30);

    // Save the PDF
    pdf.save("Bill.pdf");

  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export default generateBillPdf;
