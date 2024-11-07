import React from 'react'

const InvoiceList = ({ invoices }) => {
  return (
    <div>
      <h2>Uploaded Invoices</h2>
      <ul>
        {invoices.map((invoice, index) => (
          <li key={index}>{invoice.filename}</li>
        ))}
      </ul>
    </div>
  )
}

export default InvoiceList
