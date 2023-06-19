import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChartsEncuestaClientesPage } from './charts-encuesta-clientes.page';

describe('ChartsEncuestaClientesPage', () => {
  let component: ChartsEncuestaClientesPage;
  let fixture: ComponentFixture<ChartsEncuestaClientesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsEncuestaClientesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsEncuestaClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
