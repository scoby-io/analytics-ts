import got from 'got';
import buildUrl, { IQueryParams } from 'build-url-ts';
import { createHash } from 'crypto';

export interface PageView {
  ipAddress: string;
  userAgent: string;
  requestedUrl: string;
  visitorId?: string;
  referringUrl?: string;
}

export class Client {
  private readonly apiHost: string;

  constructor(private jarId: string) {
    this.apiHost = `https://${this.jarId}.s3y.io`;
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private getVisitorId(pageView: PageView): string {
    const { visitorId, ipAddress, userAgent } = pageView;
    if (visitorId) {
      return this.hash([visitorId, this.jarId].join('|'));
    }

    return this.hash([ipAddress, userAgent, this.jarId].join('|'));
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
