import got from 'got';
import buildUrl, { IQueryParams } from 'build-url-ts';
import { createHmac } from 'crypto';

export interface PageView {
  ipAddress: string;
  userAgent: string;
  requestedUrl: string;
  visitorId?: string;
  referringUrl?: string;
}

export class Client {
  private readonly jarId: string;
  private readonly apiHost: string;
  constructor(private apiKey: string, private readonly salt: string) {
    this.jarId = this.getJarId();
    this.apiHost = `https://${this.jarId}.s3y.io`;
  }

  private hash(value: string): string {
    const hmac = createHmac('sha256', this.salt);
    return hmac.update(Buffer.from(value, 'utf-8')).digest('hex');
  }

  private getVisitorId(pageView: PageView): string {
    const { visitorId, ipAddress, userAgent } = pageView;
    if (visitorId) {
      return this.hash([visitorId, this.jarId].join('|'));
    }

    return this.hash([ipAddress, userAgent, this.jarId].join('|'));
  }

  private getJarId(): string {
    const buffer = new Buffer(this.apiKey, 'base64');
    const parts = buffer.toString('ascii').split('|');
    if (parts.length > 0) {
      new Error('failed to extract jarId from apiKey');
    }
    return parts[0] as string;
  }

  public async logPageView(pageView: PageView): Promise<boolean> {
    const { userAgent, requestedUrl, referringUrl } = pageView;

    const queryParams: IQueryParams = {
      vid: this.getVisitorId(pageView),
      ua: userAgent,
      url: requestedUrl,
    };

    if (referringUrl) {
      queryParams['ref'] = referringUrl;
    }

    const url = buildUrl(this.apiHost, {
      path: '/count',
      queryParams,
    });

    const options = {
      timeout: {
        send: 5000,
      },
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    const { statusCode } = await got(url, options).catch((error) => {
      throw new Error('failed to log page view' + error.message);
    });
    if (statusCode === 204) {
      return true;
    }
    throw new Error('failed to log page view. Status code: ' + statusCode);
  }
}
