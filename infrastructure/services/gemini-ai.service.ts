import { aiKnowledgeBase } from '@/components/about/ai-knowledge-base';
import type { AiChatRequest, AiChatResponse } from '@/domain/dtos/ai-chat.dto';
import type { IAiService } from '@/domain/interfaces/ai-service.interface';

/**
 * Gemini AI service implementation
 */
export class GeminiAiService implements IAiService {
  private apiKey: string;
  private apiUrl: string;
  private maxRetries: number;
  private baseDelay: number;

  constructor(apiKey: string, apiUrl: string, maxRetries = 3, baseDelay = 1000) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  detectSchedulingIntent(message: string): boolean {
    const schedulingKeywords = [
      'schedule',
      'book',
      'meeting',
      'call',
      'consultation',
      'discuss',
      'talk',
      'appointment',
      'meet',
      'chat',
      'conversation',
      'project discussion',
    ];

    const lowerMessage = message.toLowerCase();
    return schedulingKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  async generateResponse(request: AiChatRequest): Promise<AiChatResponse> {
    const hasSchedulingIntent = this.detectSchedulingIntent(request.message);
    const prompt = this.buildPrompt(request.message, hasSchedulingIntent);

    try {
      const data = await this.makeRequest(prompt);
      const aiMessage =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response at this time.";

      return {
        message: aiMessage,
        shouldScheduleMeeting: hasSchedulingIntent,
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'AI_SERVICE_OVERLOADED') {
        return {
          message:
            "I'm experiencing high traffic right now and can't respond immediately. Please try again in a few moments, or feel free to reach out to me directly at achievafuturagemilang@gmail.com. I'll be happy to help you! 😊",
          shouldScheduleMeeting: hasSchedulingIntent,
        };
      }

      throw new Error(
        `AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private buildPrompt(userMessage: string, hasSchedulingIntent: boolean): string {
    const schedulingContext = hasSchedulingIntent
      ? `
IMPORTANT SCHEDULING CONTEXT:
If the user wants to schedule a meeting, please direct them to use Cip's Google Calendar Appointment page for booking: https://calendar.app.google/cEJRExr9jLsgHj469

When scheduling intent is detected, you should:
1. Acknowledge their interest in scheduling
2. Mention that you use Google Calendar for booking
3. Provide the Google Calendar Appointment link (https://calendar.app.google/cEJRExr9jLsgHj469)
4. Keep the response conversational and helpful
`
      : '';

    return `
Your name is AchI. You are Achieva Futura Gemilang's friendly and professional AI assistant for his personal portfolio website. Achieva Futura Gemilang often called by Cip. You can answer questions based on the following comprehensive knowledge base about Cip's professional life, background, and services. If a question is not covered, politely say, "Sorry, I did not find any information about that in my knowledge base. Is there anything else I can help you with?" 
Your responses should be conversational, concise, helpful, and professional.

${schedulingContext}

Knowledge Base:
Professional Summary: ${aiKnowledgeBase.professionalSummary}

Achieva Futura Gemilang's Nicknames: ${aiKnowledgeBase.nicknames.join(', ')}

Services Offered:
${aiKnowledgeBase.services
  .map(
    (service) => `
- **${service.name}**: ${service.description}
  Technologies: ${service.technologies?.join(', ') || 'Various technologies'}
  Examples: ${service.examples?.join(', ') || 'Custom solutions'}
  Areas: ${service.areas?.join(', ') || 'Various areas'}
`
  )
  .join('')}

Pricing Models:
${aiKnowledgeBase.pricing.models
  .map(
    (model) => `
- **${model.type}**: ${model.description}
  Best for: ${model.bestFor}
  Advantages: ${model.advantages.join(', ')}
`
  )
  .join('')}
Pricing Note: ${aiKnowledgeBase.pricing.note}

Process:
${aiKnowledgeBase.process.phases
  .map(
    (phase) => `
- **${phase.name}**: ${phase.description}
  Deliverables: ${phase.deliverables.join(', ')}
`
  )
  .join('')}
Methodology: ${aiKnowledgeBase.process.methodology}

Frequently Asked Questions:
${aiKnowledgeBase.faqs
  .map(
    (faq) => `
**Q: ${faq.question}**
A: ${faq.answer}
`
  )
  .join('')}

Achievements/Honors: ${aiKnowledgeBase.honors.join(', ')}

Skills: ${aiKnowledgeBase.skills.join(', ')}

Top Skills: ${aiKnowledgeBase.topSkills.join(', ')}

Work Experience: ${aiKnowledgeBase.workExperience
      .map(
        (exp) =>
          `\n- **${exp.role}** at ${exp.company} (${exp.period}): ${exp.responsibilities.join(
            '; '
          )} Impact: ${exp.impact?.join('; ') || ''}`
      )
      .join('')}

Projects: ${aiKnowledgeBase.projects
      .map(
        (p) =>
          `\n- **${p.name}**: ${p.description} (Role: ${p.role}, Tech: ${p.tech.join(', ')}, Link: ${
            p.link
          })`
      )
      .join('')}

Education: ${aiKnowledgeBase.education
      .map(
        (e) =>
          `\n- **${e.degree}** at ${e.institution} (${e.period})${
            e.achievements ? ', Achievements: ' + e.achievements.join('; ') : ''
          }`
      )
      .join('')}

Contact: Email: ${aiKnowledgeBase.contact.email}, LinkedIn: ${aiKnowledgeBase.contact.linkedin}, Instagram: ${aiKnowledgeBase.contact.instagram}

Fun Facts: ${aiKnowledgeBase.funFacts.join(', ')}

Languages: ${aiKnowledgeBase.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}

Personal Interests: ${aiKnowledgeBase.interests.join(', ')}

User: ${userMessage}

Instructions:
1. Provide helpful, accurate responses based on the knowledge base
2. Be conversational and professional
3. If the user wants to schedule a meeting, book a call, or discuss their project, respond naturally but indicate scheduling intent
4. Keep responses concise but informative
5. If asked about services, highlight the most relevant ones based on the user's needs
6. If asked about pricing, explain the different models and suggest scheduling a consultation
7. When scheduling intent is detected, mention available time slots naturally in the conversation
8. Use **bold** and *italic* formatting to make responses more readable

AI:`;
  }

  private async makeRequest(prompt: string, retryCount = 0): Promise<any> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if it's a 503 overload error
        if (
          response.status === 503 ||
          errorData?.error?.status === 'UNAVAILABLE' ||
          errorData?.error?.message?.includes('overloaded')
        ) {
          if (retryCount < this.maxRetries) {
            // Exponential backoff: 1s, 2s, 4s
            const delayMs = this.baseDelay * Math.pow(2, retryCount);
            console.log(
              `Gemini API overloaded, retrying in ${delayMs}ms (attempt ${retryCount + 1}/${this.maxRetries})`
            );
            await this.delay(delayMs);
            return this.makeRequest(prompt, retryCount + 1);
          } else {
            throw new Error('AI_SERVICE_OVERLOADED');
          }
        }

        throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === 'AI_SERVICE_OVERLOADED') {
        throw error;
      }
      throw new Error(`Request failed: ${error}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}




