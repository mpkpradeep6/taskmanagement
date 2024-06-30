import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get Tasks', () => {
    it('should return tasks', () => {
      service.getTasks();
      const testRequest = httpMock.expectOne(req => /tasks/i.test(req.url) && /get/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { tasks: [{ title: 'test' }] } });
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('get');
      httpMock.verify();
      service.tasks$.subscribe(value => expect(value).toBeTruthy());
      service.error$.subscribe(value => expect(value).toBeFalsy());

    });

    it('should notify error', () => {
      service.getTasks();
      const testRequest = httpMock.expectOne(req => /tasks/i.test(req.url) && /get/i.test(req.method));
      testRequest.flush({ errorCode: 1, response: { tasks: [] } });
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('get');
      httpMock.verify();
      service.tasks$.subscribe(value => expect(value.length).toBeFalsy());
      service.error$.subscribe(value => expect(value).toBeTruthy());
    });

    it('should return empty tasks', () => {
      service.getTasks();
      const testRequest = httpMock.expectOne(req => /tasks/i.test(req.url) && /get/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { } });
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('get');
      httpMock.verify();
      service.tasks$.subscribe(value => expect(value).toBeTruthy());
      service.error$.subscribe(value => expect(value).toBeFalsy());
    });
  });

  describe('Add Tasks', () => {
    it('should add tasks', () => {
      service.addTask({ title: 'Test', description: 'Test Desc', status: 'open' });
      const testRequest = httpMock.expectOne(req => /tasks\/add/i.test(req.url) && /post/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { status: 'SUCCESS' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('post');
      httpMock.verify();
      service.taskAction$.subscribe(value => expect(value.action).toEqual('add'));
      service.error$.subscribe(value => expect(value).toBeFalsy());
    });

    it('should notify error', () => {
      service.addTask({ title: 'Test', description: 'Test Desc', status: 'open' });
      const testRequest = httpMock.expectOne(req => /tasks\/add/i.test(req.url) && /post/i.test(req.method));
      testRequest.flush({ errorCode: 1, response: { status: 'FAILURE' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('post');
      httpMock.verify();
      service.taskAction$.subscribe(value => expect(value).toBeFalsy());
      service.error$.subscribe(value => expect(value).toBeTruthy());
    });
  });

  describe('Update Tasks', () => {
    it('should update tasks', () => {
      service.addTask({ title: 'Test', description: 'Test Desc', status: 'open' }, true);
      const testRequest = httpMock.expectOne(req => /tasks\/update/i.test(req.url) && /put/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { status: 'SUCCESS' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('put');
      httpMock.verify();
      service.taskAction$.subscribe(value => expect(value.action).toEqual('update'));
      service.error$.subscribe(value => expect(value).toBeFalsy());
    });

    it('should notify error', () => {
      service.addTask({ title: 'Test', description: 'Test Desc', status: 'open' }, true);
      const testRequest = httpMock.expectOne(req => /tasks\/update/i.test(req.url) && /put/i.test(req.method));
      testRequest.flush({ errorCode: 1, response: { status: 'FAILURE' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('put');
      httpMock.verify();
      service.taskAction$.subscribe(value => expect(value).toBeFalsy());
      service.error$.subscribe(value => expect(value).toBeTruthy());
    });
  });

  describe('Delete Tasks', () => {
    it('should delete tasks', () => {
      service.deleteTask(1);
      const testRequest = httpMock.expectOne(req => /tasks\/remove/i.test(req.url) && /delete/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { status: 'SUCCESS' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('delete');
      httpMock.verify();
      service.taskAction$.subscribe(value => expect(value.action).toEqual('remove'));
      service.error$.subscribe(value => expect(value).toBeFalsy());
    });

    it('should notify error', () => {
      service.deleteTask(2);
      const testRequest = httpMock.expectOne(req => /tasks\/remove/i.test(req.url) && /delete/i.test(req.method));
      testRequest.flush({ errorCode: 1, response: { status: 'FAILURE' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('delete');
      httpMock.verify();
      service.taskAction$.subscribe(value => expect(value).toBeFalsy());
      service.error$.subscribe(value => expect(value).toBeTruthy());
    });
  });

  describe('Login', () => {
    it('should create', () => {
      service.login({user: 'testuser123', password: 'Abc123*'}, true);
      const testRequest = httpMock.expectOne(req => /users\/create/i.test(req.url) && /post/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { status: 'SUCCESS' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('post');
      httpMock.verify();
      service.loginStatus$.subscribe(value => expect(value.action).toEqual('create'));
    });

    it('should login', () => {
      service.login({user: 'testuser123', password: 'Abc123*'}, false);
      let testRequest = httpMock.expectOne(req => /users\/login/i.test(req.url) && /post/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { status: 'SUCCESS' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('post');
      httpMock.verify();
      service.loginStatus$.subscribe(value => expect(value.action).toEqual('login'));

      service.logout({ user: 'testuser123', password: '' });
      testRequest = httpMock.expectOne(req => /logout/i.test(req.url) && /delete/i.test(req.method));
      testRequest.flush({ errorCode: 0, response: { status: 'SUCCESS' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('delete');
      httpMock.verify();
    });

    it('should handle error thrown', () => {
      service.login({user: 'testuser123', password: 'Abc123*'}, true);
      const testRequest = httpMock.expectOne(req => /users\/create/i.test(req.url) && /post/i.test(req.method));
      testRequest.error({ error: { errorMessage: 'Error Occurred' } }  as any as ProgressEvent);
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('post');
      httpMock.verify();
      service.loginStatus$.subscribe(value => expect(value.action).toEqual('create'));
    });

    it('should handle error code', () => {
      service.login({user: 'testuser123', password: 'Abc123*'});
      const testRequest = httpMock.expectOne(req => /users\/login/i.test(req.url) && /post/i.test(req.method));
      testRequest.flush({ errorCode: 1, response: { status: 'FAILURE' }});
      expect(testRequest.request.method.toLocaleLowerCase()).toEqual('post');
      httpMock.verify();
      service.loginStatus$.subscribe(value => expect(value.action).toEqual('login'));
    });
  });
});
