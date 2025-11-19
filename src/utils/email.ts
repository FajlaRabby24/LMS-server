import nodemailer from "nodemailer";

import config from "../config";

// email configuration interface
interface IEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// email retry config
interface IRetryConfig {
  maxReties: number;
  retryDelay: number;
  backofMultiplier: number;
}

// email options
interface IEmailOptions {
  retries?: number;
  priority?: "high" | "normal" | "low";
  tags?: string[];
}

// bulk email option
interface IbulkEmailOptions {
  batchSize?: number;
  delayBetweenBatches?: number;
  priority?: "high" | "normal" | "low";
}

// email result
interface IEamilResule {
  success: boolean;
  messageId?: string;
  error?: string;
}

// bulk email result
interface IBulkEmailResult {
  success: boolean;
  failed: number;
  results: Array<{ to: string; success: boolean; error?: string }>;
}

// email data
interface IEmailData {
  to: string;
  subject: string;
  templatesName: string;
  data: object;
}

// get email configuratoin
const getEmailConfig = (): IEmailConfig => {
  const port = Number(config.smtp_port) || 587;
  const secureEnv = config.smtp_secure;
  const secure =
    typeof secureEnv === "string"
      ? secureEnv === "true" || secureEnv === "1"
      : port === 465;

  return {
    host: config.smtp_host || "smtp.gmail.com",
    port,
    secure,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
    from: config.smtp_from || "noreply@fajlarabbyla24.com",
  };
};

const getRetryConfig = (): IRetryConfig => ({
  maxReties: 3,
  retryDelay: 1000,
  backofMultiplier: 2,
});

// create email tranporter
const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
};

// verify email configuration
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email service verifyed");
    return true;
  } catch (error) {
    console.error(`Email service connection failed: ${error}`);
    return false;
  }
};

// 2:41

// send email with backward compatibility function
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: object
) => {};
