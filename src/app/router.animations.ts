import { sequence, trigger, stagger, animate, style, group, query as q, transition, keyframes, animateChild } from '@angular/animations';
const query = (s, a, o = { optional: true }) => q(s, a, o);

export const introAnim = trigger(
	'introAnim',
	[
		transition(
			':enter', [
				style({ opacity: 0 }),
				animate('.5s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(0px)', opacity: 1 })),
			]
		),
		transition(
			':leave', [
				style({ 'opacity': 1 }),
				animate('.5s cubic-bezier(.75,-0.48,.26,1.52)', style({ transform: 'translateY(100px)', opacity: 0 })),
			],
		)]
)
