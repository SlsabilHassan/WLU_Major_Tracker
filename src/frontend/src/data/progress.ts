import { Requirement, CheckedState, CreditProgress } from '../types';
import { countAlternativePairs } from './tracks';

// Key used for a single course checkbox.
export const courseKey = (label: string, course: string) => `${label}::${course}`;

// Label a group's checkboxes live under, so keys stay unique across groups.
export const groupLabel = (reqLabel: string, gLabel: string) => `${reqLabel} — ${gLabel}`;

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** How many units (courses or credits) this requirement contributes to the total. */
export function requirementTotal(req: Requirement): number {
  switch (req.type) {
    case 'note':
      return 0;
    case 'credits':
      return req.credits || 0;
    case 'one_of':
      return 1;
    case 'n_of':
      return req.n || 0;
    case 'group': {
      const groups = req.groups || [];
      const sizes = groups.map(g => g.n ?? 1);
      const required = req.groupsRequired ?? groups.length;
      if (required >= groups.length) return sum(sizes);
      // student picks which areas to satisfy: cheapest valid combination
      return sum([...sizes].sort((a, b) => a - b).slice(0, required));
    }
    case 'all':
    default: {
      const courses = req.courses || [];
      // an "or" pair is one requirement, not two
      return courses.length - countAlternativePairs(courses);
    }
  }
}

/** How many of those units the student has satisfied. */
export function requirementCompleted(
  req: Requirement,
  checked: CheckedState,
  creditProgress: CreditProgress
): number {
  const total = requirementTotal(req);
  switch (req.type) {
    case 'note':
      return 0;
    case 'credits':
      return Math.min(creditProgress[req.label] || 0, total);
    case 'one_of':
      return (req.courses || []).some(c => checked[courseKey(req.label, c)]) ? 1 : 0;
    case 'n_of':
      return Math.min(
        (req.courses || []).filter(c => checked[courseKey(req.label, c)]).length,
        total
      );
    case 'group': {
      const groups = req.groups || [];
      const required = req.groupsRequired ?? groups.length;
      const done = groups
        .map(g => {
          const hit = g.courses.filter(c => checked[courseKey(groupLabel(req.label, g.label), c)]).length;
          return Math.min(hit, g.n ?? 1);
        })
        .sort((a, b) => b - a)
        .slice(0, required);
      return Math.min(sum(done), total);
    }
    case 'all':
    default:
      return Math.min(
        (req.courses || []).filter(c => checked[courseKey(req.label, c)]).length,
        total
      );
  }
}

/** "courses" unless the catalog stated the rule in credits. */
export const unitOf = (req: Requirement) => req.unit ?? 'courses';
