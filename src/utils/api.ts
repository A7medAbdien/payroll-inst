import { useState, useEffect } from 'react';

// API utility file that provides a similar pattern to frappe-ui's createResource

interface ResourceOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  auto?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  transform?: (data: any) => any;
  makeParams?: () => Record<string, any>;
}

export interface Resource<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetch: () => Promise<T>;
  reload: () => Promise<T>;
  submit: (params?: Record<string, any>) => Promise<T>;
}

export function createResource<T = any>(options: ResourceOptions): Resource<T> {
  // Create state with React's useState
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Method to fetch data from the API
  const fetch = async (): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const params = options.makeParams ? options.makeParams() : options.params;

      const responseData = await window.frappe.request({
        url: options.url,
        method: options.method || 'GET',
        params,
        onError: options.onError,
      });

      const transformedData = options.transform ? options.transform(responseData) : responseData;
      setData(transformedData);

      if (options.onSuccess) {
        options.onSuccess(transformedData);
      }

      return transformedData;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Method to submit data to the API
  const submit = async (params?: Record<string, any>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const combinedParams = {
        ...(options.params || {}),
        ...(params || {})
      };

      const responseData = await window.frappe.request({
        url: options.url,
        method: options.method || 'POST',
        params: combinedParams,
        onError: options.onError,
      });

      const transformedData = options.transform ? options.transform(responseData) : responseData;
      setData(transformedData);

      if (options.onSuccess) {
        options.onSuccess(transformedData);
      }

      return transformedData;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if enabled
  useEffect(() => {
    if (options.auto) {
      fetch().catch(() => {
        // Errors are already handled in fetch
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  // Create the resource object
  const resource: Resource<T> = {
    data,
    loading,
    error,
    fetch,
    reload: fetch,
    submit,
  };

  return resource;
}

export function createListResource<T = any>(options: ResourceOptions & {
  doctype: string;
  fields?: string[];
  filters?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  pageLength?: number;
}): Resource<T[]> {
  const { doctype, fields, filters, orderBy, limit, pageLength, ...rest } = options;

  const listOptions: ResourceOptions = {
    ...rest,
    url: 'frappe.desk.reportview.get_list',
    makeParams: () => ({
      doctype,
      fields: fields ? JSON.stringify(fields) : undefined,
      filters: filters ? JSON.stringify(filters) : undefined,
      order_by: orderBy,
      limit: limit,
      page_length: pageLength || 20,
      ...(options.makeParams ? options.makeParams() : {}),
    }),
  };

  return createResource<T[]>(listOptions);
}

export function createDocumentResource<T = any>(options: ResourceOptions & {
  doctype: string;
  name: string;
  setValue?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  };
}): Resource<T> & {
  setValue: (data: Partial<T>) => Promise<T>;
} {
  const { doctype, name, setValue, ...rest } = options;

  // Create the base resource using our updated createResource function
  const resource = createResource<T>({
    ...rest,
    url: 'frappe.client.get',
    makeParams: () => ({
      doctype,
      name,
      ...(options.makeParams ? options.makeParams() : {}),
    }),
  });

  // Add the setValue method
  const setValueFn = async (data: Partial<T>): Promise<T> => {
    const result = await window.frappe.request({
      url: 'frappe.client.set_value',
      method: 'POST',
      params: {
        doctype,
        name,
        fieldname: data,
      },
      onError: setValue?.onError,
    });

    if (setValue?.onSuccess) {
      setValue.onSuccess(result);
    }

    return result;
  };

  return {
    ...resource,
    setValue: setValueFn,
  };
}