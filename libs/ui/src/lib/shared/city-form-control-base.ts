import { computed, signal, type Signal, type WritableSignal } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';

// Shared by CityInput/CitySelect/CityDatepicker — same ControlValueAccessor
// shape (value/disabled/touched signals, showError, the four CVA methods),
// three real consumers now, previously copy-pasted in each one (tracked in
// FUTURE-ENHANCEMENTS-DUE-TO-AI.md, now consolidated here).
//
// `defaultValue` is a constructor parameter, not a field initializer read
// from an abstract member — TypeScript disallows that (TS2715: an abstract
// property can't be accessed in the declaring class's own constructor,
// since native class-field init order would make it `undefined` at that
// point anyway). Each subclass passes its default explicitly via `super()`.
export abstract class CityFormControlBase<T> implements ControlValueAccessor {
  protected abstract errorMessage: Signal<string | null>;

  protected readonly value: WritableSignal<T>;
  protected readonly disabled = signal(false);
  protected readonly touched = signal(false);

  protected readonly showError = computed(() => this.touched() && !!this.errorMessage());

  private onChange: (value: T) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly defaultValue: T) {
    this.value = signal(defaultValue);
  }

  writeValue(value: T): void {
    this.value.set(value ?? this.defaultValue);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected emitChange(value: T): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
