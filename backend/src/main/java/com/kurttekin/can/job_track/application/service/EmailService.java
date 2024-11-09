package com.kurttekin.can.job_track.application.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // * REFACTOR THIS: SHIFT RESPONSIBILITY TO FRONTEND
    @Value("${APP_URL:http://localhost:8080}")
    private String appUrl;

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String recipientEmail, String username, String token) {
        String subject = "Verify your email to create your ATSFS account\n";
        String confirmationUrl = appUrl + "/api/auth/verify?token=" + token; // * REFACTOR THIS: SHIFT RESPONSIBILITY TO FRONTEND
        //String message = "Click the link to verify your email: " + confirmationUrl;

        // HTML content for the email
        String htmlContent = buildHtmlContent(username, confirmationUrl);
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            //helper.setText(message, true);
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    // REFACTOR THIS LATER
    private String buildHtmlContent(String username, String confirmationUrl) {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <style>" +
                "        body {" +
                "            font-family: Arial, sans-serif;" +
                "            margin: 0;" +
                "            padding: 0;" +
                "            color: #333;" +
                "        }" +
                "        .email-container {" +
                "            width: 100%;" +
                "            max-width: 600px;" +
                "            margin: 0 auto;" +
                "            background-color: #fff;" +
                "            padding: 20px;" +
                "        }" +
                "        .email-header {" +
                "            text-align: left;" +
                "            margin-bottom: 20px;" +
                "        }" +
                "        .email-header h1 {" +
                "            color: #333;" +
                "        }" +
                "        .email-content {" +
                "            margin-bottom: 20px;" +
                "        }" +
                "        .verify-button {" +
                "            display: inline-block;" +
                "            background-color: black;" +
                "            color: white;" +
                "            padding: 10px 25px;" +
                "            text-decoration: none;" +
                "            border-radius: 5px;" +
                "            font-size: 16px;" +
                "            text-align: center;" +
                "            margin-top: 20px;" +
                "        }" +
                "        .verify-button:hover {" +
                "            background-color: #333;" +
                "        }" +
                "        .email-footer {" +
                "            font-size: 14px;" +
                "            color: #777;" +
                "            margin-top: 30px;" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"email-container\">" +
                "        <div class=\"email-header\">" +
                "            <h2>Verify your email address to use ATSFS</h2>" +
                "        </div>" +
                "        <div class=\"email-content\">" +
                "            <p>Hello <strong>" + username + "</strong>,</p>" +
                "            <p>Thank you for registering with us! Please verify your email address by clicking the button below:</p>" +
                "            <a href=\"" + confirmationUrl + "\" class=\"verify-button\">Verify Email</a>" +
                "        </div>" +
                "        <div class=\"email-footer\">" +
                "            <p>If you didn't register, please ignore this email.</p>" +
                "            <p>ATSFS</p>" +
                "            <p>https://atsfs.kurttekin.com/</p>" +
                "            <img src=\"https://github.com/cankurttekin/job-application-tracker/raw/main/assets/atsfs.png\" style=\"width:8%\">" +
                "            <div style=\"margin-right:5px;margin-bottom:2px\">Please do not reply directly to this email.</div>" +
                "            <a style=\"color:#838586;text-decoration:none\" href=\"https://atsfs.kurttekin.com/contact/\" target=\"_blank\">Contact Us</a> |" +
                "            <a style=\"color:#838586;text-decoration:none\" href=\"#\" target=\"_blank\">Legal Notices and Terms of Use</a> |" +
                "            <a style=\"color:#838586;text-decoration:none\" href=\"https://atsfs.kurttekin.com/legal/privacy/\" target=\"_blank\">Privacy Statement</a>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
