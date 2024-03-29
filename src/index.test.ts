import { Client } from './';
import nock from 'nock';

const USERAGENT = 'Mozilla/Safari/Chrome/1.2';
const IP_ADDRESS = '2.3.4.5';
const REFERRING_URL = 'https://www.referrer.de/i-refer?bar=foo';
const REQUESTED_URL =
  'https://www.this-host-was-called.com/and-this-was-the-path?with=query&utm_source=adprovider';

describe('Client', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should initialize', () => {
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );
    expect(client).toBeInstanceOf(Client);
  });

  it('should throw on error', async () => {
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

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
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

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
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

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
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

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
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

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

  it('should log page view with non-blocked ip', async () => {
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

    const uris: string[] = [];
    nock('https://xyz789.s3y.io')
      .intercept((uri) => {
        uris.push(uri);
        return true;
      }, 'GET')
      .reply(204);

    client.blacklistIpRange('7.8.9.*');

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
      }),
    ).resolves.toEqual(true);

    expect(uris).toMatchSnapshot();
  });

  it('should not log page view with blocked ip', async () => {
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

    const uris: string[] = [];
    nock('https://xyz789.s3y.io')
      .intercept((uri) => {
        uris.push(uri);
        return true;
      }, 'GET')
      .reply(204);

    client.blacklistIpRange('2.3.4.*');

    await expect(
      client.logPageView({
        ipAddress: IP_ADDRESS,
        requestedUrl: REQUESTED_URL,
        userAgent: USERAGENT,
      }),
    ).resolves.toEqual(false);

    expect(uris.length).toEqual(0);
  });

  it('should log page view visitor segments', async () => {
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

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
        visitorSegments: ['Subscribers', 'Women', 'Young Adults'],
      }),
    ).resolves.toEqual(true);

    expect(uris).toMatchSnapshot();
  });

  it('should log page view with additional whitelisted params', async () => {
    const client = new Client(
      'eHl6Nzg5fDhRZWJ5emlYc2lxVUdlSHpYU0R6YWpQaFVVS2R5czJl',
      'udUJiJwY44O6i2lAos8RmA==',
    );

    client.addWhitelistedUrlParameter('with');

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
});
