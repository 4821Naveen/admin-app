
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generateInvoice(order: any) {
    // Fetch latest company details
    const companyRes = await fetch('/api/settings/company');
    const company = companyRes.ok ? await companyRes.json() : {};

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text(company.name || 'Company Name', 14, 22);

    doc.setFontSize(10);
    doc.text(company.address || '', 14, 30);
    doc.text(`Mobile: ${company.mobile || ''}`, 14, 35);
    doc.text(`GST: ${company.gstNumber || 'N/A'}`, 14, 40);

    // Invoice Details
    doc.text(`Invoice #: INV-${order.orderId}`, 140, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 35);
    if (order.dates?.packedDate) doc.text(`Packed: ${new Date(order.dates.packedDate).toLocaleDateString()}`, 140, 40);
    if (order.dates?.shippedDate) doc.text(`Shipped: ${new Date(order.dates.shippedDate).toLocaleDateString()}`, 140, 45);
    if (order.dates?.deliveredDate) doc.text(`Delivered: ${new Date(order.dates.deliveredDate).toLocaleDateString()}`, 140, 50);
    doc.text(`Customer: ${order.customer.name}`, 14, 45);
    doc.text(`Address: ${order.customer.address}`, 14, 50);

    // Table
    const tableColumn = ["Product", "Qty", "Price", "Total"];
    const tableRows: any[] = [];

    order.products.forEach((product: any) => {
        const productData = [
            product.name,
            product.quantity,
            `Rs ${product.price}`,
            `Rs ${product.price * product.quantity}`,
        ];
        tableRows.push(productData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total Amount: Rs ${order.totalAmount}`, 14, finalY);

    if (order.paymentStatus === 'refunded') {
        doc.setTextColor(255, 0, 0);
        doc.text(`REFUNDED`, 14, finalY + 10);
    }

    doc.save(`invoice_${order.orderId}.pdf`);
}
