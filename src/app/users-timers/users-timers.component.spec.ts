import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTimersComponent } from './users-timers.component';

describe('UsersTimersComponent', () => {
  let component: UsersTimersComponent;
  let fixture: ComponentFixture<UsersTimersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTimersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTimersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
