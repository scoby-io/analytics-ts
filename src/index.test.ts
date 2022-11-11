import { Client } from './';
import nock from 'nock';

const USERAGENT = 'Mozilla/Safari/Chrome/1.2';
const IP_ADDRESS = '2.3.4.5';
const REFERRING_URL = 'https://www.referrer.de/i-refer?bar=foo';
const REQUESTED_URL =
  'www.this-host-was-called.com/and-this-was-the-path?with=query';

describe('Client', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should initialize', () => {
    const client = new Client('xyz789');
    expect(client).toBeInstanceOf(Client);
  });

  it('should throw on error', async () => {
    const client = new Client('xyz789');

    nock('https://xyz789.s3y.io')
      .intercept(() => true, 'GET')
      .replyWithError('Internal Server Error');

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should fail on non 204 response', async () => {
    const client = new Client('xyz789');

    nock('https://xyz789.s3y.io')
      .intercept(() => true, 'GET')
      .reply(201);

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should log page view', async () => {
    const client = new Client('xyz789');

    const uris: string[] = [];
    nock('https://xyz789.s3y.io')
      .intercept((uri) => {
        uris.push(uri);
        return true;
      }, 'GET')
      .reply(204);

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
      }),
    ).resolves.toEqual(true);

    expect(uris).toMatchSnapshot();
  });

  it('should log page view with referrer', async () => {
    const client = new Client('xyz789');

    const uris: string[] = [];
    nock('https://xyz789.s3y.io')
      .intercept((uri) => {
        uris.push(uri);
        return true;
      }, 'GET')
      .reply(204);

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
        referringUrl: REFERRING_URL,
      }),
    ).resolves.toEqual(true);

    expect(uris).toMatchSnapshot();
  });

  it('should log page view with visitorId', async () => {
    const client = new Client('xyz789');

    const uris: string[] = [];
    nock('https://xyz789.s3y.io')
      .intercept((uri) => {
        uris.push(uri);
        return true;
      }, 'GET')
      .reply(204);

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
        visitorId: 'hello I am a value that wil be hashed before transfer',
      }),
    ).resolves.toEqual(true);

    expect(uris).toMatchSnapshot();
  });
});
