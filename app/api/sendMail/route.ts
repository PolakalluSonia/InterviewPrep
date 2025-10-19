import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email, name, date, time } = await req.json();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Interview Scheduler" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Interview Scheduled ✔️",
            html: `
        <p>Hi <b>${name}</b>,</p>
        <p>Your interview is scheduled on <b>${date}</b> at <b>${time}</b>.</p>
        <p>We will notify you with further updates.</p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("MAIL ERROR:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
