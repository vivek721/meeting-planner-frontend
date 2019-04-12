import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MeetingCalanderComponent } from "./meeting-calander.component";

describe("MeetingCalanderComponent", () => {
  let component: MeetingCalanderComponent;
  let fixture: ComponentFixture<MeetingCalanderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingCalanderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCalanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
