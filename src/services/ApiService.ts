import axios from 'axios';

const env = {
  dev: {
    url:
      'https://qt6manqtzbhkvd6tcxvchusmyq.appsync-api.us-east-1.amazonaws.com/graphql',
    apiKey: 'da2-6zfuocqmhvecrfkng7hx2oipni',
  },
  prod: {
    url:
      'https://4etvlewcdnamtpf7pl2engjw6y.appsync-api.us-east-1.amazonaws.com/graphql',
    apiKey: 'da2-b5fz4t7epfczvjlgbjroyt4cc4',
  },
};
const settings = env.dev;

type QueryRequest = {
  variables: any;
  query: any;
};

export async function runGraphQLQuery(
  queryRequest: QueryRequest
): Promise<any> {
  const response = await axios.post(settings.url, queryRequest, {
    headers: {
      'x-api-key': settings.apiKey,
      'Content-Type': 'application/json',
    },
  });
  const result = response.data.data;
  //console.log("ApiService.post(): response = %o", result);
  return result;
}

export async function post(url: string, data: any): Promise<any> {
  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = response;
  console.log('ApiService.post(): response = %o', result);
  return result;
}

export async function get(url: string, _data?: any): Promise<any> {
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  //    console.log("ApiService.get(): response = ", response);
  const result = response.data;
  return result;
}
