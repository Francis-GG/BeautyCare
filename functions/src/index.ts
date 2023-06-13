import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';

admin.initializeApp();

sgMail.setApiKey(functions.config().sendgrid.api_key);
export const sendAppointmentReminders = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = formatDate(tomorrow); // Format tomorrow's date as "DD-MM-YYYY"

    const snapshot = await admin
      .firestore()
      .collection('reservas')
      .where('fecha', '==', formattedTomorrow) // Match the formatted date string
      .get();

    snapshot.forEach((doc) => {
      const appointment = doc.data();

      const msg = {
        to: appointment.email, // User's email
        from: 'frai.gonzalez@duocuc.cl', // Your verified sender
        subject: 'Recordatorio cita',
        text: `Le recordamos que mañana tiene una cita a las: ${appointment.horaInicio}.`,
        html: `<strong>Le recordamos que mañana tiene una cita a las: ${appointment.horaInicio}.</strong>`,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent to', appointment.email);
        })
        .catch((error: any) => {
          console.error('Error sending email to', appointment.email, error);
        });
    });

    return null; // Cloud functions should return a value
  });

// Helper function to format the date as "DD-MM-YYYY"
function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-based
  const year = date.getFullYear();

  const formattedDate = `${day.toString().padStart(2, '0')}-${month
    .toString()
    .padStart(2, '0')}-${year.toString()}`;

  return formattedDate;
}
