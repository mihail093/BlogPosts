import mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGYN_DOMAIN
});

export const sendEmail = async (to, subject, htmlContent) => {
    const data = {
        from: "striveBlog <noreply@yourdomain.com>",
        to,
        subject,
        html: htmlContent
    };
    try {
        const response = await mg.messages().send(data);
        console.log("Email inviata con successo", response);
        return response
    } catch (err) {
        console.error("Errore nell'invio della email", err);
        throw err
    }
}