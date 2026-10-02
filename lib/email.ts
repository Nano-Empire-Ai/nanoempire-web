import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { RecallReportPDF } from './pdf/RecallReportPDF';
import * as crypto from 'crypto';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(email: string, scanId: string, reportData: any) {
  try {
    // Cryptographic Seal (The Grand Synthesis proof)
    const rawData = JSON.stringify(reportData);
    const hash = crypto.createHash('sha256').update(rawData + scanId).digest('hex');

    // Generate the PDF binary on the server
    const pdfBuffer = await renderToBuffer(
      React.createElement(RecallReportPDF, { data: { ...reportData, scanId, hash } })
    );

    // Send via Resend
    const { data, error } = await resend.emails.send({
      from: 'RecallGuard <compliance@nanoempireai.com>', // Update with your verified domain
      to: email,
      subject: `Your RecallGuard Compliance Report (${scanId})`,
      html: `
        <h2>Your Compliance Report is Ready</h2>
        <p>Thank you for your purchase. Attached is your official RecallGuard Compliance Report.</p>
        <p><strong>Scan ID:</strong> ${scanId}</p>
        <p><strong>Verification Hash:</strong> ${hash}</p>
        <p>This document serves as proof of due diligence for your inventory screening. Please retain it for your records.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">RecallGuard by Nano Empire AI</p>
      `,
      attachments: [
        {
          filename: `RecallGuard_Report_${scanId}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('Failed to send email: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Email generation/send failed:', error);
    throw error;
  }
}
