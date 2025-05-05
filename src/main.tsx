import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { mockRequest } from './utils/mockApi'

// Setup global frappe utilities
declare global {
  interface Window {
    csrf_token: string;
    frappe: {
      call: (method: string, args?: Record<string, any>) => Promise<any>;
      request: (options: RequestOptions) => Promise<any>;
    };
  }
}

// Define request options interface
interface RequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Create a request function similar to frappe-ui
const request = (options: RequestOptions) => {
  if (!options.url) {
    throw new Error('[request] options.url is required');
  }

  // Use mock API for development mode
  if (isDevelopment) {
    console.log('Using mock API in development mode');
    return mockRequest(options);
  }

  // Transform request
  const transformRequest = (opts: RequestOptions) => {
    let headers = Object.assign(
      {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Frappe-Site-Name': window.location.hostname,
      },
      opts.headers || {}
    );

    // Add CSRF token if available and not a template
    if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = window.csrf_token;
    }

    // Format URL for API methods
    let url = opts.url;
    if (!url.startsWith('/') && !url.startsWith('http')) {
      url = '/api/method/' + url;
    }

    return {
      ...opts,
      url,
      method: opts.method || 'POST',
      headers,
    };
  };

  // Apply request transformation
  const transformedOptions = transformRequest(options);

  // Prepare fetch parameters
  let url = transformedOptions.url;
  let body;

  if (transformedOptions.params) {
    if (transformedOptions.method === 'GET') {
      const params = new URLSearchParams();
      for (const key in transformedOptions.params) {
        params.append(key, transformedOptions.params[key]);
      }
      url = url + '?' + params.toString();
    } else {
      body = JSON.stringify(transformedOptions.params);
    }
  }

  // Make the request
  return fetch(url, {
    method: transformedOptions.method,
    headers: transformedOptions.headers,
    body,
  })
    .then(async (response) => {
      // Transform response
      if (response.ok) {
        const data = await response.json();

        if (data.docs) {
          return data;
        }

        if (data.exc) {
          try {
            console.groupCollapsed(url);
            console.log(options);
            const warning = JSON.parse(data.exc);
            for (const text of warning) {
              console.log(text);
            }
            console.groupEnd();
          } catch (e) {
            console.warn('Error printing debug messages', e);
          }
        }

        return data.message;
      } else {
        let errorResponse = await response.text();
        let error: any = {};
        let exception;

        try {
          error = JSON.parse(errorResponse);
        } catch (e) {
          // Ignore parsing errors
        }

        const errorParts = [
          [options.url, error.exc_type, error._error_message]
            .filter(Boolean)
            .join(' '),
        ];

        if (error.exc) {
          exception = error.exc;
          try {
            exception = JSON.parse(exception)[0];
          } catch (e) {
            // Ignore parsing errors
          }
        }

        const e: any = new Error(errorParts.join('\n'));
        e.exc_type = error.exc_type;
        e.exc = exception;
        e.response = response;
        e.status = response.status;
        e.messages = error._server_messages
          ? JSON.parse(error._server_messages)
          : [];
        e.messages = e.messages.concat(error.message);
        e.messages = e.messages.map((m: any) => {
          try {
            return JSON.parse(m).message;
          } catch (error) {
            return m;
          }
        });
        e.messages = e.messages.filter(Boolean);

        if (!e.messages.length) {
          e.messages = error._error_message
            ? [error._error_message]
            : ['Internal Server Error'];
        }

        options.onError?.(e);
        throw e;
      }
    })
    .catch((error) => {
      options.onError?.(error);
      throw error;
    });
};

// Define the frappe object with utility methods
window.frappe = {
  call: (method, args = {}) => {
    return request({
      url: method,
      method: 'POST',
      params: args
    });
  },
  request
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
