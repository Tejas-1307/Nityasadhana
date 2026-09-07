from email.message import EmailMessage
import smtplib

from app.core.config import get_settings


class EmailService:
    def send_password_reset(self, recipient: str, reset_url: str) -> None:
        settings = get_settings()
        if not all((settings.smtp_host, settings.smtp_username, settings.smtp_password, settings.smtp_sender)):
            return
        message = EmailMessage()
        message["Subject"] = "Reset your Nityasadhana password"
        message["From"] = settings.smtp_sender
        message["To"] = recipient
        message.set_content(f"Reset your password: {reset_url}")
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
            smtp.starttls()
            smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)


email_service = EmailService()
