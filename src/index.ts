import got from 'got';
import buildUrl, { IQueryParams } from 'build-url-ts';
import { createHmac } from 'crypto';
import { matches } from 'ip-matching';

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
  private ipBlacklistPatterns: string[] = [];
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
    const parts = Buffer.from(this.apiKey, 'base64')
      .toString('ascii')
      .split('|');
    if (parts.length > 0) {
      new Error('failed to extract jarId from apiKey');
    }
    return parts[0] as string;
  }

  public async logPageView(pageView: PageView): Promise<boolean> {
    const { userAgent, requestedUrl, referringUrl, ipAddress } = pageView;

    if (this.isBlockedIp(ipAddress)) {
      return false;
    }

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

  private isBlockedIp(ipAddress: string): boolean {
    for (const pattern of this.ipBlacklistPatterns) {
      if (matches(ipAddress, pattern)) return true;
    }
    return false;
  }

  public blacklistIpRange(pattern: string) {
    this.ipBlacklistPatterns.push(pattern);
  }
}
