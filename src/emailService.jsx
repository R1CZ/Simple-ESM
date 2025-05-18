// emailService.js
import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

export const sendEmail = async ({ to, subject, text }) => {
  try {
    const sendEmailFunction = httpsCallable(functions, 'sendEmail');
    await sendEmailFunction({
      to,
      subject,
      text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};