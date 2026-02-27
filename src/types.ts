export type LifecycleStep = 
  | 'idle' 
  | 'dns' 
  | 'tcp' 
  | 'tls' 
  | 'request' 
  | 'response' 
  | 'render' 
  | 'complete'
  // Advanced steps
  | 'client'
  | 'cdn'
  | 'waf'
  | 'lb'
  | 'api_gateway'
  | 'web_server'
  | 'app_server'
  | 'database'
  | 'cache'
  | 'browser_render';

export interface StepDetail {
  label: string;
  value: string;
}

export interface StepConfig {
  id: LifecycleStep;
  code: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  duration: number; // Base duration in ms
  details: StepDetail[];
}

export const STEPS: StepConfig[] = [
  {
    id: 'dns',
    code: 'DNS',
    label: 'DNS Lookup',
    description: 'typical: ~20ms',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-500',
    duration: 800,
    details: [
      { label: 'Browser checks cache', value: 'cached? no' },
      { label: 'OS resolver queried', value: 'asking system' },
      { label: 'Root nameserver', value: '.com' },
      { label: 'TLD nameserver', value: 'example.com' },
      { label: 'IP returned', value: '93.184.216.34' }
    ]
  },
  {
    id: 'tcp',
    code: 'TCP',
    label: 'TCP Handshake',
    description: 'typical: ~10ms',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
    duration: 600,
    details: [
      { label: 'SYN', value: 'client → server' },
      { label: 'SYN-ACK', value: 'server → client' },
      { label: 'ACK', value: 'client → server' },
      { label: 'Connection established', value: 'ready' }
    ]
  },
  {
    id: 'tls',
    code: 'TLS',
    label: 'TLS Handshake',
    description: 'typical: ~50ms',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-500',
    duration: 1000,
    details: [
      { label: 'Client Hello', value: 'TLS 1.3' },
      { label: 'Server Hello', value: 'Cipher Suite' },
      { label: 'Certificate', value: 'Valid' },
      { label: 'Key Exchange', value: 'ECDHE' },
      { label: 'Secure Session', value: 'Established' }
    ]
  },
  {
    id: 'request',
    code: 'REQ',
    label: 'HTTP Request',
    description: 'typical: ~1ms',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    duration: 400,
    details: [
      { label: 'Method', value: 'GET' },
      { label: 'Path', value: '/index.html' },
      { label: 'Headers', value: 'User-Agent, Cookie' },
      { label: 'State', value: 'Sent' }
    ]
  },
  {
    id: 'response',
    code: 'RES',
    label: 'HTTP Response',
    description: 'typical: ~50ms',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
    duration: 800,
    details: [
      { label: 'Status', value: '200 OK' },
      { label: 'Content-Type', value: 'text/html' },
      { label: 'Content-Encoding', value: 'gzip' },
      { label: 'Body', value: '14.2kb' }
    ]
  },
  {
    id: 'render',
    code: 'RND',
    label: 'Browser Render',
    description: 'typical: ~16ms',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500',
    borderColor: 'border-pink-500',
    duration: 1500,
    details: [
      { label: 'Parsing', value: 'HTML → DOM' },
      { label: 'Styles', value: 'CSS → CSSOM' },
      { label: 'Layout', value: 'Box Model' },
      { label: 'Paint', value: 'Pixels' }
    ]
  }
];
