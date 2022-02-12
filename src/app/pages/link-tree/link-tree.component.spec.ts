import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkTreeComponent } from './link-tree.component';

describe('LinkTreeComponent', () => {
  let component: LinkTreeComponent;
  let fixture: ComponentFixture<LinkTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
