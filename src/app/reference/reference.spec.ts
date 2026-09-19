import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reference } from './reference';

describe('Reference', () => {
  let component: Reference;
  let fixture: ComponentFixture<Reference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reference],
    }).compileComponents();

    fixture = TestBed.createComponent(Reference);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
