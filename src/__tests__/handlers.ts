import { http, HttpResponse } from 'msw';
import { createMockApiResponse, mockAppSettings, mockDashboardStats, mockEvents, mockUser } from '../../services/mockData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const handlers = [
  // Events endpoints
  http.get(`${API_BASE_URL}/v1/events`, () => {
    return HttpResponse.json(createMockApiResponse(mockEvents));
  }),

  http.get(`${API_BASE_URL}/v1/events/:id`, ({ params }) => {
    const event = mockEvents.find(e => e.id === parseInt(params.id as string));
    if (event) {
      return HttpResponse.json(createMockApiResponse(event));
    }
    return HttpResponse.json(createMockApiResponse(null, false, 'Event not found'), { status: 404 });
  }),

  http.post(`${API_BASE_URL}/v1/events`, async ({ request }) => {
    const newEvent = await request.json() as any;
    const event = {
      ...newEvent,
      id: Math.max(...mockEvents.map(e => e.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(createMockApiResponse(event), { status: 201 });
  }),

  // Analytics endpoints
  http.get(`${API_BASE_URL}/v1/analytics/dashboard`, () => {
    return HttpResponse.json(createMockApiResponse(mockDashboardStats));
  }),

  // User endpoints
  http.get(`${API_BASE_URL}/v1/user/profile`, () => {
    return HttpResponse.json(createMockApiResponse(mockUser));
  }),

  http.get(`${API_BASE_URL}/v1/user/settings`, () => {
    return HttpResponse.json(createMockApiResponse(mockAppSettings));
  }),

  // Auth endpoints
  http.post(`${API_BASE_URL}/v1/auth/login`, async ({ request }) => {
    const credentials = await request.json() as any;
    if (credentials.email && credentials.password) {
      return HttpResponse.json(createMockApiResponse({
        token: 'mock-jwt-token',
        user: mockUser
      }));
    }
    return HttpResponse.json(createMockApiResponse(null, false, 'Invalid credentials'), { status: 401 });
  }),
];
