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
  // Default state
  let state = {
    data: null as T | null,
    loading: false,
    error: null as Error | null,
  };

  // Method to fetch data from the API
  const fetch = async (): Promise<T> => {
    state.loading = true;
    state.error = null;

    try {
      const params = options.makeParams ? options.makeParams() : options.params;

      const data = await window.frappe.request({
        url: options.url,
        method: options.method,
        params,
        onError: options.onError,
      });

      const transformedData = options.transform ? options.transform(data) : data;
      state.data = transformedData;

      if (options.onSuccess) {
        options.onSuccess(transformedData);
      }

      return transformedData;
    } catch (error) {
      state.error = error as Error;
      throw error;
    } finally {
      state.loading = false;
    }
  };

  // Method to submit data to the API
  const submit = async (params?: Record<string, any>): Promise<T> => {
    state.loading = true;
    state.error = null;

    try {
      const combinedParams = {
        ...(options.params || {}),
        ...(params || {})
      };

      const data = await window.frappe.request({
        url: options.url,
        method: options.method || 'POST',
        params: combinedParams,
        onError: options.onError,
      });

      const transformedData = options.transform ? options.transform(data) : data;
      state.data = transformedData;

      if (options.onSuccess) {
        options.onSuccess(transformedData);
      }

      return transformedData;
    } catch (error) {
      state.error = error as Error;
      throw error;
    } finally {
      state.loading = false;
    }
  };

  // Create the resource object
  const resource: Resource<T> = {
    get data() { return state.data; },
    get loading() { return state.loading; },
    get error() { return state.error; },
    fetch,
    reload: fetch,
    submit,
  };

  // Auto-fetch if enabled
  if (options.auto) {
    // Use setTimeout to ensure this runs after the component mounts
    setTimeout(() => {
      fetch().catch(() => {
        // Errors are already handled in fetch
      });
    }, 0);
  }

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

  const resource = createResource<T>({
    ...rest,
    url: 'frappe.client.get',
    makeParams: () => ({
      doctype,
      name,
      ...(options.makeParams ? options.makeParams() : {}),
    }),
  });

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