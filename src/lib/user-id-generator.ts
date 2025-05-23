import { v4 as uuidv4 } from 'uuid';

// Generate a unique customer ID for each user
export function generateCustomerId(): string {
  return uuidv4();
}

// Generate a unique agent identifier
export function generateAgentId(): string {
  const adjectives = ['swift', 'bright', 'clever', 'nimble', 'sharp', 'quick', 'smart', 'wise', 'keen', 'alert'];
  const animals = ['falcon', 'eagle', 'hawk', 'wolf', 'fox', 'tiger', 'lion', 'bear', 'deer', 'rabbit'];
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  
  return `${adjective}-${animal}-${randomSuffix}`;
}

// Generate MCP server URLs with unique identifiers
export function generateMCPUrls(userId?: string) {
  // Use the specific customerId for consistency
  const customerId = userId || '6f8e24b1-b63f-4683-9b6e-27ce82dd1f8e';
  const agentId = 'lakay-agent-default';
  
  return {
    gmail: `https://mcp.composio.dev/partner/composio/gmail?customerId=6f8e24b1-b63f-4683-9b6e-27ce82dd1f8e&agent=lakayAI`,
    textToPdf: `https://mcp.composio.dev/partner/composio/text_to_pdf?customerId=${customerId}&agent=lakayAI`,
    memory: `https://mcp.composio.dev/partner/composio/mem0?customerId=${customerId}&agent=lakayAI`,
    memoryO: `https://mcp.mem0.ai/memory?profile=${agentId}&key=${customerId}&client=lakayAI`,
    outlook: `https://mcp.composio.dev/partner/composio/outlook?customerId=${customerId}&agent=lakayAI`,
    sharePoint: `https://mcp.composio.dev/partner/composio/share_point?customerId=${customerId}&agent=lakayAI`,
    linkedin: `https://mcp.composio.dev/partner/composio/linkedin?customerId=${customerId}&agent=lakayAI`,
    youtube: `https://mcp.composio.dev/partner/composio/youtube?customerId=${customerId}&agent=lakayAI`,
    teams: `https://mcp.composio.dev/partner/composio/microsoft_teams?customerId=${customerId}&agent=lakayAI`,
    googleTasks: `https://mcp.composio.dev/partner/composio/googletasks?customerId=${customerId}&agent=lakayAI`,
    search: `https://mcp.composio.dev/partner/composio/composio_search?customerId=${customerId}&transport=sse&agent=lakayAI`,
    customerId,
    agentId
  };
}

// Store user's unique identifiers in localStorage
export function getUserIdentifiers(): { customerId: string; agentId: string } {
  // Always return consistent fallback values during SSR
  if (typeof window === 'undefined') {
    return {
      customerId: '6f8e24b1-b63f-4683-9b6e-27ce82dd1f8e',
      agentId: 'lakay-agent-default'
    };
  }

  const stored = localStorage.getItem('lakayAI_user_identifiers');
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored user identifiers, generating new ones');
    }
  }
  
  // Generate new identifiers only on client side
  const identifiers = {
    customerId: generateCustomerId(),
    agentId: generateAgentId()
  };
  
  localStorage.setItem('lakayAI_user_identifiers', JSON.stringify(identifiers));
  return identifiers;
}
