import { RoadmapStep } from './types';
import { 
  Code2, 
  Palette, 
  Braces, 
  Atom, 
  Server, 
  Rocket, 
  Globe 
} from 'lucide-react';

export const INITIAL_ROADMAP: RoadmapStep[] = [
  {
    id: '1',
    title: 'HTML5 Semantic Structure',
    description: 'Master the backbone of the web. Learn semantic tags, accessibility (a11y), and SEO best practices.',
    duration: '1-2 Weeks',
    category: 'core',
    iconName: 'Globe'
  },
  {
    id: '2',
    title: 'CSS3 & Responsive Design',
    description: 'Style your world. Flexbox, Grid, animations, and responsive layouts using media queries.',
    duration: '3-4 Weeks',
    category: 'core',
    iconName: 'Palette'
  },
  {
    id: '3',
    title: 'JavaScript (ES6+)',
    description: 'The logic layer. Async/await, closures, DOM manipulation, and modern syntax features.',
    duration: '4-6 Weeks',
    category: 'core',
    iconName: 'Braces'
  },
  {
    id: '4',
    title: 'TypeScript',
    description: 'Scale safely. Static typing, interfaces, generics, and compiler configuration.',
    duration: '2-3 Weeks',
    category: 'tooling',
    iconName: 'Code2'
  },
  {
    id: '5',
    title: 'React.js Mastery',
    description: 'Component-based architecture. Hooks, Context API, state management, and lifecycle.',
    duration: '4-6 Weeks',
    category: 'advanced',
    iconName: 'Atom'
  },
  {
    id: '6',
    title: 'Next.js & Server Components',
    description: 'Full-stack power. SSR, ISR, App Router, and API routes for modern applications.',
    duration: '3-4 Weeks',
    category: 'advanced',
    iconName: 'Server'
  },
  {
    id: '7',
    title: 'Deployment & CI/CD',
    description: 'Go live. Vercel, Netlify, Docker basics, and automated testing pipelines.',
    duration: '1-2 Weeks',
    category: 'tooling',
    iconName: 'Rocket'
  }
];

export const ICON_MAP: Record<string, any> = {
  Code2,
  Palette,
  Braces,
  Atom,
  Server,
  Rocket,
  Globe
};

export const MOCK_ICONS = ['Globe', 'Palette', 'Braces', 'Code2', 'Atom', 'Server', 'Rocket'];