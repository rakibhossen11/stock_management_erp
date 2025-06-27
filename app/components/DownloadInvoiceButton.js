// components/DownloadInvoiceButton.js
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import InvoicePDF from './InvoicePDF';

const DownloadInvoiceButton = ({ invoice }) => {
    console.log({ invoice });
  return (
    <PDFDownloadLink 
      document={<InvoicePDF invoice={invoice} />} 
      fileName={`invoice_${invoice.invoiceNumber}.pdf`}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
    >
      {({ loading }) => (
        loading ? 'Generating PDF...' : (
          <>
            <FiDownload /> Download PDF
          </>
        )
      )}
    </PDFDownloadLink>
  );
};

export default DownloadInvoiceButton;