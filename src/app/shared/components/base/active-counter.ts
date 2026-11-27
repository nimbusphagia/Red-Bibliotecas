import { Component, input } from '@angular/core';

/** Contador sobre la esquina de un botón (el padre debe ser `relative`). */
@Component({
  selector: 'app-active-counter',
  host: {
    class:
      'pointer-events-none absolute -top-0.75 -right-1.5 rounded-full bg-accent-md px-2 py-px text-center text-[7px] font-semibold text-dark-1',
  },
  template: `{{ count() }}`,
})
export class ActiveCounter {
  readonly count = input.required<number>();
}
