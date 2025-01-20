module.exports = {
    host: process.env.SMTP_HOST,            // The SMTP server's hostname (e.g., smtp.gmail.com)
    port: process.env.SMTP_PORT,            // The port for the SMTP server (e.g., 465 for SSL, 587 for TLS)
    secure: true,                           // Whether the connection should use SSL/TLS (true means use SSL/TLS)
    auth: {
        user: process.env.SMTP_USER,        // SMTP username (e.g. email address)
        pass: process.env.SMTP_PASSWORD,    // SMTP password (e.g., the password or an app-specific password)
    },
}
