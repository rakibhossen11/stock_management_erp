// components/InvoicePDF.js
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register font (optional - you can use built-in fonts too)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2' }, // Regular
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2', fontWeight: 700 }, // Bold
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyInfo: {
    width: '40%',
  },
  invoiceInfo: {
    width: '40%',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  customerInfo: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    paddingVertical: 8,
  },
  col1: {
    width: '10%',
  },
  col2: {
    width: '40%',
  },
  col3: {
    width: '15%',
    textAlign: 'right',
  },
  col4: {
    width: '15%',
    textAlign: 'right',
  },
  col5: {
    width: '20%',
    textAlign: 'right',
  },
  totals: {
    marginTop: 20,
    width: '40%',
    marginLeft: 'auto',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    paddingTop: 5,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

const InvoicePDF = ({ invoice }) => {
  // Format dates
  const invoiceDate = format(new Date(invoice.date), 'MMM dd, yyyy');
  const dueDate = format(new Date(invoice.dueDate), 'MMM dd, yyyy');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>Your Company Name</Text>
            <Text>123 Business Street</Text>
            <Text>City, State 10001</Text>
            <Text>Phone: (123) 456-7890</Text>
            <Text>Email: info@yourcompany.com</Text>
          </View>
          
          <View style={styles.invoiceInfo}>
            <Text style={styles.subtitle}>INVOICE</Text>
            <Text>Invoice #: {invoice.invoiceNumber}</Text>
            <Text>Date: {invoiceDate}</Text>
            <Text>Due Date: {dueDate}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerInfo}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>BILL TO:</Text>
          <Text>{invoice.customer.name}</Text>
          <Text>{invoice.customer.email}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Description</Text>
            <Text style={styles.col3}>Unit Price</Text>
            <Text style={styles.col4}>Qty</Text>
            <Text style={styles.col5}>Amount</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{index + 1}</Text>
              <Text style={styles.col2}>{item.name} ({item.code})</Text>
              <Text style={styles.col3}>${item.price.toFixed(2)}</Text>
              <Text style={styles.col4}>{item.quantity}</Text>
              <Text style={styles.col5}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>${invoice.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
            <Text>${invoice.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>TOTAL:</Text>
            <Text>${invoice.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes and Terms */}
        {invoice.notes && (
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Terms:</Text>
          <Text>{invoice.terms}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;