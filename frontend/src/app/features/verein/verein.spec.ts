import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verein } from './verein';

describe('Verein', () => {
  let component: Verein;
  let fixture: ComponentFixture<Verein>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verein],
    }).compileComponents();

    fixture = TestBed.createComponent(Verein);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
