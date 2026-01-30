
import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: "GROQ_API_KEY not configured on server" },
                { status: 500 }
            );
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista em Copywriting para WhatsApp. Crie mensagens curtas, persuasivas e humanizadas para marketing. Use emojis moderadamente. O objetivo é vender ou engajar. Evite linguagem robótica. Responda APENAS com o texto da mensagem."
                },
                {
                    role: "user",
                    content: `Crie uma mensagem persuasiva sobre: ${prompt}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        const message = completion.choices[0]?.message?.content || "";

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Groq Error:", error);
        return NextResponse.json(
            { error: "Failed to generate text" },
            { status: 500 }
        );
    }
}
