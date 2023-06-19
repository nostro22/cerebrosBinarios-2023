import { TestBed } from '@angular/core/testing';

import { EncuestaEmpleadoGuard } from './encuesta-empleado.guard';

describe('EncuestaEmpleadoGuard', () => {
  let guard: EncuestaEmpleadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EncuestaEmpleadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
