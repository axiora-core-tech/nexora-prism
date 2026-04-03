/**
 * AI Service — Anthropic Claude API wrapper
 * Demo: client-side API calls. Production: server-side proxy (see PA.md §13.1).
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const getModel = () => (import.meta as any).env?.VITE_AI_MODEL || 'claude-sonnet-4-20250514';
const getKey = () => (import.meta as any).env?.VITE_ANTHROPIC_API_KEY || '';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Streaming chat for Luminary conversations */
export async function streamChat(
  systemPrompt: string,
  messages: ChatMessage[],
  onText?: (fullText: string) => void,
): Promise<string> {
  const key = getKey();
  if (!key) {
    const fallback = 'I\'m your Luminary — currently in demo mode. Configure your Anthropic API key in .env to enable live AI conversations.';
    onText?.(fallback);
    return fallback;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content_block_delta' && data.delta?.text) {
              fullText += data.delta.text;
              onText?.(fullText);
            }
          } catch { /* skip non-JSON lines */ }
        }
      }
    }
  }

  return fullText;
}

/** One-shot generation for Genesis parsing, Illuminations, Synthesis reports */
export async function generate(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = getKey();
  if (!key) {
    return 'AI generation requires an Anthropic API key. Configure VITE_ANTHROPIC_API_KEY in your .env file.';
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}

/** Generate Luminary system prompt with employee context */
export function buildLuminaryPrompt(employee: any, extracts: any[], recentConvos: any[]): string {
  return `You are Luminary, the AI manager in Nexora Prism. You are warm, professional, and adaptive.

Employee context:
- Name: ${employee.name}
- Role: ${employee.role}
- Department: ${employee.department}
- Performance Score: ${employee.performanceScore}/100
- Learning Progress: ${employee.learningProgress}%
- Motivation Score: ${employee.motivationScore}/100
- Wellbeing Score: ${employee.welfareScore}/100

${extracts.length > 0 ? `Key facts from past conversations:
${extracts.map(e => `- Blockers: ${e.ongoingBlockers.join(', ') || 'None'}
- Commitments: ${e.commitmentsMade.join(', ') || 'None'}
- Recent wins: ${e.winsNoted.join(', ') || 'None'}
- Concerns: ${e.concernsRaised.join(', ') || 'None'}`).join('\n')}` : ''}

${recentConvos.length > 0 ? `Recent conversation summaries:
${recentConvos.slice(0, 3).map(c => `- ${c.date}: ${c.aiSummary}`).join('\n')}` : ''}

Guidelines:
- Be concise and warm. Use the employee's first name.
- Reference specific context from their work and past conversations.
- If they seem stressed or overwhelmed, acknowledge it genuinely.
- Create action items when appropriate and note them clearly.
- Keep responses under 150 words for standup check-ins.`;
}
